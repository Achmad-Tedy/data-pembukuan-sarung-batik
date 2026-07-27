const fs = require('fs');
let code = fs.readFileSync('src/components/ReceiptModal.tsx', 'utf8');

const expenseSection = `
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
`;

code = code.replace(/\{\/\* Items List \*\/\}[\s\S]*?\{\/\* Price Calculation \*\/\}/, expenseSection + '\n\n            <div className="border-t border-dashed border-gray-400"></div>\n\n            {/* Price Calculation */}');

const totalCalc = `
  const totalSelling = transaction.type === 'pemasukan' 
    ? (transaction.netRevenue ?? (transaction.totalSellingPrice ?? 0))
    : (transaction.amount ?? 0);
  
  const txDate = new Date(transaction.date);
  const formattedDate = txDate.toLocaleDateString('id-ID');
  const formattedTime = txDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute:'2-digit', second:'2-digit' });
  const totalQty = transaction.type === 'pemasukan' 
    ? (transaction.items?.reduce((acc, item) => acc + item.quantity, 0) || 0)
    : 1;
`;

code = code.replace(/const totalSelling = transaction\.netRevenue \?\? \(transaction\.totalSellingPrice \?\? 0\);[\s\S]*?\|\| 0;/, totalCalc);

const subtotalDisplay = `
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatRupiah(transaction.type === 'pemasukan' ? (transaction.totalSellingPrice || 0) : (transaction.amount || 0)).replace('Rp', '')}</span>
              </div>
`;

code = code.replace(/<div className="flex justify-between">\s*<span>Subtotal<\/span>\s*<span>\{formatRupiah\(transaction\.totalSellingPrice \|\| 0\)\.replace\('Rp', ''\)\}<\/span>\s*<\/div>/, subtotalDisplay);

fs.writeFileSync('src/components/ReceiptModal.tsx', code);
