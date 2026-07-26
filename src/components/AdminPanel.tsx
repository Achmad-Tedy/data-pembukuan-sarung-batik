import React, { useState } from 'react';
import { Settings, Save, Shield, CheckCircle2, PackagePlus, Table, PlusCircle, Trash2, AlertTriangle } from 'lucide-react';
import { ProductItem, BatikCategory } from '../types';

interface AdminPanelProps {
  appName: string;
  setAppName: (name: string) => void;
  products: ProductItem[];
  setProducts: React.Dispatch<React.SetStateAction<ProductItem[]>>;
  onClearTransactions: () => void;
  onResetData: () => void;
}

export function AdminPanel({ appName, setAppName, products, setProducts, onClearTransactions, onResetData }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'input' | 'sizes' | 'settings'>('input');
  
  // Settings State
  const [localAppName, setLocalAppName] = useState(appName);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  // Input Product State
  const [newProduct, setNewProduct] = useState<Partial<ProductItem>>({
    name: '',
    sku: '',
    category: 'Batik Cap',
    costPrice: 0,
    sellingPrice: 0,
    stock: 0,
    minStockAlert: 5,
    variation: '',
    size: ''
  });

  const CATEGORIES: BatikCategory[] = [
    'Batik Cap', 'Batik Tulis', 'Batik Print', 'Batik Halus Pekalongan', 'Batik Solo', 'Batik Custom'
  ];

  // Dummy Size Guide Data
  const initialSizeGuide = [
    { id: 1, name: 'Dewasa Standar', width: '120 cm', length: '220 cm', note: 'Sarung dewasa umum' },
    { id: 2, name: 'Dewasa Jumbo', width: '130 cm', length: '230 cm', note: 'Sarung ukuran besar' },
    { id: 3, name: 'Anak-anak', width: '90 cm', length: '115 cm', note: 'Sarung untuk anak usia 7-12' },
  ];

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword && newPassword !== confirmPassword) {
      setError('Password baru tidak cocok.');
      return;
    }

    setAppName(localAppName);
    localStorage.setItem('batik_app_name', localAppName);

    if (newPassword) {
      localStorage.setItem('batik_admin_password', newPassword);
    }

    setShowSuccess(true);
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProduct.name || !newProduct.sku || !newProduct.sellingPrice) {
      alert("Harap lengkapi field wajib: Nama, SKU, Harga Jual");
      return;
    }

    const productToAdd: ProductItem = {
      ...newProduct as ProductItem,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setProducts(prev => [productToAdd, ...prev]);
    
    // Reset form
    setNewProduct({
      name: '',
      sku: '',
      category: 'Batik Cap',
      costPrice: 0,
      sellingPrice: 0,
      stock: 0,
      minStockAlert: 5,
      variation: '',
      size: ''
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="bg-slate-800 rounded-2xl shadow-sm border border-slate-700/50 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-slate-900/80 border-r border-slate-700/50 flex flex-col">
        <div className="p-6 border-b border-slate-700/50">
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span>Panel Admin</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Kelola data master & pengaturan</p>
        </div>
        
        <div className="flex-1 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('input')}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'input' 
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-medium' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <PackagePlus className="w-5 h-5" />
            <span>Input Barang</span>
          </button>
          
          <button
            onClick={() => setActiveTab('sizes')}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'sizes' 
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-medium' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Table className="w-5 h-5" />
            <span>Tabel Ukuran</span>
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'settings' 
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-medium' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Pengaturan Akun</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 lg:p-8 bg-slate-800">
        
        {/* TAB: INPUT BARANG */}
        {activeTab === 'input' && (
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-2">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
                <PackagePlus className="w-6 h-6 text-blue-400" />
                <span>Input Barang Baru</span>
              </h3>
              <p className="text-sm text-slate-400 mt-1">Tambahkan data produk ke dalam inventaris toko.</p>
            </div>

            {showSuccess && (
              <div className="mb-6 flex items-center space-x-2 bg-emerald-900/20 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">Data barang berhasil ditambahkan ke inventaris.</span>
              </div>
            )}

            <form onSubmit={handleAddProduct} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Jenis & Nama */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Jenis Barang (Kategori)</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value as BatikCategory})}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Nama Barang / Motif</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="Contoh: Sarung Batik Cap Bunga"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>

                {/* SKU & Variasi */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Kode Barang (SKU)</label>
                  <input
                    type="text"
                    required
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                    placeholder="Contoh: SRG-CP-001"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all uppercase"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Variasi (Warna/Corak)</label>
                  <input
                    type="text"
                    value={newProduct.variation}
                    onChange={(e) => setNewProduct({...newProduct, variation: e.target.value})}
                    placeholder="Contoh: Merah Maroon, Hijau Botol"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>

                {/* Stock & Ukuran */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Jumlah Stock Awal</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newProduct.stock === 0 ? '' : newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
                    placeholder="0"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Ukuran</label>
                  <select
                    value={newProduct.size}
                    onChange={(e) => setNewProduct({...newProduct, size: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  >
                    <option value="">-- Pilih Ukuran --</option>
                    {initialSizeGuide.map(s => (
                      <option key={s.id} value={s.name}>{s.name} ({s.width} x {s.length})</option>
                    ))}
                  </select>
                </div>

                {/* Harga Modal & Jual */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Harga Modal (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newProduct.costPrice === 0 ? '' : newProduct.costPrice}
                    onChange={(e) => setNewProduct({...newProduct, costPrice: parseInt(e.target.value) || 0})}
                    placeholder="0"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Harga Jual (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newProduct.sellingPrice === 0 ? '' : newProduct.sellingPrice}
                    onChange={(e) => setNewProduct({...newProduct, sellingPrice: parseInt(e.target.value) || 0})}
                    placeholder="0"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Simpan Ke Data Barang</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* TAB: TABEL UKURAN */}
        {activeTab === 'sizes' && (
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-2">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
                <Table className="w-6 h-6 text-blue-400" />
                <span>Tabel Panduan Ukuran</span>
              </h3>
              <p className="text-sm text-slate-400 mt-1">Standar ukuran sarung batik yang tersedia.</p>
            </div>

            <div className="bg-slate-900/50 rounded-2xl border border-slate-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-700/50">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Jenis Ukuran</th>
                      <th className="px-6 py-4 font-semibold">Lebar</th>
                      <th className="px-6 py-4 font-semibold">Panjang</th>
                      <th className="px-6 py-4 font-semibold">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {initialSizeGuide.map((size) => (
                      <tr key={size.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-200">{size.name}</td>
                        <td className="px-6 py-4">{size.width}</td>
                        <td className="px-6 py-4">{size.length}</td>
                        <td className="px-6 py-4 text-slate-400">{size.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
              <p className="text-sm text-blue-300">
                <strong>Catatan:</strong> Tabel ukuran ini digunakan sebagai referensi saat melakukan input barang baru. 
                Pilih ukuran yang sesuai di form "Input Barang".
              </p>
            </div>
          </div>
        )}

        {/* TAB: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-2">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
                <Settings className="w-6 h-6 text-blue-400" />
                <span>Pengaturan Aplikasi & Akun</span>
              </h3>
              <p className="text-sm text-slate-400 mt-1">Ubah nama aplikasi atau password akses Web Admin.</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              {showSuccess && (
                <div className="flex items-center space-x-2 bg-emerald-900/20 text-emerald-400 p-4 rounded-xl border border-emerald-500/30">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">Pengaturan berhasil disimpan.</span>
                </div>
              )}

              {error && (
                <div className="flex items-center space-x-2 bg-rose-900/20 text-rose-400 p-4 rounded-xl border border-rose-900/50">
                  <Shield className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50 space-y-4">
                <h4 className="text-md font-bold text-slate-200">Profil Aplikasi</h4>
                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2">Nama Aplikasi</label>
                  <input
                    type="text"
                    value={localAppName}
                    onChange={(e) => setLocalAppName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50 space-y-4">
                <h4 className="text-md font-bold text-slate-200">Keamanan Akses Bos (Admin)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Password Baru (Opsional)</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Kosongkan jika tidak diubah"
                      className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Konfirmasi Password Baru</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ketik ulang password baru"
                      className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-bold transition-colors border border-slate-600"
                >
                  <Save className="w-5 h-5" />
                  <span>Update Pengaturan</span>
                </button>
              </div>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-700/50 space-y-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-rose-400 flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Manajemen Data (Berbahaya)</span>
                </h3>
                <p className="text-sm text-slate-400 mt-1">Aksi di bawah ini tidak dapat dibatalkan. Harap berhati-hati.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-rose-950/20 p-5 rounded-2xl border border-rose-900/50 flex flex-col justify-between">
                  <div>
                    <h4 className="text-md font-bold text-slate-200">Kosongkan Riwayat Transaksi</h4>
                    <p className="text-xs text-slate-400 mt-1 mb-4">Menghapus semua riwayat pemasukan dan pengeluaran. Stok barang tidak akan terpengaruh.</p>
                  </div>
                  <button
                    onClick={onClearTransactions}
                    className="w-full flex items-center justify-center space-x-2 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white px-4 py-2.5 rounded-xl font-medium transition-all border border-rose-600/30 hover:border-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus Semua Riwayat</span>
                  </button>
                </div>

                <div className="bg-rose-950/20 p-5 rounded-2xl border border-rose-900/50 flex flex-col justify-between">
                  <div>
                    <h4 className="text-md font-bold text-slate-200">Hapus Semua Data</h4>
                    <p className="text-xs text-slate-400 mt-1 mb-4">Menghapus seluruh riwayat transaksi beserta daftar stok barang. Aplikasi akan kembali kosong.</p>
                  </div>
                  <button
                    onClick={onResetData}
                    className="w-full flex items-center justify-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-rose-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus Keseluruhan Data</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
