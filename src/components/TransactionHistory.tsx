import React, { useState } from 'react';
import { Transaction } from '../types';
import { formatRupiah, formatDateTimeIndo } from '../utils/formatters';
import { History, Search, Calendar, Filter, ArrowUpRight, ArrowDownRight, Printer, Trash2, FileSpreadsheet, Eye, Edit } from 'lucide-react';
import { EditTransactionModal } from './EditTransactionModal';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onDeleteTransaction: (txId: string) => void;
  onEditTransaction: (txId: string, updates: Partial<Transaction>) => void;
  onSelectReceipt: (tx: Transaction) => void;
  onExportCSV: () => void;
  selectedPeriod: string;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  onDeleteTransaction,
  onEditTransaction,
  onSelectReceipt,
  onExportCSV,
  selectedPeriod,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'pemasukan' | 'pengeluaran'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailModalTx, setDetailModalTx] = useState<Transaction | null>(null);
  const [editModalTx, setEditModalTx] = useState<Transaction | null>(null);

  // Filter transactions
  const filtered = transactions.filter((tx) => {
    const matchesType = filterType === 'all' || tx.type === filterType;
    const q = searchQuery.toLowerCase();
    
    let matchesSearch =
      tx.invoiceNo.toLowerCase().includes(q) ||
      (tx.buyerName && tx.buyerName.toLowerCase().includes(q)) ||
      (tx.description && tx.description.toLowerCase().includes(q)) ||
      (tx.expenseCategory && tx.expenseCategory.toLowerCase().includes(q));

    if (!matchesSearch && tx.items) {
      matchesSearch = tx.items.some((item) => item.productName.toLowerCase().includes(q));
    }

    return matchesType && matchesSearch;
  });

  // Calculate quick summary for filtered records
  let subtotalRevenue = 0;
  let subtotalCost = 0;
  let subtotalExpense = 0;

  filtered.forEach((tx) => {
    if (tx.type === 'pemasukan') {
      subtotalRevenue += tx.netRevenue ?? (tx.totalSellingPrice ?? 0);
      subtotalCost += tx.totalCostPrice ?? 0;
    } else {
      subtotalExpense += tx.amount ?? 0;
    }
  });

  const subtotalProfit = (subtotalRevenue - subtotalCost) - subtotalExpense;

  return (
    <div className="space-y-5">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-yellow-100 rounded-xl text-blue-700">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 font-serif">Riwayat Transaksi Harian Real-Time</h2>
            <p className="text-xs text-slate-400">
              Catatan masuk keluar kas &amp; keuntungan rincian setiap penjualan
            </p>
          </div>
        </div>

        <button
          onClick={onExportCSV}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold shadow transition-all cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Ekspor Laporan (CSV)</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search */}
        <div className="sm:col-span-7 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Cari nomor nota, pembeli, nama motif batik, atau keterangan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-600 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        {/* Type Filter */}
        <div className="sm:col-span-5 flex items-center bg-slate-800 border border-slate-600 rounded-xl p-1 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-blue-700 text-yellow-300 font-bold shadow-sm'
                : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            Semua ({transactions.length})
          </button>
          <button
            onClick={() => setFilterType('pemasukan')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              filterType === 'pemasukan'
                ? 'bg-emerald-700 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            Pemasukan
          </button>
          <button
            onClick={() => setFilterType('pengeluaran')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              filterType === 'pengeluaran'
                ? 'bg-rose-700 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            Pengeluaran
          </button>
        </div>
      </div>

      {/* Quick Filter Summary Pill */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-emerald-400/20/80 p-3 rounded-xl border border-emerald-200">
          <span className="text-slate-400 font-medium block">Total Pemasukan:</span>
          <span className="text-emerald-700 font-bold text-sm">{formatRupiah(subtotalRevenue)}</span>
        </div>
        <div className="bg-rose-400/20/80 p-3 rounded-xl border border-rose-200">
          <span className="text-slate-400 font-medium block">Total Pengeluaran:</span>
          <span className="text-rose-700 font-bold text-sm">{formatRupiah(subtotalExpense)}</span>
        </div>
        <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
          <span className="text-slate-400 font-medium block">HPP Modal Terjual:</span>
          <span className="text-slate-200 font-bold text-sm">{formatRupiah(subtotalCost)}</span>
        </div>
        <div className="bg-blue-800/50/70 p-3 rounded-xl border border-amber-300">
          <span className="text-blue-700 font-medium block">Total Laba Bersih:</span>
          <span className="text-amber-950 font-extrabold text-sm">{formatRupiah(subtotalProfit)}</span>
        </div>
      </div>

      {/* Real-time Transactions Table */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-300 font-bold uppercase tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3.5 px-4">Nota &amp; Waktu</th>
                <th className="py-3.5 px-4">Jenis &amp; Metode</th>
                <th className="py-3.5 px-4">Detail Items / Keterangan</th>
                <th className="py-3.5 px-4 text-right">Modal (HPP)</th>
                <th className="py-3.5 px-4 text-right">Nominal (Rp)</th>
                <th className="py-3.5 px-4 text-right">Laba Transaksi</th>
                <th className="py-3.5 px-4 text-center">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Belum ada riwayat transaksi yang tercatat untuk filter ini.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => {
                  const isPemasukan = tx.type === 'pemasukan';
                  const amount = isPemasukan
                    ? (tx.netRevenue ?? tx.totalSellingPrice ?? 0)
                    : (tx.amount ?? 0);
                  const cost = isPemasukan ? (tx.totalCostPrice ?? 0) : 0;
                  const profit = isPemasukan ? amount - cost : -amount;

                  return (
                    <tr key={tx.id} className="hover:bg-blue-900/30/40 transition-colors">
                      
                      {/* Invoice & Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-mono font-bold text-blue-700">{tx.invoiceNo}</p>
                        <p className="text-[11px] text-slate-500">{formatDateTimeIndo(tx.date)}</p>
                      </td>

                      {/* Type Badge & Payment Method */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {isPemasukan ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                              <ArrowUpRight className="w-3 h-3" />
                              <span>Pemasukan</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold">
                              <ArrowDownRight className="w-3 h-3" />
                              <span>Pengeluaran</span>
                            </span>
                          )}
                          <p className="text-[10px] text-slate-400 font-medium">
                            {isPemasukan ? tx.paymentMethod || 'Tunai' : tx.expenseCategory || 'Operasional'}
                          </p>
                        </div>
                      </td>

                      {/* Detail Items / Description */}
                      <td className="py-3.5 px-4 max-w-xs">
                        {isPemasukan ? (
                          <div>
                            {tx.buyerName && (
                              <p className="font-semibold text-slate-100">
                                Pembeli: <span className="text-blue-700">{tx.buyerName}</span>
                              </p>
                            )}
                            <p className="text-slate-400 line-clamp-2 mt-0.5">
                              {tx.items?.map((i) => `${i.productName} (${i.quantity}x)`).join(', ')}
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="font-semibold text-slate-100">{tx.description}</p>
                            {tx.notes && <p className="text-[10px] text-slate-500">{tx.notes}</p>}
                          </div>
                        )}
                      </td>

                      {/* Modal Cost */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap text-slate-400">
                        {isPemasukan ? formatRupiah(cost) : '-'}
                      </td>

                      {/* Nominal */}
                      <td className={`py-3.5 px-4 text-right whitespace-nowrap font-bold ${
                        isPemasukan ? 'text-emerald-700' : 'text-rose-700'
                      }`}>
                        {isPemasukan ? `+${formatRupiah(amount)}` : `-${formatRupiah(amount)}`}
                      </td>

                      {/* Laba Transaksi */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {isPemasukan ? (
                          <span className="font-bold text-blue-700 bg-yellow-100/80 px-2 py-0.5 rounded">
                            +{formatRupiah(profit)}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">-</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-1">
                          
                          {/* View Detail Modal */}
                          <button
                            onClick={() => setDetailModalTx(tx)}
                            title="Lihat Detail Rincian"
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-800/50 rounded-lg cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Print Receipt (for sales) */}
                          
                          <button
                            onClick={() => setEditModalTx(tx)}
                            title="Koreksi Transaksi"
                            className="p-1.5 text-blue-500 hover:text-blue-400 hover:bg-blue-900/30 rounded-lg cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {isPemasukan && (
                            <button
                              onClick={() => onSelectReceipt(tx)}
                              title="Cetak Nota / Struk"
                              className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-400/20 rounded-lg cursor-pointer"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete Transaction */}
                          <button
                            onClick={() => {
                              const promptMsg = isPemasukan
                                ? `Batalkan/Hapus penjualan ${tx.invoiceNo}? Stok barang akan dikembalikan otomatis.`
                                : `Hapus catatan pengeluaran ${tx.invoiceNo}?`;
                              if (confirm(promptMsg)) {
                                onDeleteTransaction(tx.id);
                              }
                            }}
                            title="Hapus / Batalkan Transaksi"
                            className="p-1.5 text-slate-500 hover:text-rose-500 hover:bg-rose-400/20 rounded-lg cursor-pointer"
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

      {/* Modal Detail Rincian Transaksi */}
      
      {editModalTx && (
        <EditTransactionModal
          transaction={editModalTx}
          onClose={() => setEditModalTx(null)}
          onSave={(txId, updates) => {
            onEditTransaction(txId, updates);
            setEditModalTx(null);
          }}
        />
      )}
      {detailModalTx && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-800 rounded-2xl max-w-md w-full shadow-2xl border border-slate-700 overflow-hidden text-xs">
            <div className="bg-amber-950 text-blue-900/30 p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm font-serif">Detail Rincian Transaksi</h3>
                <p className="text-[11px] text-amber-300 font-mono">{detailModalTx.invoiceNo}</p>
              </div>
              <button onClick={() => setDetailModalTx(null)} className="text-amber-300 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3.5">
              <div className="flex justify-between border-b border-slate-700/50 pb-2">
                <span className="text-slate-400">Waktu Transaksi:</span>
                <span className="font-medium text-slate-100">{formatDateTimeIndo(detailModalTx.date)}</span>
              </div>

              <div className="flex justify-between border-b border-slate-700/50 pb-2">
                <span className="text-slate-400">Jenis Transaksi:</span>
                <span className="font-bold uppercase text-blue-700">{detailModalTx.type}</span>
              </div>

              {detailModalTx.type === 'pemasukan' ? (
                <>
                  <div className="flex justify-between border-b border-slate-700/50 pb-2">
                    <span className="text-slate-400">Pembeli / Pelanggan:</span>
                    <span className="font-semibold text-slate-200">{detailModalTx.buyerName || 'Umum'}</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-700/50 pb-2">
                    <span className="text-slate-400">Metode Pembayaran:</span>
                    <span className="font-semibold text-emerald-700">{detailModalTx.paymentMethod}</span>
                  </div>

                  <div className="space-y-1 bg-slate-800 p-3 rounded-xl border border-slate-700">
                    <p className="font-bold text-slate-300 mb-1">Rincian Item Sarung Batik:</p>
                    {detailModalTx.items?.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] py-1 border-b border-slate-700/60 last:border-0">
                        <div>
                          <p className="font-semibold text-slate-100">{it.productName}</p>
                          <p className="text-slate-400">{it.quantity} Pcs × {formatRupiah(it.sellingPrice)} (Modal: {formatRupiah(it.costPrice)})</p>
                        </div>
                        <span className="font-bold text-slate-100">{formatRupiah(it.subtotalSelling)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-emerald-400/20 p-3 rounded-xl border border-emerald-200 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Omzet:</span>
                      <span className="font-bold text-emerald-800">{formatRupiah(detailModalTx.netRevenue || detailModalTx.totalSellingPrice || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Modal HPP:</span>
                      <span className="font-medium text-slate-300">{formatRupiah(detailModalTx.totalCostPrice || 0)}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-emerald-200 font-bold text-amber-950">
                      <span>Laba Kotor Transaksi:</span>
                      <span>{formatRupiah((detailModalTx.netRevenue || detailModalTx.totalSellingPrice || 0) - (detailModalTx.totalCostPrice || 0))}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between border-b border-slate-700/50 pb-2">
                    <span className="text-slate-400">Kategori Pengeluaran:</span>
                    <span className="font-semibold text-rose-700">{detailModalTx.expenseCategory}</span>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-1">
                    <p className="text-slate-400">Keterangan / Tujuan:</p>
                    <p className="font-semibold text-slate-100 text-sm">{detailModalTx.description}</p>
                    {detailModalTx.notes && <p className="text-slate-400 text-[11px] italic mt-1">Catatan: {detailModalTx.notes}</p>}
                  </div>
                  <div className="flex justify-between bg-rose-400/20 p-3 rounded-xl border border-rose-200 text-sm font-bold text-rose-800">
                    <span>Total Nominal Pengeluaran:</span>
                    <span>{formatRupiah(detailModalTx.amount || 0)}</span>
                  </div>
                </>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setDetailModalTx(null)}
                  className="px-4 py-2 bg-amber-950 text-blue-800/50 font-bold rounded-lg"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
