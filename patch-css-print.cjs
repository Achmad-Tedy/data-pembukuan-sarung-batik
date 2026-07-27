const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

code = code.replace(/\.fixed\.inset-0 \.p-6/g, '#printable-receipt');

fs.writeFileSync('src/index.css', code);
