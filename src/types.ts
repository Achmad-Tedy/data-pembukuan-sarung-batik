export type BatikCategory = 'Batik Cap' | 'Batik Tulis' | 'Batik Print' | 'Batik Halus Pekalongan' | 'Batik Solo' | 'Batik Custom';

export type PaymentMethod = 'Tunai' | 'Transfer Bank' | 'QRIS';

export type ExpenseCategory = 'Pembelian Stok' | 'Operasional Toko' | 'Kemasan & Packing' | 'Gaji Karyawan' | 'Transportasi & Kurir' | 'Lain-lain';

export interface ProductItem {
  id: string;
  sku: string;
  name: string; // Nama Motif / Sarung Batik
  category: BatikCategory;
  costPrice: number; // Harga Modal (HPP) per unit
  sellingPrice: number; // Harga Jual per unit
  stock: number;
  minStockAlert: number;
  variation?: string; // Variasi (Warna, Motif tambahan)
  size?: string; // Ukuran
  description?: string;
  createdAt: string;
}

export type TransactionType = 'pemasukan' | 'pengeluaran';

export interface TransactionItemDetail {
  productId: string;
  sku: string;
  productName: string;
  quantity: number;
  costPrice: number; // Modal saat transaksi
  sellingPrice: number; // Jual saat transaksi
  subtotalCost: number;
  subtotalSelling: number;
}

export interface Transaction {
  id: string;
  invoiceNo: string;
  type: TransactionType;
  date: string; // ISO string or YYYY-MM-DD THH:mm:ss
  timestamp: number;
  // If pemasukan (penjualan)
  items?: TransactionItemDetail[];
  totalCostPrice?: number; // Total Modal
  totalSellingPrice?: number; // Total Omzet
  discount?: number;
  netRevenue?: number; // Total Jual - Discount
  grossProfit?: number; // Net Revenue - Total Cost Price
  paymentMethod?: PaymentMethod;
  buyerName?: string;
  // If pengeluaran
  expenseCategory?: ExpenseCategory;
  amount?: number; // Total pengeluaran
  description?: string;
  notes?: string;
}

export interface SummaryMetrics {
  totalRevenue: number; // Penghasilan / Omzet
  totalExpenses: number; // Pengeluaran
  totalCostOfGoods: number; // Modal barang terjual
  netProfit: number; // Laba Bersih
  totalStockUnits: number; // Unit stok tersisa
  lowStockCount: number; // Jumlah produk stok tipis
  totalTransactionsCount: number;
}
