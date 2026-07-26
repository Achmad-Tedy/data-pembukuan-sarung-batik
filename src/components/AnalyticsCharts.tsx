import React from 'react';
import { Transaction, ProductItem } from '../types';
import { formatRupiah, formatDateIndo } from '../utils/formatters';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon, Award } from 'lucide-react';

interface AnalyticsChartsProps {
  transactions: Transaction[];
  products: ProductItem[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  transactions,
  products,
}) => {
  // 1. Group daily financial data for chart
  const dailyMap: Record<string, { dateLabel: string; omzet: number; modal: number; pengeluaran: number; laba: number }> = {};

  // Sort transactions chronologically
  const sortedTx = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  sortedTx.forEach((tx) => {
    const d = new Date(tx.date);
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dateLabel = `${d.getDate()} ${d.toLocaleString('id-ID', { month: 'short' })}`;

    if (!dailyMap[dateKey]) {
      dailyMap[dateKey] = { dateLabel, omzet: 0, modal: 0, pengeluaran: 0, laba: 0 };
    }

    if (tx.type === 'pemasukan') {
      const rev = tx.netRevenue ?? (tx.totalSellingPrice ?? 0);
      const cogs = tx.totalCostPrice ?? 0;
      dailyMap[dateKey].omzet += rev;
      dailyMap[dateKey].modal += cogs;
      dailyMap[dateKey].laba += (rev - cogs);
    } else {
      const exp = tx.amount ?? 0;
      dailyMap[dateKey].pengeluaran += exp;
      dailyMap[dateKey].laba -= exp;
    }
  });

  const chartData = Object.values(dailyMap);

  // 2. Category Sales Breakdown
  const categoryMap: Record<string, number> = {};
  transactions.forEach((tx) => {
    if (tx.type === 'pemasukan' && tx.items) {
      tx.items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        const catName = product ? product.category : 'Lainnya';
        categoryMap[catName] = (categoryMap[catName] || 0) + item.subtotalSelling;
      });
    }
  });

  const categoryPieData = Object.keys(categoryMap).map((cat) => ({
    name: cat,
    value: categoryMap[cat],
  }));

  const COLORS = ['#059669', '#d97706', '#dc2626', '#2563eb', '#7c3aed', '#db2777'];

  // 3. Top Selling Products
  const productSalesMap: Record<string, { name: string; qty: number; totalRevenue: number }> = {};
  transactions.forEach((tx) => {
    if (tx.type === 'pemasukan' && tx.items) {
      tx.items.forEach((item) => {
        if (!productSalesMap[item.productName]) {
          productSalesMap[item.productName] = { name: item.productName, qty: 0, totalRevenue: 0 };
        }
        productSalesMap[item.productName].qty += item.quantity;
        productSalesMap[item.productName].totalRevenue += item.subtotalSelling;
      });
    }
  });

  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* Chart 1: Daily Revenue & Profit Trend */}
      <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center space-x-2.5 border-b border-slate-700/50 pb-3">
          <div className="p-2 bg-blue-800/50 rounded-lg text-blue-700">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-serif text-slate-100">Grafik Omzet &amp; Laba Bersih Usaha</h3>
            <p className="text-xs text-slate-400">Perbandingan pemasukan harian, pengeluaran, dan laba bersih</p>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              Belum ada data transaksi untuk ditampilkan pada grafik.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="dateLabel" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  tickFormatter={(v) => `Rp${v / 1000}k`}
                />
                <Tooltip
                  formatter={(value: any) => [formatRupiah(Number(value) || 0)]}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="omzet" name="Omzet Penjualan" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pengeluaran" name="Pengeluaran Usaha" fill="#dc2626" radius={[4, 4, 0, 0]} />
                <Bar dataKey="laba" name="Laba Bersih" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Grid: Pie Chart + Top Selling Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Pie Chart: Category Distribution */}
        <div className="lg:col-span-5 bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-700/50 pb-3">
            <PieChartIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold font-serif text-slate-100">Distribusi Penjualan per Jenis Batik</h3>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            {categoryPieData.length === 0 ? (
              <span className="text-xs text-slate-500">Belum ada penjualan per kategori</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    innerRadius={35}
                    paddingAngle={4}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {categoryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [formatRupiah(Number(value) || 0), 'Total Penjualan']} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top Selling Products List */}
        <div className="lg:col-span-7 bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-700/50 pb-3">
            <Award className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold font-serif text-slate-100">Motif Sarung Batik Terlaris</h3>
          </div>

          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">Belum ada data penjualan sarung batik.</p>
            ) : (
              topProducts.map((p, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-800 rounded-xl border border-slate-700 text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-blue-700 text-yellow-300 font-bold flex items-center justify-center text-[11px]">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-slate-100">{p.name}</p>
                      <p className="text-slate-400">Total Terjual: <span className="font-semibold text-emerald-800">{p.qty} Pcs</span></p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-700 text-sm">{formatRupiah(p.totalRevenue)}</p>
                    <p className="text-[10px] text-slate-500">Total Omzet</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
