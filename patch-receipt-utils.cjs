const fs = require('fs');
let code = fs.readFileSync('src/components/ReceiptModal.tsx', 'utf8');

code = code.replace(/const formattedDate = txDate\.toISOString\(\)\.split\('T'\)\[0\];/,
  "const formattedDate = txDate.toLocaleDateString('id-ID');");
code = code.replace(/const formattedTime = txDate\.toTimeString\(\)\.split\(' '\)\[0\];/,
  "const formattedTime = txDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute:'2-digit', second:'2-digit' });");

fs.writeFileSync('src/components/ReceiptModal.tsx', code);
