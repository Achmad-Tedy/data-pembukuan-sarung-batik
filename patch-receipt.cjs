const fs = require('fs');
let code = fs.readFileSync('src/components/ReceiptModal.tsx', 'utf8');

code = code.replace(/className="p-6 bg-slate-50 text-slate-100 space-y-4 font-mono text-xs border-b border-slate-700"/, 
  'className="p-6 bg-white text-black space-y-4 font-mono text-xs shadow-inner" id="printable-receipt"');

code = code.replace(/text-amber-950/g, "text-black");
code = code.replace(/text-slate-400/g, "text-gray-600");
code = code.replace(/text-slate-100/g, "text-black");
code = code.replace(/text-slate-300/g, "text-gray-800");
code = code.replace(/border-slate-600/g, "border-gray-300");
code = code.replace(/bg-blue-700 text-yellow-300/g, "bg-black text-white");

fs.writeFileSync('src/components/ReceiptModal.tsx', code);
