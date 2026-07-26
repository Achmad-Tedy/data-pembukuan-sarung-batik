import React, { useState } from 'react';
import { ProductItem, BatikCategory } from '../types';
import { formatRupiah } from '../utils/formatters';
import { Package, Search, Plus, Edit2, Trash2, PlusCircle, AlertTriangle, CheckCircle, Tag, Layers } from 'lucide-react';

interface InventoryManagerProps {
  products: ProductItem[];
  onAddProduct: (product: Omit<ProductItem, 'id' | 'createdAt'>) => void;
  onUpdateProduct: (product: ProductItem) => void;
  onDeleteProduct: (id: string) => void;
  onRestockProduct: (id: string, qtyToAdd: number, recordAsExpense: boolean) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onRestockProduct,
  isAddModalOpen,
  setIsAddModalOpen,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Edit Modal state
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Restock Modal state
  const [restockProduct, setRestockProduct] = useState<ProductItem | null>(null);
  const [restockQty, setRestockQty] = useState<number>(10);
  const [recordExpenseOnRestock, setRecordExpenseOnRestock] = useState<boolean>(true);

  // New Product form state
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<BatikCategory>('Batik Cap');
  const [costPrice, setCostPrice] = useState<number>(50000);
  const [sellingPrice, setSellingPrice] = useState<number>(95000);
  const [stock, setStock] = useState<number>(20);
  const [minStockAlert, setMinStockAlert] = useState<number>(5);
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');

  // Auto generate SKU recommendation when name/category changes
  const handleAutoGenerateSku = () => {
    const prefix = category.substring(0, 3).toUpperCase().replace(/\s/g, '');
    const randomNum = Math.floor(100 + Math.random() * 900);
    setSku(`SB-${prefix}-${randomNum}`);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku.trim() || !name.trim()) {
      setFormError('Harap isi Kode SKU dan Nama Motif Sarung Batik.');
      return;
    }
    if (costPrice <= 0 || sellingPrice <= 0) {
      setFormError('Harga Modal dan Harga Jual harus lebih besar dari 0.');
      return;
    }

    onAddProduct({
      sku: sku.trim().toUpperCase(),
      name: name.trim(),
      category,
      costPrice,
      sellingPrice,
      stock,
      minStockAlert,
      description: description.trim() || undefined,
    });

