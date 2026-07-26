import React from 'react';
import { SummaryMetrics } from '../types';
import { formatRupiah } from '../utils/formatters';
import { TrendingUp, TrendingDown, DollarSign, Package, AlertTriangle, PieChart, Coins } from 'lucide-react';

interface StatCardsProps {
  metrics: SummaryMetrics;
  selectedPeriod: string;
  setSelectedPeriod: (p: string) => void;
}

export const StatCards: React.FC<StatCardsProps> = ({
  metrics,
  selectedPeriod,
  setSelectedPeriod,
}) => {
  const marginPercentage = metrics.totalRevenue > 0
    ? ((metrics.netProfit / metrics.totalRevenue) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-4">
      {/* Period Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-blue-900/30/80 p-3.5 rounded-xl border border-blue-300/80 gap-3">
        <div className="flex items-center space-x-2">
          <Coins className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-semibold text-amber-950">
            Filter Periode Pembukuan:
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 text-xs font-medium">
          {[
            { id: 'today', label: 'Hari Ini' },
            { id: '7days', label: '7 Hari Terakhir' },
            { id: 'month', label: 'Bulan Ini' },
            { id: 'all', label: 'Semua Waktu' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedPeriod(item.id)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedPeriod === item.id
                  ? 'bg-blue-700 text-yellow-300 font-semibold shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-blue-800/50 border border-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Penghasilan / Omzet */}
        <div className="bg-slate-800 rounded-2xl p-4 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-400/20 rounded-bl-full -z-0 opacity-60" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Total Penghasilan (Omzet)
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-100 font-sans tracking-tight">
              {formatRupiah(metrics.totalRevenue)}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Nilai kotor hasil penjualan sarung batik
            </p>
          </div>
        </div>

        {/* Card 2: Pengeluaran & Beban */}
        <div className="bg-slate-800 rounded-2xl p-4 border border-rose-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-rose-400/20 rounded-bl-full -z-0 opacity-60" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">
                Pengeluaran Operasional
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-100 font-sans tracking-tight">
              {formatRupiah(metrics.totalExpenses)}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Sewa, plastik/dus, gaji, &amp; beban usaha
            </p>
          </div>
        </div>

        {/* Card 3: Laba Bersih Usaha */}
        <div className="bg-gradient-to-br from-blue-700 to-amber-950 text-blue-900/30 rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden border border-blue-600">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-yellow-500/10 rounded-full blur-xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-yellow-400">
                Laba Bersih (Net Profit)
              </span>
              <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-300">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-yellow-300 font-sans tracking-tight">
              {formatRupiah(metrics.netProfit)}
            </p>
            <div className="flex items-center justify-between mt-1 text-xs text-blue-300/90">
              <span>Margin Keuntungan:</span>
              <span className="font-semibold bg-yellow-400/20 px-2 py-0.5 rounded text-yellow-300">
                {marginPercentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Total Stok & Alert */}
        <div className="bg-slate-800 rounded-2xl p-4 border border-blue-800/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Total Stok Tersedia
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-800/50 flex items-center justify-center text-blue-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-100 font-sans tracking-tight">
            {metrics.totalStockUnits} <span className="text-sm font-normal text-slate-400">Pcs</span>
          </p>
          {metrics.lowStockCount > 0 ? (
            <div className="mt-2 flex items-center space-x-1.5 text-xs text-blue-400 bg-blue-900/30 px-2.5 py-1 rounded-md border border-blue-300">
              <AlertTriangle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
              <span>{metrics.lowStockCount} motif stok tipis!</span>
            </div>
          ) : (
            <p className="text-xs text-emerald-600 mt-2">
              Stok semua motif dalam jumlah aman
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
