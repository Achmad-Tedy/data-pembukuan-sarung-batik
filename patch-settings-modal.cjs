const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

const themeButtons = `
  const getButtonClass = () => {
    switch(themeColor) {
      case 'emerald': return 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20';
      case 'rose': return 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/20';
      case 'amber': return 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/20';
      case 'violet': return 'bg-violet-600 hover:bg-violet-500 shadow-violet-900/20';
      case 'slate': return 'bg-slate-600 hover:bg-slate-500 shadow-slate-900/20';
      default: return 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20';
    }
  };
`;

code = code.replace(/const handleSubmit =/, themeButtons + "\n  const handleSubmit =");
code = code.replace(/className=\{\`px-4 py-2 bg-\$\{themeColor\}-600 hover:bg-\$\{themeColor\}-500 text-white rounded-xl flex items-center space-x-2 font-bold shadow-lg shadow-\$\{themeColor\}-900\/20\`\}/,
  "className={`px-4 py-2 text-white rounded-xl flex items-center space-x-2 font-bold shadow-lg ${getButtonClass()}`}");

fs.writeFileSync('src/components/SettingsModal.tsx', code);
