const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Imports
code = code.replace(/import \{ Header \} from '.\/components\/Header';/, "import { Header } from './components/Header';\nimport { SettingsModal } from './components/SettingsModal';");

// State
const stateToAdd = `
  const [logoUrl, setLogoUrl] = useState(() => {
    return localStorage.getItem('batik_logo_url') || 'https://lh3.googleusercontent.com/d/14NRix0QJ1BuDB79624v8J2U4x_P-jaY4';
  });
  const [themeColor, setThemeColor] = useState(() => {
    return localStorage.getItem('batik_theme_color') || 'blue';
  });
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
`;
code = code.replace(/const \[appName, setAppName\] = useState\(\(\) => \{[\s\S]*?\}\);/, 
  "const [appName, setAppName] = useState(() => {\n    return localStorage.getItem('batik_app_name') || 'Pembukuan Sarung Batik Pasuruan';\n  });\n" + stateToAdd);

// Save handler
const saveHandler = `
  const handleSaveSettings = (newAppName: string, newLogoUrl: string, newThemeColor: string) => {
    setAppName(newAppName);
    setLogoUrl(newLogoUrl);
    setThemeColor(newThemeColor);
    localStorage.setItem('batik_app_name', newAppName);
    localStorage.setItem('batik_logo_url', newLogoUrl);
    localStorage.setItem('batik_theme_color', newThemeColor);
    setIsSettingsModalOpen(false);
    showToast('Pengaturan tampilan berhasil disimpan', 'success');
  };
`;
code = code.replace(/const handleLogin = /, saveHandler + "\n  const handleLogin = ");

// Update Header
code = code.replace(/<Header[\s\S]*?appName=\{appName\}/, 
  "<Header\n        logoUrl={logoUrl}\n        themeColor={themeColor}\n        onOpenSettings={() => setIsSettingsModalOpen(true)}\n        appName={appName}");

// Add Modal
const settingsModal = `
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
code = code.replace(/\{isNewProductModalOpen && \(/, settingsModal + "      {isNewProductModalOpen && (");

fs.writeFileSync('src/App.tsx', code);