    // Reset
    setSku('');
    setName('');
    setDescription('');
    setFormError('');
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    onUpdateProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockProduct || restockQty <= 0) return;
    onRestockProduct(restockProduct.id, restockQty, recordExpenseOnRestock);
    setRestockProduct(null);
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Inventory Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-800/50 rounded-xl text-blue-700">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 font-serif">Katalog &amp; Stok Sarung Batik</h2>
            <p className="text-xs text-slate-400">Kelola daftar motif, harga modal, harga jual, &amp; pasokan barang</p>
          </div>
        </div>

        <button
          onClick={() => {
            handleAutoGenerateSku();
            setIsAddModalOpen(true);
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-yellow-300 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Input Sarung Batik Baru</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama motif sarung, kode SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-600 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-2.5 px-3 bg-slate-800 border border-slate-600 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium text-slate-300"
          >
            <option value="all">Semua Kategori Batik ({products.length})</option>
            <option value="Batik Cap">Batik Cap</option>
            <option value="Batik Tulis">Batik Tulis</option>
            <option value="Batik Print">Batik Print</option>
            <option value="Batik Halus Pekalongan">Batik Halus Pekalongan</option>
            <option value="Batik Solo">Batik Solo</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-300 font-bold uppercase tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3.5 px-4">SKU / Kode</th>
                <th className="py-3.5 px-4">Nama Motif Sarung</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4 text-right">Harga Modal</th>
                <th className="py-3.5 px-4 text-right">Harga Jual</th>
                <th className="py-3.5 px-4 text-right">Estimasi Laba/Pcs</th>
                <th className="py-3.5 px-4 text-center">Stok Unit</th>
                <th className="py-3.5 px-4 text-center">Aksi &amp; Pasokan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500">
                    Tidak ada barang sarung batik yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const unitProfit = product.sellingPrice - product.costPrice;
                  const profitMargin = ((unitProfit / product.sellingPrice) * 100).toFixed(0);
                  const isLowStock = product.stock <= product.minStockAlert;
                  const isOutOfStock = product.stock <= 0;

                  return (
                    <tr key={product.id} className="hover:bg-blue-900/30/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                        {product.sku}
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-100">{product.name}</p>
                        {product.description && (
                          <p className="text-[11px] text-slate-500 truncate max-w-xs">{product.description}</p>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-md bg-slate-900 text-slate-300 font-medium border border-slate-700 text-[11px]">
                          {product.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right text-slate-400 font-medium">
                        {formatRupiah(product.costPrice)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-semibold text-emerald-700">
                        {formatRupiah(product.sellingPrice)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-medium">
                        <span className="text-blue-600 font-bold">{formatRupiah(unitProfit)}</span>
                        <span className="block text-[10px] text-slate-500">({profitMargin}%)</span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`px-3 py-1 rounded-full font-bold text-xs ${
                              isOutOfStock
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : isLowStock
                                ? 'bg-blue-800/50 text-blue-700 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-400 border border-emerald-300'
                            }`}
                          >
                            {product.stock} Pcs
                          </span>
                          {isOutOfStock ? (
                            <span className="text-[10px] text-rose-500 font-bold mt-0.5">HABIS</span>
                          ) : isLowStock ? (
                            <span className="text-[10px] text-blue-400 font-semibold mt-0.5">Stok Tipis</span>
                          ) : null}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          {/* Restock button */}
                          <button
                            onClick={() => {
                              setRestockProduct(product);
                              setRestockQty(10);
                            }}
                            title="Tambah Stok (Restock)"
                            className="px-2 py-1 bg-emerald-400/20 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-lg text-[11px] font-semibold flex items-center space-x-1 cursor-pointer"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>+ Stok</span>
                          </button>

                          {/* Edit button */}
                          <button
                            onClick={() => setEditingProduct(product)}
                            title="Edit Barang"
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-800/50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => {
                              if (confirm(`Yakin ingin menghapus ${product.name}?`)) {
                                onDeleteProduct(product.id);
                              }
                            }}
                            title="Hapus Barang"
                            className="p-1.5 text-slate-500 hover:text-rose-500 hover:bg-rose-400/20 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Add New Product */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-800 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-700 overflow-hidden my-8">
            <div className="bg-blue-700 text-yellow-300 p-4 sm:p-5 flex items-center justify-between">
              <h2 className="text-lg font-bold font-serif flex items-center space-x-2">
                <Package className="w-5 h-5 text-yellow-400" />
                <span>Input Barang Sarung Batik Baru</span>
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-amber-300 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-4 sm:p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-400/20 border border-rose-200 rounded-xl text-rose-700">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Kode SKU Sarung</label>
                  <div className="flex space-x-1">
                    <input
                      type="text"
                      placeholder="e.g. SB-CAP-101"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full p-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-600 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAutoGenerateSku}
                      title="Acak Kode SKU"
                      className="px-2 bg-slate-900 hover:bg-stone-200 border border-slate-600 rounded-lg font-bold text-slate-400"
                    >
                      ⚡
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Kategori Batik</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as BatikCategory)}
                    className="w-full p-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Batik Cap">Batik Cap</option>
                    <option value="Batik Tulis">Batik Tulis</option>
                    <option value="Batik Print">Batik Print</option>
                    <option value="Batik Halus Pekalongan">Batik Halus Pekalongan</option>
                    <option value="Batik Solo">Batik Solo</option>
                    <option value="Batik Custom">Batik Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Nama Motif / Sarung Batik</label>
                <input
                  type="text"
                  placeholder="misal: Sarung Batik Cap Pekalongan Motif Gurdo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Harga Modal / HPP (Rp)</label>
                  <input
                    type="number"
                    min="1"
                    value={costPrice || ''}
                    onChange={(e) => setCostPrice(parseInt(e.target.value) || 0)}
                    className="w-full p-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-600 font-semibold text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Harga Jual / Eceran (Rp)</label>
                  <input
                    type="number"
                    min="1"
                    value={sellingPrice || ''}
                    onChange={(e) => setSellingPrice(parseInt(e.target.value) || 0)}
                    className="w-full p-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-600 font-semibold text-emerald-700"
                  />
                </div>
              </div>

              {costPrice > 0 && sellingPrice > 0 && (
                <div className="bg-blue-900/30 p-2.5 rounded-lg border border-blue-300 flex justify-between text-blue-700">
                  <span>Estimasi Keuntungan per Pcs:</span>
                  <span className="font-bold">{formatRupiah(sellingPrice - costPrice)}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Jumlah Stok Awal (Pcs)</label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                    className="w-full p-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Batas Alert Stok Tipis</label>
                  <input
                    type="number"
                    min="1"
                    value={minStockAlert}
                    onChange={(e) => setMinStockAlert(parseInt(e.target.value) || 5)}
                    className="w-full p-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Keterangan / Deskripsi Bahan</label>
                <textarea
                  rows={2}
                  placeholder="Bahan katun primissima, ukuran 120 x 220 cm..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg font-semibold text-slate-400 bg-slate-900 hover:bg-stone-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg font-bold text-yellow-300 bg-blue-700 hover:bg-blue-600 shadow"
                >
                  Simpan Barang Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Restock / Tambah Pasokan Stok */}
      {restockProduct && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-800 rounded-2xl max-w-md w-full shadow-2xl border border-slate-700 overflow-hidden">
            <div className="bg-emerald-800 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold font-serif flex items-center space-x-2">
                <PlusCircle className="w-5 h-5 text-emerald-300" />
                <span>Restock Stok Masuk</span>
              </h3>
              <button onClick={() => setRestockProduct(null)} className="text-emerald-200 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="p-5 space-y-4 text-xs">
              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                <p className="font-bold text-slate-100 text-sm">{restockProduct.name}</p>
                <p className="text-slate-400">SKU: {restockProduct.sku} | Stok Saat Ini: {restockProduct.stock} pcs</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Jumlah Pasokan Baru (Pcs)</label>
                <input
                  type="number"
                  min="1"
                  value={restockQty}
                  onChange={(e) => setRestockQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-2.5 bg-slate-800 border border-slate-600 rounded-lg text-sm font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-400/200"
                />
              </div>

              <div className="flex items-center space-x-2 bg-emerald-400/20 p-3 rounded-xl border border-emerald-200">
                <input
                  type="checkbox"
                  id="recordExpense"
                  checked={recordExpenseOnRestock}
                  onChange={(e) => setRecordExpenseOnRestock(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-400/200 rounded"
                />
                <label htmlFor="recordExpense" className="text-slate-300 font-medium cursor-pointer">
                  Catat biaya pembelian ke Pengeluaran Usaha ({formatRupiah(restockQty * restockProduct.costPrice)})
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRestockProduct(null)}
                  className="px-4 py-2 rounded-lg font-semibold text-slate-400 bg-slate-900 hover:bg-stone-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow"
                >
                  + Tambahkan Ke Stok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Edit Product */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-800 rounded-2xl max-w-md w-full shadow-2xl border border-slate-700 overflow-hidden">
            <div className="bg-blue-700 text-yellow-300 p-4 flex items-center justify-between">
              <h3 className="font-bold font-serif flex items-center space-x-2">
                <Edit2 className="w-4 h-4 text-yellow-400" />
                <span>Edit Barang Sarung Batik</span>
              </h3>
              <button onClick={() => setEditingProduct(null)} className="text-amber-300 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Nama Motif Sarung</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full p-2 bg-slate-800 border border-slate-600 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Harga Modal (Rp)</label>
                  <input
                    type="number"
                    value={editingProduct.costPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, costPrice: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 bg-slate-800 border border-slate-600 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Harga Jual (Rp)</label>
                  <input
                    type="number"
                    value={editingProduct.sellingPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sellingPrice: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 bg-slate-800 border border-slate-600 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Stok (Pcs)</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 bg-slate-800 border border-slate-600 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Alert Stok Tipis</label>
                  <input
                    type="number"
                    value={editingProduct.minStockAlert}
                    onChange={(e) => setEditingProduct({ ...editingProduct, minStockAlert: parseInt(e.target.value) || 5 })}
                    className="w-full p-2 bg-slate-800 border border-slate-600 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-lg font-semibold text-slate-400 bg-slate-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg font-bold text-yellow-300 bg-blue-700 shadow"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
