import React from 'react';
import { Transaction } from '../types';
import { formatRupiah, formatDateTimeIndo } from '../utils/formatters';
import { Printer, X, Sparkles } from 'lucide-react';

interface ReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  onClose,
}) => {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const isSales = transaction.type === 'pemasukan';
  const totalSelling = transaction.netRevenue ?? (transaction.totalSellingPrice ?? 0);

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-2xl max-w-sm w-full shadow-2xl border border-slate-700 overflow-hidden my-8">
        
        {/* Modal Controls */}
        <div className="bg-stone-900 text-stone-200 p-3.5 flex items-center justify-between no-print">
          <span className="text-xs font-semibold">Nota Transaksi Digital</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-900/300 text-amber-950 font-bold text-xs rounded-lg flex items-center space-x-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Print</span>
            </button>
            <button onClick={onClose} className="p-1 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Canvas */}
        <div className="p-6 bg-blue-900/30/30 text-slate-100 space-y-4 font-mono text-xs border-b border-slate-700">
          
          {/* Store Header */}
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-600">
            <div className="flex justify-center mb-1">
              <div className="w-8 h-8 rounded-full bg-blue-700 text-yellow-300 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <h2 className="font-bold font-serif text-sm text-amber-950 tracking-wider uppercase">
              USAHA SARUNG BATIK
            </h2>
            <p className="text-[10px] text-slate-400 font-sans">
              Jl. Malioboro No. 45 - Pekalongan &amp; Solo
            </p>
            <p className="text-[10px] text-slate-400 font-sans">WA: 0812-3456-7890</p>
          </div>

          {/* Invoice Info */}
          <div className="space-y-1 text-[11px] border-b border-dashed border-slate-600 pb-2">
            <div className="flex justify-between">
              <span className="text-slate-400">No Nota:</span>
              <span className="font-bold">{transaction.invoiceNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tanggal:</span>
              <span>{formatDateTimeIndo(transaction.date)}</span>
            </div>
            {transaction.buyerName && (
              <div className="flex justify-between">
                <span className="text-slate-400">Pembeli:</span>
                <span className="font-semibold">{transaction.buyerName}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">Metode:</span>
              <span>{transaction.paymentMethod || 'Tunai'}</span>
            </div>
          </div>

          {/* Items List */}
          {isSales && transaction.items && (
            <div className="space-y-2 border-b border-dashed border-slate-600 pb-3">
              {transaction.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <p className="font-bold text-slate-100">{item.productName}</p>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{item.quantity} x {formatRupiah(item.sellingPrice)}</span>
                    <span className="font-bold text-slate-100">{formatRupiah(item.subtotalSelling)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Price Calculation */}
          <div className="space-y-1 text-[11px] pt-1">
            {transaction.discount ? (
              <div className="flex justify-between text-slate-400">
                <span>Diskon Transaksi:</span>
                <span>- {formatRupiah(transaction.discount)}</span>
              </div>
            ) : null}

            <div className="flex justify-between text-sm font-bold pt-1 border-t border-slate-600 text-amber-950">
              <span>TOTAL PEMBAYARAN:</span>
              <span>{formatRupiah(totalSelling)}</span>
            </div>
          </div>

          {/* Footer message */}
          <div className="text-center pt-3 border-t border-dashed border-slate-600 text-[10px] text-slate-400 space-y-0.5">
            <p className="font-bold text-slate-300">Terima Kasih Telah Berbelanja!</p>
            <p>Sarung Batik Asli Berkualitas &amp; Halus</p>
          </div>

        </div>
      </div>
    </div>
  );
};
