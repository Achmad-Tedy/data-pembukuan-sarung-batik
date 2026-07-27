const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const effectCode = `
  useEffect(() => {
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = logoUrl;
    document.getElementsByTagName('head')[0].appendChild(link);
    document.title = appName;
  }, [logoUrl, appName]);
`;

code = code.replace(/const handleSaveSettings =/, effectCode + "\n  const handleSaveSettings =");
fs.writeFileSync('src/App.tsx', code);
