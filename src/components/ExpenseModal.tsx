import React, { useState } from 'react';
import { ExpenseCategory } from '../types';
import { X, MinusCircle, CheckCircle } from 'lucide-react';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExpense: (expenseData: {
    category: ExpenseCategory;
    amount: number;
    description: string;
    notes?: string;
  }) => void;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSaveExpense,
}) => {
  const [category, setCategory] = useState<ExpenseCategory>('Operasional Toko');
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      setErrorMsg('Jumlah pengeluaran harus lebih besar dari 0.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Harap isi keterangan pengeluaran.');
      return;
    }

    onSaveExpense({
      category,
      amount,
      description: description.trim(),
      notes: notes.trim() || undefined,
    });

    // reset and close
    setAmount(0);
    setDescription('');
    setNotes('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-700 overflow-hidden my-8">
        
        {/* Header Modal */}
        <div className="bg-rose-800 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-rose-700 rounded-lg">
              <MinusCircle className="w-5 h-5 text-rose-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif">Input Pengeluaran Usaha</h2>
              <p className="text-xs text-rose-200">Catat biaya operasional &amp; pembelian bahan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-rose-200 hover:text-white hover:bg-rose-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-400/20 border border-rose-200 rounded-xl text-rose-700 text-xs">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Kategori Pengeluaran
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full text-xs bg-slate-800 border border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-400/200"
            >
              <option value="Operasional Toko">Operasional Toko (Listrik, Sewa, Kebersihan)</option>
              <option value="Kemasan & Packing">Kemasan &amp; Packing (Plastik, Dus, Pita Logo)</option>
              <option value="Pembelian Stok">Pembelian Pasokan Stok / Kain Batik</option>
              <option value="Gaji Karyawan">Gaji Karyawan &amp; Bonus</option>
              <option value="Transportasi & Kurir">Transportasi, Kurir &amp; Biaya Kirim</option>
              <option value="Lain-lain">Lain-lain</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Jumlah Pengeluaran (Rp)
            </label>
            <input
              type="number"
              min="1"
              placeholder="misal: 150000"
              value={amount || ''}
              onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full text-sm bg-slate-800 border border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-400/200 font-semibold text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Keterangan Pengeluaran
            </label>
            <input
              type="text"
              placeholder="misal: Beli 100 pcs plastik mika sablon sarung batik"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs bg-slate-800 border border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-400/200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Catatan Tambahan (Optional / Nomor Nota)
            </label>
            <textarea
              rows={2}
              placeholder="misal: Kwitansi toko plastik No. 882"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs bg-slate-800 border border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-400/200"
            />
          </div>

          {/* Submit buttons */}
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 bg-slate-900 hover:bg-stone-200 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Simpan Pengeluaran</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
