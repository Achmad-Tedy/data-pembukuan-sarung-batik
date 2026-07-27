const fs = require('fs');
let code = fs.readFileSync('src/lib/api.ts', 'utf8');

code = code.replace(/\/\/ Also update stock if it's a sales transaction[\s\S]*?saveLocalData\(PRODUCTS_KEY, updatedProducts\);\n  }/, '');

fs.writeFileSync('src/lib/api.ts', code);
