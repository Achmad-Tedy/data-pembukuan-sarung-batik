const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const updatedModal = `
      {/* Modal 3: Printable Receipt */}
      <ReceiptModal
        transaction={selectedReceiptTx}
        onClose={() => setSelectedReceiptTx(null)}
        appName={appName}
        logoUrl={logoUrl}
        cashierName={userRole === 'admin' ? 'Bos' : 'Kasir'}
      />
`;

code = code.replace(/<ReceiptModal[\s\S]*?onClose=\{[^}]+\}\s*\/>/, updatedModal.trim());

fs.writeFileSync('src/App.tsx', code);
