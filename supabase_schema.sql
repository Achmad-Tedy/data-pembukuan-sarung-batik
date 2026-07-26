-- Skema Database PostgreSQL untuk Supabase
-- Aplikasi Pembukuan Sarung Batik

-- 1. Tabel Products (Daftar Barang)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    cost_price INTEGER NOT NULL DEFAULT 0,
    selling_price INTEGER NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    min_stock_alert INTEGER NOT NULL DEFAULT 5,
    variation TEXT,
    size TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Tabel Transactions (Riwayat Pemasukan & Pengeluaran)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_no TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('pemasukan', 'pengeluaran')),
    date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    
    -- Kolom khusus Pemasukan (Sale)
    total_cost_price INTEGER,
    total_selling_price INTEGER,
    discount INTEGER DEFAULT 0,
    net_revenue INTEGER,
    gross_profit INTEGER,
    payment_method TEXT,
    buyer_name TEXT,
    
    -- Kolom khusus Pengeluaran (Expense)
    expense_category TEXT,
    amount INTEGER,
    description TEXT,
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Tabel Transaction Items (Detail barang yang terjual pada setiap transaksi)
CREATE TABLE transaction_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL,
    cost_price INTEGER NOT NULL,
    selling_price INTEGER NOT NULL,
    subtotal_cost INTEGER NOT NULL,
    subtotal_selling INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Index untuk mempercepat query pencarian dan filter
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transaction_items_tx_id ON transaction_items(transaction_id);
