
import React from 'react';
import { Transaction } from '../types';
import { formatRupiah } from '../utils/formatters';
import { Printer, X, Store } from 'lucide-react';

interface ReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  appName: string;
  logoUrl: string;
  cashierName: string;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  onClose,
  appName,
  logoUrl,
  cashierName
}) => {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const isSales = transaction.type === 'pemasukan';
  
  const totalSelling = transaction.type === 'pemasukan' 
    ? (transaction.netRevenue ?? (transaction.totalSellingPrice ?? 0))
    : (transaction.amount ?? 0);
  
  const txDate = new Date(transaction.date);
  const formattedDate = txDate.toLocaleDateString('id-ID');
  const formattedTime = txDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute:'2-digit', second:'2-digit' });
  const totalQty = transaction.type === 'pemasukan' 
    ? (transaction.items?.reduce((acc, item) => acc + item.quantity, 0) || 0)
    : 1;


  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-2xl max-w-sm w-full shadow-2xl border border-slate-700 overflow-hidden my-8">
        
        {/* Modal Controls */}
        <div className="bg-stone-900 text-stone-200 p-3.5 flex items-center justify-between no-print">
          <span className="text-xs font-semibold">Nota Transaksi Digital</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-lg flex items-center space-x-1 cursor-pointer"
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
        <div className="p-4 bg-white text-black font-mono text-xs shadow-inner flex justify-center" id="printable-receipt">
          <div className="w-[280px] space-y-3 pb-4">
            {/* Store Header */}
            <div className="text-center space-y-1">
              <div className="flex justify-center mb-2">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain grayscale mix-blend-multiply" />
                ) : (
                  <Store className="w-10 h-10 text-black" />
                )}
              </div>
              <h2 className="font-bold text-sm text-black">
                {appName}
              </h2>
              <p className="text-[10px] text-black leading-tight font-sans whitespace-pre-wrap">Pasuruan\n(085707437883 - 082336651163)</p>
            </div>

            <div className="border-t border-dashed border-gray-400"></div>

            {/* Invoice Info */}
            <div className="flex justify-between text-[11px]">
              <div className="flex flex-col">
                <span>{formattedDate}</span>
                <span>{formattedTime}</span>
                <span>No.{transaction.invoiceNo}</span>
              </div>
              <div className="flex items-start">
                 <span className="border border-black px-1 py-0.5 font-bold uppercase tracking-wide">{cashierName}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-400"></div>

            
            {/* Items List */}
            {isSales && transaction.items ? (
              <div className="space-y-2">
                {transaction.items.map((item, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <p className="text-black">{idx + 1}. {item.productName}</p>
                    <div className="flex justify-between text-black pl-3">
                      <span>{item.quantity} x {formatRupiah(item.sellingPrice).replace('Rp', '')}</span>
                      <span>{formatRupiah(item.subtotalSelling).replace('Rp', '')}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="space-y-0.5">
                  <p className="text-black">1. {transaction.expenseCategory || 'Pengeluaran'}</p>
                  <p className="text-black pl-3 text-[10px]">{transaction.description}</p>
                  <div className="flex justify-between text-black pl-3">
                    <span>1 x {formatRupiah(transaction.amount || 0).replace('Rp', '')}</span>
                    <span>{formatRupiah(transaction.amount || 0).replace('Rp', '')}</span>
                  </div>
                </div>
              </div>
            )}


            <div className="border-t border-dashed border-gray-400"></div>

            {/* Price Calculation */}
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Total QTY : {totalQty}</span>
                <span></span>
              </div>
              
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatRupiah(transaction.type === 'pemasukan' ? (transaction.totalSellingPrice || 0) : (transaction.amount || 0)).replace('Rp', '')}</span>
              </div>

              {transaction.discount ? (
                <div className="flex justify-between">
                  <span>Pajak: Diskon</span>
                  <span>-{formatRupiah(transaction.discount).replace('Rp', '')}</span>
                </div>
              ) : null}
              
              <div className="flex justify-between font-bold pt-2 mt-1">
                <span>Total</span>
                <span>{formatRupiah(totalSelling).replace('Rp', '')}</span>
              </div>
              <div className="flex justify-between">
                <span>Bayar</span>
                <span>{formatRupiah(totalSelling).replace('Rp', '')}</span>
              </div>
              <div className="flex justify-between">
                <span>Kembali</span>
                <span>0</span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-400"></div>

            
            {/* Footer message */}
            <div className="text-center pt-2 text-[10px] space-y-1">
              <p>Terimakasih telah berbelanja di<br/>Toko Kami</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

