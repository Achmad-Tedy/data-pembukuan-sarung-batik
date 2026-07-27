import React, { useState, useEffect } from 'react';
import { ProductItem, Transaction, PaymentMethod, ExpenseCategory, TransactionItemDetail } from './types';
import { INITIAL_PRODUCTS, INITIAL_TRANSACTIONS } from './data/initialData';
import { calculateMetrics, exportTransactionsToCSV } from './utils/formatters';
import { Header } from './components/Header';
import { SettingsModal } from './components/SettingsModal';
import { StatCards } from './components/StatCards';
import { InventoryManager } from './components/InventoryManager';
import { NewSaleModal } from './components/NewSaleModal';
import { ExpenseModal } from './components/ExpenseModal';
import { TransactionHistory } from './components/TransactionHistory';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { ReceiptModal } from './components/ReceiptModal';
import { Login } from './components/Login';
import { AdminPanel } from './components/AdminPanel';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import * as api from './lib/api';

export default function App() {
  // Application Settings State
  const [appName, setAppName] = useState(() => {
    return localStorage.getItem('batik_app_name') || 'Pembukuan Sarung Batik Pasuruan';
  });

  const [logoUrl, setLogoUrl] = useState(() => {
    return localStorage.getItem('batik_logo_url') || 'https://lh3.googleusercontent.com/d/14NRix0QJ1BuDB79624v8J2U4x_P-jaY4';
  });
  const [themeColor, setThemeColor] = useState(() => {
    return localStorage.getItem('batik_theme_color') || 'blue';
  });
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);


  // 1. Persistent State
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [prods, txs] = await Promise.all([api.fetchProducts(), api.fetchTransactions()]);
        setProducts(prods);
        setTransactions(txs);
      } catch (err) {
        console.error(err);
        showToast('Gagal memuat data dari database', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Auth State
  const [userRole, setUserRole] = useState<'admin' | 'cashier' | null>(() => {
    return sessionStorage.getItem('batik_role') as 'admin' | 'cashier' | null;
  });
  const [loginError, setLoginError] = useState<string>('');

  
  
  useEffect(() => {
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = logoUrl;
    document.getElementsByTagName('head')[0].appendChild(link);
    document.title = appName;
  }, [logoUrl, appName]);

  const handleSaveSettings = (newAppName: string, newLogoUrl: string, newThemeColor: string) => {
    setAppName(newAppName);
    setLogoUrl(newLogoUrl);
    setThemeColor(newThemeColor);
    localStorage.setItem('batik_app_name', newAppName);
    localStorage.setItem('batik_logo_url', newLogoUrl);
    localStorage.setItem('batik_theme_color', newThemeColor);
    setIsSettingsModalOpen(false);
    showToast('Pengaturan tampilan berhasil disimpan', 'success');
  };

  const handleLogin = (role: 'admin' | 'cashier', password?: string) => {
    if (role === 'admin') {
      const savedPassword = localStorage.getItem('batik_admin_password') || 'admin123';
      if (password === savedPassword) {
        setUserRole('admin');
        sessionStorage.setItem('batik_role', 'admin');
        setLoginError('');
      } else {
        setLoginError('Password admin salah. Silakan coba lagi.');
      }
    } else {
      setUserRole('cashier');
      sessionStorage.setItem('batik_role', 'cashier');
      setLoginError('');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    sessionStorage.removeItem('batik_role');
    setActiveTab('dashboard');
  };

  

  // UI state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'history' | 'analytics' | 'admin'>('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all'); // 'today' | '7days' | 'month' | 'all'

  // Modals state
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<Transaction | null>(null);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Filter transactions based on selectedPeriod
  const filteredTransactionsByPeriod = transactions.filter((tx) => {
    if (selectedPeriod === 'all') return true;
    const txDate = new Date(tx.date);
    const now = new Date();

    if (selectedPeriod === 'today') {
      return (
        txDate.getDate() === now.getDate() &&
        txDate.getMonth() === now.getMonth() &&
        txDate.getFullYear() === now.getFullYear()
      );
    } else if (selectedPeriod === '7days') {
      const diffTime = now.getTime() - txDate.getTime();
      return diffTime <= 7 * 24 * 60 * 60 * 1000;
    } else if (selectedPeriod === 'month') {
      return (
        txDate.getMonth() === now.getMonth() &&
        txDate.getFullYear() === now.getFullYear()
      );
    }
    return true;
  });

  // Real-time calculated metrics
  const metrics = calculateMetrics(filteredTransactionsByPeriod, products);

  // Handlers: Save Sale (Pemasukan)
  const handleSaveSale = async (saleData: {
    buyerName: string;
    paymentMethod: PaymentMethod;
    discount: number;
    items: TransactionItemDetail[];
  }) => {
    const now = new Date();
    const dateStr = now.toISOString();
    const invoiceNo = `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(100 + Math.random() * 900))}`;

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
      showToast(`Penjualan ${invoiceNo} berhasil dicatat & stok diperbarui!`, 'success');
    } catch (err) {
      console.error(err);
      showToast(`Gagal: ${(err as Error).message || 'Gagal menyimpan penjualan'}`, 'error');
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
    const invoiceNo = `EXP-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(100 + Math.random() * 900))}`;

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
      showToast(`Pengeluaran Rp${expenseData.amount.toLocaleString('id-ID')} berhasil dicatat!`, 'info');
    } catch (err) {
      console.error(err);
      showToast(`Gagal: ${(err as Error).message || 'Gagal menyimpan pengeluaran'}`, 'error');
    }
  };

  // Handlers: Add Product
  const handleAddProduct = async (newProductData: Omit<ProductItem, 'id' | 'createdAt'>) => {
    try {
      const savedProduct = await api.addProduct(newProductData);
      setProducts([savedProduct, ...products]);
      showToast(`Sarung batik "${savedProduct.name}" berhasil ditambahkan!`, 'success');
    } catch (err) {
      console.error(err);
      showToast(`Gagal: ${(err as Error).message || 'Gagal menambahkan produk'}`, 'error');
    }
  };

  // Handlers: Update Product
  const handleUpdateProduct = async (updatedProduct: ProductItem) => {
    try {
      await api.updateProduct(updatedProduct);
      setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
      showToast(`Data barang "${updatedProduct.name}" diperbarui!`, 'info');
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
      showToast(`Barang ${p ? p.name : ''} telah dihapus.`, 'info');
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
        const invoiceNo = `STK-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(100 + Math.random() * 900))}`;
        const newTx: Omit<Transaction, 'id'> = {
          invoiceNo,
          type: 'pengeluaran',
          date: now.toISOString(),
          timestamp: now.getTime(),
          expenseCategory: 'Pembelian Stok',
          amount: expenseAmount,
          description: `Restock ${qtyToAdd} pcs - ${product.name}`,
          notes: `Auto-generated dari restock stok barang.`,
        };
        const savedTx = await api.addTransaction(newTx);
        setTransactions([savedTx, ...transactions]);
      }
      showToast(`Berhasil menambah ${qtyToAdd} stok untuk ${product.name}.`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal restock produk', 'error');
    }
  };

  // Handlers: Delete Transaction
  const handleDeleteTransaction = async (txId: string) => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx) return;

    if (!confirm(`Apakah Anda yakin ingin menghapus riwayat ${tx.invoiceNo}?`)) return;

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
      showToast(`Transaksi ${tx.invoiceNo} dihapus ${tx.type === 'pemasukan' ? '& stok barang dikembalikan' : ''}.`, 'info');
    } catch (err) {
      console.error(err);
      showToast('Gagal menghapus transaksi', 'error');
    }
  };

  
  const handleEditTransaction = async (txId: string, updates: Partial<Transaction>) => {
    try {
      await api.updateTransaction(txId, updates);
      
      const txIndex = transactions.findIndex(t => t.id === txId);
      if (txIndex !== -1) {
        const newTransactions = [...transactions];
        newTransactions[txIndex] = { ...newTransactions[txIndex], ...updates };
        setTransactions(newTransactions);
      }
      
      showToast('Transaksi berhasil dikoreksi', 'info');
    } catch (err) {
      console.error(err);
      showToast('Gagal mengoreksi transaksi', 'error');
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
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center flex-col space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-200 font-medium animate-pulse">Menghubungkan ke database...</p>
      </div>
    );
  }

  if (!userRole) {
    return <Login onLogin={handleLogin} error={loginError} appName={appName} />;
  }

  return (
    <div className="min-h-screen bg-slate-900/95 text-slate-100 font-sans antialiased selection:bg-blue-300">
      
      {/* Toast Notification Floating Banner */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-blue-900 flex items-center space-x-3 text-xs animate-bounce">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* App Header & Navigation */}
      <Header
        logoUrl={logoUrl}
        themeColor={themeColor}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        appName={appName}
        userRole={userRole}
        onOpenSaleModal={() => setIsSaleModalOpen(true)}
        onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
        onOpenNewProductModal={() => setIsNewProductModalOpen(true)}
        onExportCSV={() => exportTransactionsToCSV(transactions)}
        onResetData={handleResetData}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Metric Cards Banner (Always visible or primary on Dashboard) */}
        {activeTab !== 'admin' && (
          <StatCards
            metrics={metrics}
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
          />
        )}

        {/* Tab 1: Ringkasan Dashboard & Activity Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Quick Actions & Recent Transactions Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Recent Transactions Preview */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-sm">
                  <h3 className="font-serif font-bold text-base text-slate-100">
                    ⚡ Transaksi Terakhir (Real-Time Log)
                  </h3>
                  <button
                    onClick={() => setActiveTab('history')}
                    className="text-xs font-semibold text-blue-700 hover:underline cursor-pointer"
                  >
                    Lihat Semua ({transactions.length}) →
                  </button>
                </div>

                <TransactionHistory
                  transactions={transactions.slice(0, 5)}
                  onDeleteTransaction={handleDeleteTransaction}
            onEditTransaction={handleEditTransaction}
                  onSelectReceipt={(tx) => setSelectedReceiptTx(tx)}
                  onExportCSV={() => exportTransactionsToCSV(transactions)}
                  selectedPeriod={selectedPeriod}
                />
              </div>

              {/* Right Column: Inventory Stock Snapshot */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
                    <h3 className="font-serif font-bold text-sm text-slate-100">
                      📦 Status Stok Sarung Batik
                    </h3>
                    <button
                      onClick={() => setActiveTab('inventory')}
                      className="text-xs text-blue-700 font-semibold hover:underline cursor-pointer"
                    >
                      Kelola →
                    </button>
                  </div>

                  <div className="space-y-2.5 divide-y divide-slate-700/50 max-h-96 overflow-y-auto pr-1 text-xs">
                    {products.map((p) => {
                      const isLow = p.stock <= p.minStockAlert;
                      return (
                        <div key={p.id} className="pt-2 flex items-center justify-between">
                          <div className="space-y-0.5 max-w-[65%]">
                            <p className="font-semibold text-slate-100 truncate">{p.name}</p>
                            <p className="text-[10px] text-slate-500">{p.sku} • {p.category}</p>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                              p.stock <= 0
                                ? 'bg-rose-100 text-rose-800'
                                : isLow
                                ? 'bg-blue-800/50 text-blue-700'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {p.stock} Pcs
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Full Transaction History Real-Time */}
        {activeTab === 'history' && (
          <TransactionHistory
            transactions={filteredTransactionsByPeriod}
            onDeleteTransaction={handleDeleteTransaction}
            onSelectReceipt={(tx) => setSelectedReceiptTx(tx)}
            onExportCSV={() => exportTransactionsToCSV(filteredTransactionsByPeriod)}
            selectedPeriod={selectedPeriod}
          />
        )}

        {/* Tab 3: Inventory & Products Management */}
        {activeTab === 'inventory' && (
          <InventoryManager
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onRestockProduct={handleRestockProduct}
            isAddModalOpen={isNewProductModalOpen}
            setIsAddModalOpen={setIsNewProductModalOpen}
          />
        )}

        {/* Tab 4: Analytics & Visual Charts */}
        {activeTab === 'analytics' && (
          <AnalyticsCharts
            transactions={filteredTransactionsByPeriod}
            products={products}
          />
        )}

        {/* Tab 5: Admin Panel */}
        {activeTab === 'admin' && (
          <AdminPanel
            appName={appName}
            setAppName={setAppName}
            products={products}
            setProducts={setProducts}
            onClearTransactions={handleClearTransactions}
            onResetData={handleResetData}
          />
        )}

      </main>

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <SettingsModal
          currentAppName={appName}
          currentLogoUrl={logoUrl}
          currentThemeColor={themeColor}
          onSave={handleSaveSettings}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      )}

      {/* Modal 1: Input Sale (Pemasukan) */}
      <NewSaleModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        products={products}
        onSaveSale={handleSaveSale}
      />

      {/* Modal 2: Input Expense (Pengeluaran) */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSaveExpense={handleSaveExpense}
      />

      {/* Modal 3: Printable Receipt */}
      {/* Modal 3: Printable Receipt */}
      <ReceiptModal
        transaction={selectedReceiptTx}
        onClose={() => setSelectedReceiptTx(null)}
        appName={appName}
        logoUrl={logoUrl}
        cashierName={userRole === 'admin' ? 'Bos' : 'Kasir'}
      />

    </div>
  );
}
