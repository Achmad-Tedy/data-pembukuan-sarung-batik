import { Transaction, ProductItem, SummaryMetrics } from '../types';

// Format angka ke mata uang Rupiah
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

// Format tanggal Bahasa Indonesia
export function formatDateIndo(dateStr: string | Date): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

// Format waktu HH:mm
export function formatTimeIndo(dateStr: string | Date): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d);
}

// Format lengkap tanggal & jam
export function formatDateTimeIndo(dateStr: string | Date): string {
  return `${formatDateIndo(dateStr)}, ${formatTimeIndo(dateStr)} WIB`;
}

// Dapatkan string YYYY-MM-DD
export function toDateInputValue(dateStr: string | Date = new Date()): string {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Perhitungan Ringkasan Keuangan
export function calculateMetrics(transactions: Transaction[], products: ProductItem[]): SummaryMetrics {
  let totalRevenue = 0; // Omzet Penjualan
  let totalCostOfGoods = 0; // HPP Penjualan
  let totalOtherExpenses = 0; // Pengeluaran Operasional / Non-HPP

  transactions.forEach((tx) => {
    if (tx.type === 'pemasukan') {
      const rev = tx.netRevenue ?? (tx.totalSellingPrice ?? 0);
      const cogs = tx.totalCostPrice ?? 0;
      totalRevenue += rev;
      totalCostOfGoods += cogs;
    } else if (tx.type === 'pengeluaran') {
      // Pembelian stok dihitung sebagai pengeluaran terpisah jika dicatat demikian
      totalOtherExpenses += tx.amount ?? 0;
    }
  });

  const totalExpenses = totalOtherExpenses;
  const netProfit = (totalRevenue - totalCostOfGoods) - totalOtherExpenses;

  const totalStockUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock <= p.minStockAlert).length;

  return {
    totalRevenue,
    totalExpenses,
    totalCostOfGoods,
    netProfit,
    totalStockUnits,
    lowStockCount,
    totalTransactionsCount: transactions.length,
  };
}

// Export transaksi ke CSV
export function exportTransactionsToCSV(transactions: Transaction[], filename: string = 'riwayat_transaksi_sarung_batik.csv') {
  const headers = [
    'No Nota/Invoice',
    'Tanggal & Waktu',
    'Jenis Transaksi',
    'Detail / Keterangan',
    'Metode Pembayaran / Kategori',
    'Total Modal (Rp)',
    'Total Penjualan/Omzet (Rp)',
    'Pengeluaran (Rp)',
    'Laba Bersih Transaksi (Rp)'
  ];

  const rows = transactions.map((tx) => {
    const isPemasukan = tx.type === 'pemasukan';
    let detail = '';
    if (isPemasukan && tx.items) {
      detail = tx.items.map(i => `${i.productName} (${i.quantity}x)`).join('; ');
    } else {
      detail = tx.description || tx.notes || 'Pengeluaran Usaha';
    }

    const modal = isPemasukan ? (tx.totalCostPrice || 0) : 0;
    const omzet = isPemasukan ? (tx.netRevenue || tx.totalSellingPrice || 0) : 0;
    const pengeluaran = !isPemasukan ? (tx.amount || 0) : 0;
    const laba = isPemasukan ? (omzet - modal) : -pengeluaran;

    return [
      `"${tx.invoiceNo}"`,
      `"${formatDateTimeIndo(tx.date)}"`,
      `"${isPemasukan ? 'Pemasukan (Penjualan)' : 'Pengeluaran'}"`,
      `"${detail.replace(/"/g, '""')}"`,
      `"${isPemasukan ? (tx.paymentMethod || 'Tunai') : (tx.expenseCategory || '-')}"`,
      modal,
      omzet,
      pengeluaran,
      laba
    ];
  });

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
