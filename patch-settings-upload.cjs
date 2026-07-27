const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

const fileUploadLogic = `
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran gambar maksimal 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
`;
code = code.replace(/const handleSubmit =/, fileUploadLogic + "\n  const handleSubmit =");

const imageInputUI = `
            <div className="flex flex-col space-y-2">
              <label className="flex items-center justify-center w-full px-4 py-2 bg-slate-800 border border-slate-600 border-dashed rounded-xl cursor-pointer hover:bg-slate-700 transition-colors">
                <span className="text-sm text-slate-300">Pilih file gambar dari komputer...</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 w-full text-center">Atau masukkan link gambar di bawah:</span>
              </div>
              <input
                type="text"
                required
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-600 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="https://..."
              />
            </div>
`;

code = code.replace(/<input\s+type="text"\s+required\s+value=\{logoUrl\}[\s\S]*?placeholder="https:\/\/\.\.\."\s+\/>/, imageInputUI);

fs.writeFileSync('src/components/SettingsModal.tsx', code);
