const fs = require('fs');
let code = fs.readFileSync('src/components/TransactionHistory.tsx', 'utf8');

// Add import for Edit
code = code.replace(/import \{ History, Search, Calendar, Filter, ArrowUpRight, ArrowDownRight, Printer, Trash2, FileSpreadsheet, Eye \} from 'lucide-react';/,
  "import { History, Search, Calendar, Filter, ArrowUpRight, ArrowDownRight, Printer, Trash2, FileSpreadsheet, Eye, Edit } from 'lucide-react';\nimport { EditTransactionModal } from './EditTransactionModal';");

// Add onEditTransaction to props
code = code.replace(/onDeleteTransaction: \(txId: string\) => void;/,
  "onDeleteTransaction: (txId: string) => void;\n  onEditTransaction: (txId: string, updates: Partial<Transaction>) => void;");

// Add to destructured props
code = code.replace(/onDeleteTransaction,/, "onDeleteTransaction,\n  onEditTransaction,");

// Add state for editModalTx
code = code.replace(/const \[detailModalTx, setDetailModalTx\] = useState<Transaction \| null>\(null\);/,
  "const [detailModalTx, setDetailModalTx] = useState<Transaction | null>(null);\n  const [editModalTx, setEditModalTx] = useState<Transaction | null>(null);");

// Add Edit button
const editBtn = `
                          <button
                            onClick={() => setEditModalTx(tx)}
                            title="Koreksi Transaksi"
                            className="p-1.5 text-blue-500 hover:text-blue-400 hover:bg-blue-900/30 rounded-lg cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
`;
code = code.replace(/\{isPemasukan && \(/, editBtn + "                          {isPemasukan && (");

// Add EditModal to return
const editModal = `
      {editModalTx && (
        <EditTransactionModal
          transaction={editModalTx}
          onClose={() => setEditModalTx(null)}
          onSave={(txId, updates) => {
            onEditTransaction(txId, updates);
            setEditModalTx(null);
          }}
        />
      )}
`;
code = code.replace(/\{detailModalTx && \(/, editModal + "      {detailModalTx && (");

fs.writeFileSync('src/components/TransactionHistory.tsx', code);
