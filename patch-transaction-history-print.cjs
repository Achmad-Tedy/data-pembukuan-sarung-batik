const fs = require('fs');
let code = fs.readFileSync('src/components/TransactionHistory.tsx', 'utf8');

code = code.replace(
  /\{isPemasukan && \([\s\S]*?<button[\s\S]*?onClick=\{\(\) => onSelectReceipt\(tx\)\}[\s\S]*?title="Cetak Nota \/ Struk"[\s\S]*?<Printer className="w-4 h-4" \/>\s*<\/button>\s*\)\}/m,
  `<button
    onClick={() => onSelectReceipt(tx)}
    title="Cetak Nota / Struk"
    className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-400/20 rounded-lg cursor-pointer"
  >
    <Printer className="w-4 h-4" />
  </button>`
);

fs.writeFileSync('src/components/TransactionHistory.tsx', code);
