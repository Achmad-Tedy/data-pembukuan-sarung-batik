import React, { useState } from 'react';
import { Transaction, PaymentMethod, ExpenseCategory } from '../types';
import { Save } from 'lucide-react';

interface EditTransactionModalProps {
  transaction: Transaction;
  onClose: () => void;
  onSave: (txId: string, updates: Partial<Transaction>) => void;
}

const PAYMENT_METHODS: PaymentMethod[] = ['Tunai', 'Transfer Bank', 'QRIS'];
const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Pembelian Stok', 'Operasional Toko', 'Kemasan & Packing', 'Gaji Karyawan', 'Transportasi & Kurir', 'Lain-lain'
];

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ transaction, onClose, onSave }) => {
  const isPemasukan = transaction.type === 'pemasukan';
  
  // States for Pemasukan
  const [buyerName, setBuyerName] = useState(transaction.buyerName || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(transaction.paymentMethod || 'Tunai');
  const [discount, setDiscount] = useState<number>(transaction.discount || 0);

  // States for Pengeluaran
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory | undefined>(transaction.expenseCategory);
  const [amount, setAmount] = useState<number>(transaction.amount || 0);
  const [description, setDescription] = useState(transaction.description || '');
  const [notes, setNotes] = useState(transaction.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPemasukan) {
      const totalSellingPrice = transaction.totalSellingPrice || 0;
      const netRevenue = Math.max(0, totalSellingPrice - discount);
      const grossProfit = netRevenue - (transaction.totalCostPrice || 0);
      
      onSave(transaction.id, {
        buyerName,
        paymentMethod,
        discount,
        netRevenue,
        grossProfit
      });
    } else {
      onSave(transaction.id, {
        expenseCategory,
        amount,
        description,
        notes
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-800 rounded-2xl max-w-md w-full shadow-2xl border border-slate-700 overflow-hidden">
        <div className="bg-blue-900 text-white p-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold font-serif">Koreksi Transaksi {isPemasukan ? 'Pemasukan' : 'Pengeluaran'}</h3>
            <p className="text-xs text-blue-200 font-mono">{transaction.invoiceNo}</p>
          </div>
          <button onClick={onClose} className="text-blue-200 hover:text-white cursor-pointer text-xl font-bold">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-xl mb-4">
            <p className="text-xs text-blue-300">
              <span className="font-bold">Info:</span> Anda hanya dapat mengedit rincian dasar. Untuk merubah item barang (pemasukan), silakan hapus transaksi dan buat ulang untuk menjaga akurasi stok.
            </p>
          </div>

          {isPemasukan ? (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">Nama Pembeli</label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-600 text-slate-100"
                  placeholder="Umum"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">Metode Pembayaran</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-600 text-slate-100"
                >
                  {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">Diskon (Rp)</label>
                <input
                  type="number"
                  min="0"
                  value={discount === 0 ? '' : discount}
                  onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-600 text-slate-100"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">Kategori Pengeluaran</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value as ExpenseCategory)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-600 text-slate-100"
                >
                  {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">Nominal (Rp)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={amount === 0 ? '' : amount}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-600 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">Keterangan / Tujuan</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-600 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">Catatan Tambahan (Opsional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-600 text-slate-100"
                />
              </div>
            </>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-700 mt-2 space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center space-x-2 font-bold shadow-lg shadow-blue-900/20"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
