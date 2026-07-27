const fs = require('fs');
let code = fs.readFileSync('src/components/ReceiptModal.tsx', 'utf8');

code = code.replace(/<div className="flex justify-center mt-3">[\s\S]*?<\/div>/, '');

fs.writeFileSync('src/components/ReceiptModal.tsx', code);
