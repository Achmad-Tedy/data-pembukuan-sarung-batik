import { supabase } from './supabase';
import { ProductItem, Transaction, TransactionItemDetail } from '../types';

export const fetchProducts = async (): Promise<ProductItem[]> => {
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  
  return data.map(p => ({
    id: p.id,
    sku: p.sku,
    name: p.name,
    category: p.category as any,
    costPrice: p.cost_price,
    sellingPrice: p.selling_price,
    stock: p.stock,
    minStockAlert: p.min_stock_alert,
    variation: p.variation,
    size: p.size,
    description: p.description,
    createdAt: p.created_at
  }));
};

export const fetchTransactions = async (): Promise<Transaction[]> => {
  const { data: txs, error: txError } = await supabase.from('transactions').select('*').order('date', { ascending: false });
  if (txError) throw txError;
  
  const { data: items, error: itemsError } = await supabase.from('transaction_items').select('*, products(name, sku)');
  if (itemsError) throw itemsError;
  
  return txs.map(tx => {
    const txItems = items.filter(i => i.transaction_id === tx.id);
    
    return {
      id: tx.id,
      invoiceNo: tx.invoice_no,
      type: tx.type as any,
      date: tx.date,
      timestamp: new Date(tx.date).getTime(),
      
      // Pemasukan
      items: txItems.map(i => ({
        productId: i.product_id,
        sku: i.products?.sku || '',
        productName: i.products?.name || '',
        quantity: i.quantity,
        costPrice: i.cost_price,
        sellingPrice: i.selling_price,
        subtotalCost: i.subtotal_cost,
        subtotalSelling: i.subtotal_selling
      })),
      totalCostPrice: tx.total_cost_price,
      totalSellingPrice: tx.total_selling_price,
      discount: tx.discount,
      netRevenue: tx.net_revenue,
      grossProfit: tx.gross_profit,
      paymentMethod: tx.payment_method as any,
      buyerName: tx.buyer_name,
      
      // Pengeluaran
      expenseCategory: tx.expense_category as any,
      amount: tx.amount,
      description: tx.description,
      notes: tx.notes
    };
  });
};

export const addProduct = async (product: Omit<ProductItem, 'id' | 'createdAt'>): Promise<ProductItem> => {
  const { data, error } = await supabase.from('products').insert({
    sku: product.sku,
    name: product.name,
    category: product.category,
    cost_price: product.costPrice,
    selling_price: product.sellingPrice,
    stock: product.stock,
    min_stock_alert: product.minStockAlert,
    variation: product.variation,
    size: product.size,
    description: product.description
  }).select().single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    sku: data.sku,
    name: data.name,
    category: data.category as any,
    costPrice: data.cost_price,
    sellingPrice: data.selling_price,
    stock: data.stock,
    minStockAlert: data.min_stock_alert,
    variation: data.variation,
    size: data.size,
    description: data.description,
    createdAt: data.created_at
  };
};

export const updateProduct = async (product: ProductItem): Promise<void> => {
  const { error } = await supabase.from('products').update({
    sku: product.sku,
    name: product.name,
    category: product.category,
    cost_price: product.costPrice,
    selling_price: product.sellingPrice,
    stock: product.stock,
    min_stock_alert: product.minStockAlert,
    variation: product.variation,
    size: product.size,
    description: product.description
  }).eq('id', product.id);
  
  if (error) throw error;
};

export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
};

export const addTransaction = async (tx: Omit<Transaction, 'id'>): Promise<Transaction> => {
  const { data: insertedTx, error } = await supabase.from('transactions').insert({
    invoice_no: tx.invoiceNo,
    type: tx.type,
    date: tx.date,
    total_cost_price: tx.totalCostPrice,
    total_selling_price: tx.totalSellingPrice,
    discount: tx.discount,
    net_revenue: tx.netRevenue,
    gross_profit: tx.grossProfit,
    payment_method: tx.paymentMethod,
    buyer_name: tx.buyerName,
    expense_category: tx.expenseCategory,
    amount: tx.amount,
    description: tx.description,
    notes: tx.notes
  }).select().single();
  
  if (error) throw error;
  
  if (tx.items && tx.items.length > 0) {
    const itemsToInsert = tx.items.map(item => ({
      transaction_id: insertedTx.id,
      product_id: item.productId,
      quantity: item.quantity,
      cost_price: item.costPrice,
      selling_price: item.sellingPrice,
      subtotal_cost: item.subtotalCost,
      subtotal_selling: item.subtotalSelling
    }));
    
    const { error: itemsError } = await supabase.from('transaction_items').insert(itemsToInsert);
    if (itemsError) throw itemsError;
  }
  
  return {
    ...tx,
    id: insertedTx.id,
    timestamp: new Date(insertedTx.date).getTime()
  };
};


export const updateTransaction = async (id: string, updates: Partial<Transaction>): Promise<void> => {
  const dbUpdates: any = {};
  if (updates.buyerName !== undefined) dbUpdates.buyer_name = updates.buyerName;
  if (updates.paymentMethod !== undefined) dbUpdates.payment_method = updates.paymentMethod;
  if (updates.discount !== undefined) dbUpdates.discount = updates.discount;
  if (updates.netRevenue !== undefined) dbUpdates.net_revenue = updates.netRevenue;
  if (updates.grossProfit !== undefined) dbUpdates.gross_profit = updates.grossProfit;
  
  if (updates.expenseCategory !== undefined) dbUpdates.expense_category = updates.expenseCategory;
  if (updates.amount !== undefined) dbUpdates.amount = updates.amount;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
  if (updates.date !== undefined) dbUpdates.date = updates.date;

  if (Object.keys(dbUpdates).length === 0) return;

  const { error } = await supabase.from('transactions').update(dbUpdates).eq('id', id);
  if (error) throw error;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  const { error } = await supabase.from('transactions').delete().eq('id', id);
  if (error) throw error;
};

export const clearTransactions = async (): Promise<void> => {
  const { error } = await supabase.from('transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (error) throw error;
};

export const clearProducts = async (): Promise<void> => {
  const { error } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (error) throw error;
};
