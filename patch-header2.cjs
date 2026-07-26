const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

code = code.replace(/'bg-slate-800 \$\{theme\.tabActive\} border-b-2 font-semibold'/g, "\`bg-slate-800 \$\{theme.tabActive\} border-b-2 font-semibold\`");

fs.writeFileSync('src/components/Header.tsx', code);
