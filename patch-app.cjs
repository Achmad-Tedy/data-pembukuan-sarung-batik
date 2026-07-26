const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
code = code.replace(/import \{ AlertCircle, CheckCircle2, Info \} from 'lucide-react';/, 
  "import { AlertCircle, CheckCircle2, Info } from 'lucide-react';\nimport * as api from './lib/api';");

// Replace products state
code = code.replace(/const \[products, setProducts\] = useState<ProductItem\[\]>\(\(\) => \{[\s\S]*?return INITIAL_PRODUCTS;\n  \}\);/, 
  "const [products, setProducts] = useState<ProductItem[]>([]);\n  const [isLoading, setIsLoading] = useState(true);");

// Replace transactions state
code = code.replace(/const \[transactions, setTransactions\] = useState<Transaction\[\]>\(\(\) => \{[\s\S]*?return INITIAL_TRANSACTIONS;\n  \}\);/, 
  "const [transactions, setTransactions] = useState<Transaction[]>([]);\n  useEffect(() => {\n    const loadData = async () => {\n      try {\n        setIsLoading(true);\n        const [prods, txs] = await Promise.all([api.fetchProducts(), api.fetchTransactions()]);\n        setProducts(prods);\n        setTransactions(txs);\n      } catch (err) {\n        console.error(err);\n        showToast('Gagal memuat data dari database', 'error');\n      } finally {\n        setIsLoading(false);\n      }\n    };\n    loadData();\n  }, []);");

// Remove useEffects for localStorage
code = code.replace(/\/\/ Save changes to localStorage[\s\S]*?\}, \[transactions\]\);/, "");

