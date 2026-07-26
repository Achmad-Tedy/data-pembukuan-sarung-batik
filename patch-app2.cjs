const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const editHandler = `
  const handleEditTransaction = async (txId: string, updates: Partial<Transaction>) => {
    try {
      await api.updateTransaction(txId, updates);
      
      const txIndex = transactions.findIndex(t => t.id === txId);
      if (txIndex !== -1) {
        const newTransactions = [...transactions];
        newTransactions[txIndex] = { ...newTransactions[txIndex], ...updates };
        setTransactions(newTransactions);
      }
      
      showToast('Transaksi berhasil dikoreksi', 'info');
    } catch (err) {
      console.error(err);
      showToast('Gagal mengoreksi transaksi', 'error');
    }
  };
`;
code = code.replace(/const handleClearTransactions = async \(\) => \{/, editHandler + "\n  const handleClearTransactions = async () => {");

code = code.replace(/<TransactionHistory([\s\S]*?)onDeleteTransaction=\{handleDeleteTransaction\}/, 
  "<TransactionHistory$1onDeleteTransaction={handleDeleteTransaction}\n            onEditTransaction={handleEditTransaction}");

fs.writeFileSync('src/App.tsx', code);
