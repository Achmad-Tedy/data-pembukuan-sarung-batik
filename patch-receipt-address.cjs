const fs = require('fs');
let code = fs.readFileSync('src/components/ReceiptModal.tsx', 'utf8');

code = code.replace(
  /<p className="text-\[10px\] text-black leading-tight font-sans">\s*Jl\.Dr\.Ir\.Soekarno No\.19, Medokan<br \/>Semampir\s*<\/p>\s*<p className="text-\[10px\] text-black font-sans">No Telp 081234567890<\/p>\s*<p className="text-\[10px\] text-black font-sans">5120170609<\/p>/,
  '<p className="text-[10px] text-black leading-tight font-sans whitespace-pre-wrap">Pasuruan\\n(085707437883 - 082336651163)</p>'
);

fs.writeFileSync('src/components/ReceiptModal.tsx', code);