// Replace the handlers entirely
code = code.replace(/\/\/ Handlers: Save Sale \(Pemasukan\)[\s\S]*?const handleResetData = \(\) => \{[\s\S]*?\}\;/m, 
`// Handlers: Save Sale (Pemasukan)
  const handleSaveSale = async (saleData: {
    buyerName: string;
    paymentMethod: PaymentMethod;
    discount: number;
    items: TransactionItemDetail[];
  }) => {
    const now = new Date();
    const dateStr = now.toISOString();
    const invoiceNo = \`INV-\$\{now.getFullYear()\}\$\{String(now.getMonth() + 1).padStart(2, '0')\}\$\{String(now.getDate()).padStart(2, '0')\}-\$\{String(Math.floor(100 + Math.random() * 900))\}\`;

    const totalCostPrice = saleData.items.reduce((acc, item) => acc + item.subtotalCost, 0);
    const totalSellingPrice = saleData.items.reduce((acc, item) => acc + item.subtotalSelling, 0);
    const netRevenue = Math.max(0, totalSellingPrice - saleData.discount);
    const grossProfit = netRevenue - totalCostPrice;

    const newTx: Omit<Transaction, 'id'> = {
      invoiceNo,
      type: 'pemasukan',
      date: dateStr,
      timestamp: now.getTime(),
      items: saleData.items,
      totalCostPrice,
      totalSellingPrice,
      discount: saleData.discount,
      netRevenue,
      grossProfit,
      paymentMethod: saleData.paymentMethod,
      buyerName: saleData.buyerName,
    };

    try {
      const savedTx = await api.addTransaction(newTx);
      
      const updatedProducts = products.map((p) => {
        const purchasedItem = saleData.items.find((it) => it.productId === p.id);
        if (purchasedItem) {
          const updatedProduct = { ...p, stock: Math.max(0, p.stock - purchasedItem.quantity) };
          api.updateProduct(updatedProduct).catch(console.error); // optimistic
          return updatedProduct;
        }
        return p;
      });

      setProducts(updatedProducts);
      setTransactions([savedTx, ...transactions]);
      showToast(\`Penjualan \$\{invoiceNo\} berhasil dicatat & stok diperbarui!\`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal menyimpan penjualan', 'error');
    }
  };

  // Handlers: Save Expense (Pengeluaran)
  const handleSaveExpense = async (expenseData: {
    category: ExpenseCategory;
    amount: number;
    description: string;
    notes?: string;
  }) => {
    const now = new Date();
    const dateStr = now.toISOString();
    const invoiceNo = \`EXP-\$\{now.getFullYear()\}\$\{String(now.getMonth() + 1).padStart(2, '0')\}\$\{String(now.getDate()).padStart(2, '0')\}-\$\{String(Math.floor(100 + Math.random() * 900))\}\`;

    const newTx: Omit<Transaction, 'id'> = {
      invoiceNo,
      type: 'pengeluaran',
      date: dateStr,
      timestamp: now.getTime(),
      expenseCategory: expenseData.category,
      amount: expenseData.amount,
      description: expenseData.description,
      notes: expenseData.notes,
    };

    try {
      const savedTx = await api.addTransaction(newTx);
      setTransactions([savedTx, ...transactions]);
      showToast(\`Pengeluaran Rp\$\{expenseData.amount.toLocaleString('id-ID')\} berhasil dicatat!\`, 'info');
    } catch (err) {
      console.error(err);
      showToast('Gagal menyimpan pengeluaran', 'error');
    }
  };

  // Handlers: Add Product
  const handleAddProduct = async (newProductData: Omit<ProductItem, 'id' | 'createdAt'>) => {
    try {
      const savedProduct = await api.addProduct(newProductData);
      setProducts([savedProduct, ...products]);
      showToast(\`Sarung batik "\$\{savedProduct.name\}" berhasil ditambahkan!\`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal menambahkan produk', 'error');
    }
  };

  // Handlers: Update Product
  const handleUpdateProduct = async (updatedProduct: ProductItem) => {
    try {
      await api.updateProduct(updatedProduct);
      setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
      showToast(\`Data barang "\$\{updatedProduct.name\}" diperbarui!\`, 'info');
    } catch (err) {
      console.error(err);
      showToast('Gagal mengupdate produk', 'error');
    }
  };

  // Handlers: Delete Product
  const handleDeleteProduct = async (productId: string) => {
    try {
      await api.deleteProduct(productId);
      const p = products.find((prod) => prod.id === productId);
      setProducts(products.filter((prod) => prod.id !== productId));
      showToast(\`Barang \$\{p ? p.name : ''\} telah dihapus.\`, 'info');
    } catch (err) {
      console.error(err);
      showToast('Gagal menghapus produk', 'error');
    }
  };

  // Handlers: Restock Product
  const handleRestockProduct = async (productId: string, qtyToAdd: number, recordAsExpense: boolean) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    try {
      const updatedProduct = { ...product, stock: product.stock + qtyToAdd };
      await api.updateProduct(updatedProduct);
      
      const updatedProducts = products.map((p) => p.id === productId ? updatedProduct : p);
      setProducts(updatedProducts);

      if (recordAsExpense) {
        const expenseAmount = qtyToAdd * product.costPrice;
        const now = new Date();
        const invoiceNo = \`STK-\$\{now.getFullYear()\}\$\{String(now.getMonth() + 1).padStart(2, '0')\}\$\{String(now.getDate()).padStart(2, '0')\}-\$\{String(Math.floor(100 + Math.random() * 900))\}\`;
        const newTx: Omit<Transaction, 'id'> = {
          invoiceNo,
          type: 'pengeluaran',
          date: now.toISOString(),
          timestamp: now.getTime(),
          expenseCategory: 'Pembelian Stok',
          amount: expenseAmount,
          description: \`Restock \$\{qtyToAdd\} pcs - \$\{product.name\}\`,
          notes: \`Auto-generated dari restock stok barang.\`,
        };
        const savedTx = await api.addTransaction(newTx);
        setTransactions([savedTx, ...transactions]);
      }
      showToast(\`Berhasil menambah \$\{qtyToAdd\} stok untuk \$\{product.name\}.\`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal restock produk', 'error');
    }
  };

  // Handlers: Delete Transaction
  const handleDeleteTransaction = async (txId: string) => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx) return;

    if (!confirm(\`Apakah Anda yakin ingin menghapus riwayat \$\{tx.invoiceNo\}?\`)) return;

    try {
      await api.deleteTransaction(txId);
      
      if (tx.type === 'pemasukan' && tx.items) {
        const updatedProducts = products.map((p) => {
          const purchasedItem = tx.items!.find((it) => it.productId === p.id);
          if (purchasedItem) {
            const updatedProduct = { ...p, stock: p.stock + purchasedItem.quantity };
            api.updateProduct(updatedProduct).catch(console.error);
            return updatedProduct;
          }
          return p;
        });
        setProducts(updatedProducts);
      }

      setTransactions(transactions.filter((t) => t.id !== txId));
      showToast(\`Transaksi \$\{tx.invoiceNo\} dihapus \$\{tx.type === 'pemasukan' ? '& stok barang dikembalikan' : ''\}.\`, 'info');
    } catch (err) {
      console.error(err);
      showToast('Gagal menghapus transaksi', 'error');
    }
  };

  const handleClearTransactions = async () => {
    if (confirm('Apakah Anda yakin ingin menghapus SEMUA riwayat transaksi? Data tidak dapat dikembalikan.')) {
      try {
        await api.clearTransactions();
        setTransactions([]);
        showToast('Seluruh riwayat transaksi berhasil dihapus.', 'info');
      } catch (err) {
        console.error(err);
        showToast('Gagal menghapus riwayat transaksi', 'error');
      }
    }
  };

  // Handlers: Reset Data
  const handleResetData = async () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua data barang dan riwayat transaksi? Data tidak dapat dikembalikan.')) {
      try {
        await api.clearTransactions();
        await api.clearProducts();
        setProducts([]);
        setTransactions([]);
        showToast('Seluruh data berhasil dikosongkan.', 'info');
      } catch (err) {
        console.error(err);
        showToast('Gagal mengosongkan data', 'error');
      }
    }
  };`);

fs.writeFileSync('src/App.tsx', code);
