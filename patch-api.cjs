const fs = require('fs');
let code = fs.readFileSync('src/lib/api.ts', 'utf8');

const updateTxCode = `
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
`;

code = code.replace("export const deleteTransaction", updateTxCode + "\nexport const deleteTransaction");
fs.writeFileSync('src/lib/api.ts', code);
