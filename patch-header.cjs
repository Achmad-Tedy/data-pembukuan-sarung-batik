const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

// Add props
code = code.replace(/interface HeaderProps \{/, "interface HeaderProps {\n  logoUrl: string;\n  themeColor: string;\n  onOpenSettings: () => void;");

code = code.replace(/export const Header: React.FC<HeaderProps> = \(\{/, 
  "export const Header: React.FC<HeaderProps> = ({\n  logoUrl,\n  themeColor,\n  onOpenSettings,");

// Add Settings button to header Quick Actions
const settingsBtn = `
            {userRole === 'admin' && (
              <button
                onClick={onOpenSettings}
                title="Pengaturan Tampilan"
                className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-all border border-slate-600 cursor-pointer ml-1"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onLogout}
`;
code = code.replace(/<button\s+onClick=\{onLogout\}/, settingsBtn.trim());

// Modify theme colors mapping
const themeMapping = `
  const themeClasses: Record<string, any> = {
    blue: {
      gradient: 'from-blue-600 via-blue-400 to-blue-500',
      logoBg: 'from-blue-600 to-blue-800 border-blue-500/30',
      badgeBg: 'bg-blue-600 border-blue-500/50',
      tabActive: 'text-blue-400 border-blue-500'
    },
    emerald: {
      gradient: 'from-emerald-600 via-emerald-400 to-emerald-500',
      logoBg: 'from-emerald-600 to-emerald-800 border-emerald-500/30',
      badgeBg: 'bg-emerald-600 border-emerald-500/50',
      tabActive: 'text-emerald-400 border-emerald-500'
    },
    rose: {
      gradient: 'from-rose-600 via-rose-400 to-rose-500',
      logoBg: 'from-rose-600 to-rose-800 border-rose-500/30',
      badgeBg: 'bg-rose-600 border-rose-500/50',
      tabActive: 'text-rose-400 border-rose-500'
    },
    amber: {
      gradient: 'from-amber-600 via-amber-400 to-amber-500',
      logoBg: 'from-amber-600 to-amber-800 border-amber-500/30',
      badgeBg: 'bg-amber-600 border-amber-500/50',
      tabActive: 'text-amber-400 border-amber-500'
    },
    violet: {
      gradient: 'from-violet-600 via-violet-400 to-violet-500',
      logoBg: 'from-violet-600 to-violet-800 border-violet-500/30',
      badgeBg: 'bg-violet-600 border-violet-500/50',
      tabActive: 'text-violet-400 border-violet-500'
    },
    slate: {
      gradient: 'from-slate-500 via-slate-400 to-slate-500',
      logoBg: 'from-slate-600 to-slate-800 border-slate-500/30',
      badgeBg: 'bg-slate-600 border-slate-500/50',
      tabActive: 'text-slate-300 border-slate-400'
    }
  };
  const theme = themeClasses[themeColor] || themeClasses['blue'];
`;

code = code.replace(/return \(/, themeMapping + "\n  return (");

// Replace hardcoded blue classes with theme
code = code.replace(/bg-gradient-to-r from-blue-600 via-blue-400 to-blue-500/, "bg-gradient-to-r ${theme.gradient}");
code = code.replace(/className="h-1.5 bg-gradient-to-r \$\{theme.gradient\} w-full"/, 'className={`h-1.5 bg-gradient-to-r ${theme.gradient} w-full`}');

code = code.replace(/bg-gradient-to-br from-blue-600 to-blue-800 p-1 flex items-center justify-center shadow-md border border-blue-500\/30/, 
  "bg-gradient-to-br ${theme.logoBg} p-1 flex items-center justify-center shadow-md border");
code = code.replace(/className="w-11 h-11 rounded-xl bg-gradient-to-br \$\{theme.logoBg\} p-1 flex items-center justify-center shadow-md border overflow-hidden"/,
  'className={`w-11 h-11 rounded-xl bg-gradient-to-br ${theme.logoBg} p-1 flex items-center justify-center shadow-md border overflow-hidden`}');

code = code.replace(/<img src="https:\/\/lh3.googleusercontent.com\/d\/14NRix0QJ1BuDB79624v8J2U4x_P-jaY4"/, 
  '<img src={logoUrl}');

code = code.replace(/className="bg-blue-600 text-white text-xs px-2.5 py-0.5 rounded-full border border-blue-500\/50 font-medium capitalize"/,
  'className={`text-white text-xs px-2.5 py-0.5 rounded-full border font-medium capitalize ${theme.badgeBg}`}');

code = code.replace(/text-blue-400 border-b-2 border-blue-500/g, "${theme.tabActive} border-b-2");

fs.writeFileSync('src/components/Header.tsx', code);
