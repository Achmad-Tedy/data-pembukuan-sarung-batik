import React, { useState } from 'react';
import { Save, Image as ImageIcon, Type, Palette, Settings } from 'lucide-react';

interface SettingsModalProps {
  currentAppName: string;
  currentLogoUrl: string;
  currentThemeColor: string;
  onSave: (appName: string, logoUrl: string, themeColor: string) => void;
  onClose: () => void;
}

const THEME_COLORS = [
  { id: 'blue', label: 'Biru (Default)', color: 'bg-blue-600' },
  { id: 'emerald', label: 'Hijau Zamrud', color: 'bg-emerald-600' },
  { id: 'rose', label: 'Merah Muda', color: 'bg-rose-600' },
  { id: 'amber', label: 'Kuning Jingga', color: 'bg-amber-600' },
  { id: 'violet', label: 'Ungu', color: 'bg-violet-600' },
  { id: 'slate', label: 'Abu-abu Gelap', color: 'bg-slate-600' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  currentAppName,
  currentLogoUrl,
  currentThemeColor,
  onSave,
  onClose,
}) => {
  const [appName, setAppName] = useState(currentAppName);
  const [logoUrl, setLogoUrl] = useState(currentLogoUrl);
  const [themeColor, setThemeColor] = useState(currentThemeColor);

  
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(appName, logoUrl, themeColor);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-800 rounded-2xl max-w-md w-full shadow-2xl border border-slate-700 overflow-hidden">
        <div className="bg-slate-900 border-b border-slate-700 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white">Pengaturan Tampilan</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer text-xl font-bold">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-slate-300 mb-2">
              <Type className="w-4 h-4" />
              <span>Nama / Judul Aplikasi</span>
            </label>
            <input
              type="text"
              required
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-600 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="Contoh: Toko Sarung Berkah"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-slate-300 mb-2">
              <ImageIcon className="w-4 h-4" />
              <span>URL Logo (Link Gambar)</span>
            </label>
            
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

            {logoUrl && (
              <div className="mt-2 flex justify-center p-2 bg-slate-900 rounded-lg border border-slate-700">
                <img src={logoUrl} alt="Preview Logo" className="h-12 w-auto object-contain rounded" onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error';
                }} />
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-slate-300 mb-2">
              <Palette className="w-4 h-4" />
              <span>Tema Warna Utama</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {THEME_COLORS.map(color => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setThemeColor(color.id)}
                  className={`flex items-center space-x-2 p-2 rounded-lg border transition-all ${
                    themeColor === color.id 
                      ? 'border-blue-500 bg-slate-700' 
                      : 'border-slate-700 bg-slate-900 hover:border-slate-500'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${color.color}`}></div>
                  <span className="text-xs text-slate-200">{color.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-700 mt-2 space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-xl flex items-center space-x-2 font-bold shadow-lg ${getButtonClass()}`}
            >
              <Save className="w-4 h-4" />
              <span>Simpan Tampilan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
