import React, { useState } from 'react';
import { ProductItem, TransactionItemDetail, PaymentMethod } from '../types';
import { formatRupiah } from '../utils/formatters';
import { X, Plus, Trash2, ShoppingCart, CheckCircle, AlertCircle } from 'lucide-react';

interface NewSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  onSaveSale: (saleData: {
    buyerName: string;
    paymentMethod: PaymentMethod;
    discount: number;
    items: TransactionItemDetail[];
  }) => void;
}

export const NewSaleModal: React.FC<NewSaleModalProps> = ({
  isOpen,
  onClose,
  products,
  onSaveSale,
}) => {
  const [buyerName, setBuyerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Tunai');
  const [discount, setDiscount] = useState<number>(0);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedQty, setSelectedQty] = useState<number>(1);
  const [cartItems, setCartItems] = useState<TransactionItemDetail[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleAddItemToCart = () => {
    if (!selectedProductId) {
      setErrorMsg('Silakan pilih produk sarung batik terlebih dahulu.');
      return;
    }
    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    if (product.stock <= 0) {
      setErrorMsg(`Stok ${product.name} telah habis!`);
      return;
    }

    // Check if item already in cart
    const existingIndex = cartItems.findIndex((item) => item.productId === product.id);
    const existingQty = existingIndex >= 0 ? cartItems[existingIndex].quantity : 0;
    const totalNewQty = existingQty + selectedQty;

    if (totalNewQty > product.stock) {
      setErrorMsg(`Stok tidak mencukupi! Stok ${product.name} tersisa ${product.stock} pcs.`);
      return;
    }

    setErrorMsg('');

    if (existingIndex >= 0) {
      const updated = [...cartItems];
      updated[existingIndex].quantity = totalNewQty;
      updated[existingIndex].subtotalCost = totalNewQty * product.costPrice;
      updated[existingIndex].subtotalSelling = totalNewQty * product.sellingPrice;
      setCartItems(updated);
    } else {
      const newItem: TransactionItemDetail = {
        productId: product.id,
        sku: product.sku,
        productName: product.name,
        quantity: selectedQty,
        costPrice: product.costPrice,
        sellingPrice: product.sellingPrice,
        subtotalCost: selectedQty * product.costPrice,
        subtotalSelling: selectedQty * product.sellingPrice,
      };
      setCartItems([...cartItems, newItem]);
    }

    // reset picker
    setSelectedProductId('');
    setSelectedQty(1);
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const handleQtyChangeInCart = (index: number, newQty: number) => {
    const item = cartItems[index];
    const product = products.find((p) => p.id === item.productId);
    const maxStock = product ? product.stock : 999;

    if (newQty <= 0) {
      handleRemoveCartItem(index);
      return;
    }

    if (newQty > maxStock) {
      setErrorMsg(`Maksimal stok tersisa untuk ${item.productName} adalah ${maxStock} pcs.`);
      return;
    }

    setErrorMsg('');
    const updated = [...cartItems];
    updated[index].quantity = newQty;
    updated[index].subtotalCost = newQty * item.costPrice;
    updated[index].subtotalSelling = newQty * item.sellingPrice;
    setCartItems(updated);
  };

  const totalCost = cartItems.reduce((acc, item) => acc + item.subtotalCost, 0);
  const totalSelling = cartItems.reduce((acc, item) => acc + item.subtotalSelling, 0);
  const finalTotal = Math.max(0, totalSelling - (discount || 0));
  const estimatedProfit = finalTotal - totalCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setErrorMsg('Pilih minimal 1 item sarung batik untuk dicatat.');
      return;
    }

    onSaveSale({
      buyerName: buyerName.trim() || 'Pembeli Umum',
      paymentMethod,
      discount: discount || 0,
      items: cartItems,
    });

    // Reset and close
    setCartItems([]);
    setBuyerName('');
    setDiscount(0);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-700 overflow-hidden my-8">
        
        {/* Header Modal */}
        <div className="bg-emerald-800 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-700 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif">Input Penjualan (Pemasukan)</h2>
              <p className="text-xs text-emerald-200">Catat transaksi masuk &amp; potong stok otomatis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-400/20 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Product Selection Form */}
          <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700/80 space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
              Pilih Sarung Batik Dari Stok
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-7">
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full text-sm bg-slate-800 border border-slate-600 rounded-lg p-2 focus:ring-2 focus:ring-emerald-400/200 focus:outline-none"
                >
                  <option value="">-- Pilih Motif Sarung Batik --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                      {p.name} ({p.sku}) - Stok: {p.stock} pcs - {formatRupiah(p.sellingPrice)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3 flex items-center space-x-1">
                <span className="text-xs text-slate-400 font-medium">Qty:</span>
                <input
                  type="number"
                  min="1"
                  value={selectedQty}
                  onChange={(e) => setSelectedQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-sm bg-slate-800 border border-slate-600 rounded-lg p-2 text-center focus:ring-2 focus:ring-emerald-400/200"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={handleAddItemToCart}
                  className="w-full h-full min-h-[38px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Selected Items List */}
          <div>
            <span className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">
              Daftar Items Pembelian ({cartItems.length})
            </span>
            {cartItems.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-slate-700 rounded-xl text-slate-500 text-xs">
                Belum ada produk sarung batik yang dipilih.
              </div>
            ) : (
              <div className="border border-slate-700 rounded-xl overflow-hidden divide-y divide-slate-700/50 max-h-48 overflow-y-auto">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-800 flex items-center justify-between text-xs hover:bg-slate-800">
                    <div className="space-y-0.5 max-w-[55%]">
                      <p className="font-semibold text-slate-100 truncate">{item.productName}</p>
                      <p className="text-slate-400">
                        Harga: {formatRupiah(item.sellingPrice)} | Modal: {formatRupiah(item.costPrice)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 bg-slate-900 border border-slate-700 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => handleQtyChangeInCart(idx, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center bg-slate-800 rounded text-slate-300 hover:bg-stone-200 font-bold"
                        >
                          -
                        </button>
                        <span className="w-7 text-center font-semibold text-slate-100">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleQtyChangeInCart(idx, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center bg-slate-800 rounded text-slate-300 hover:bg-stone-200 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right w-24">
                        <p className="font-bold text-emerald-700">{formatRupiah(item.subtotalSelling)}</p>
                        <p className="text-[10px] text-slate-500">Modal: {formatRupiah(item.subtotalCost)}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveCartItem(idx)}
                        className="text-slate-500 hover:text-rose-500 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Buyer & Payment Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nama Pembeli (Optional)</label>
              <input
                type="text"
                placeholder="misal: Gus Ahmad / Umum"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full text-xs bg-slate-800 border border-slate-600 rounded-lg p-2 focus:ring-2 focus:ring-emerald-400/200"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Metode Pembayaran</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full text-xs bg-slate-800 border border-slate-600 rounded-lg p-2 focus:ring-2 focus:ring-emerald-400/200"
              >
                <option value="Tunai">Tunai (Cash)</option>
                <option value="Transfer Bank">Transfer Bank</option>
                <option value="QRIS">QRIS / E-Wallet</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Potongan Diskon (Rp)</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={discount || ''}
                onChange={(e) => setDiscount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full text-xs bg-slate-800 border border-slate-600 rounded-lg p-2 focus:ring-2 focus:ring-emerald-400/200"
              />
            </div>
          </div>

          {/* Section 4: Transaction Summary Box */}
          <div className="bg-emerald-400/20/70 p-4 rounded-xl border border-emerald-200/80 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal Penjualan:</span>
              <span className="font-semibold">{formatRupiah(totalSelling)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-rose-500">
                <span>Diskon:</span>
                <span>- {formatRupiah(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>Total Modal HPP (Barang Terjual):</span>
              <span className="font-semibold text-slate-300">{formatRupiah(totalCost)}</span>
            </div>
            <div className="border-t border-emerald-200/80 pt-2 flex justify-between items-center text-sm font-bold text-emerald-950">
              <span>Total Pemasukan (Omzet Akhir):</span>
              <span className="text-emerald-700 text-base">{formatRupiah(finalTotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-emerald-800 font-medium bg-emerald-100/80 p-2 rounded-lg mt-1">
              <span>Estimasi Laba Kotor Transaksi Ini:</span>
              <span className="font-bold">{formatRupiah(estimatedProfit)}</span>
            </div>
          </div>

          {/* Submit buttons */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 bg-slate-900 hover:bg-stone-200 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={cartItems.length === 0}
              className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Simpan Penjualan Real-time</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
