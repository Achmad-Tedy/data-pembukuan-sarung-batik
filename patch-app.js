const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
code = code.replace(/import \{ AlertCircle, CheckCircle2, Info \} from 'lucide-react';/, 
  "import { AlertCircle, CheckCircle2, Info } from 'lucide-react';\nimport * as api from './lib/api';");

// Replace products state
code = code.replace(/const \[products, setProducts\] = useState<ProductItem\[\]>\(\(\) => \{[\s\S]*?\}\);/, 
  "const [products, setProducts] = useState<ProductItem[]>([]);\n  const [isLoading, setIsLoading] = useState(true);");

// Replace transactions state
code = code.replace(/const \[transactions, setTransactions\] = useState<Transaction\[\]>\(\(\) => \{[\s\S]*?\}\);/, 
  "const [transactions, setTransactions] = useState<Transaction[]>([]);\n  useEffect(() => {\n    const loadData = async () => {\n      try {\n        setIsLoading(true);\n        const [prods, txs] = await Promise.all([api.fetchProducts(), api.fetchTransactions()]);\n        setProducts(prods);\n        setTransactions(txs);\n      } catch (err) {\n        console.error(err);\n        showToast('Gagal memuat data dari database', 'error');\n      } finally {\n        setIsLoading(false);\n      }\n    };\n    loadData();\n  }, []);");

// Remove useEffects for localStorage
code = code.replace(/\/\/ Save changes to localStorage[\s\S]*?\}, \[transactions\]\);/, "");

// Patch handleSaveSale
code = code.replace(/const handleSaveSale = \(saleData: \{([\s\S]*?)\}\) => \{([\s\S]*?)showToast\(`Penjualan \$\{invoiceNo\} berhasil dicatat & stok diperbarui!`, 'success'\);\n  \};/,
`const handleSaveSale = async (saleData: {$1}) => {$2
    try {
      const { id, ...txWithoutId } = newTx;
      const savedTx = await api.addTransaction(txWithoutId);
      
      const updatedProducts = products.map((p) => {
        const purchasedItem = saleData.items.find((it) => it.productId === p.id);
        if (purchasedItem) {
          const updatedProduct = { ...p, stock: Math.max(0, p.stock - purchasedItem.quantity) };
          api.updateProduct(updatedProduct).catch(console.error);
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
  };`);
  
// Fix the generated handleSaveSale inner block replacing the old synchronous update
code = code.replace(/const updatedProducts = products\.map\(\(p\) => \{[\s\S]*?\}\);[\s\S]*?setProducts\(updatedProducts\);[\s\S]*?setTransactions\(\[newTx, \.\.\.transactions\]\);/, "");

// Let's refine the script to be simpler: Just rewrite the handlers one by one.
