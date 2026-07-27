const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const settingsModalCode = `
      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <SettingsModal
          currentAppName={appName}
          currentLogoUrl={logoUrl}
          currentThemeColor={themeColor}
          onSave={handleSaveSettings}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      )}
`;

code = code.replace(/\{\/\* Modal 1: Input Sale \(Pemasukan\) \*\/\}/, settingsModalCode.trim() + '\n\n      {/* Modal 1: Input Sale (Pemasukan) */}');

fs.writeFileSync('src/App.tsx', code);
