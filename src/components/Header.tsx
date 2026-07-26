import React from 'react';
import { ShoppingBag, PlusCircle, MinusCircle, PackagePlus, RefreshCw, Download, Sparkles, LogOut, Settings } from 'lucide-react';

interface HeaderProps {
  logoUrl: string;
  themeColor: string;
  onOpenSettings: () => void;
  appName: string;
  userRole: 'admin' | 'cashier' | null;
  onOpenSaleModal: () => void;
  onOpenExpenseModal: () => void;
  onOpenNewProductModal: () => void;
  onExportCSV: () => void;
  onResetData: () => void;
  onLogout: () => void;
  activeTab: 'dashboard' | 'inventory' | 'history' | 'analytics' | 'admin';
  setActiveTab: (tab: 'dashboard' | 'inventory' | 'history' | 'analytics' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({
  logoUrl,
  themeColor,
  onOpenSettings,
  appName,
  userRole,
  onOpenSaleModal,
  onOpenExpenseModal,
  onOpenNewProductModal,
  onExportCSV,
  onResetData,
  onLogout,
  activeTab,
  setActiveTab,
}) => {
  
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

  return (
    <header className="bg-slate-900 border-b border-slate-700/60 sticky top-0 z-30">
      {/* Decorative Top Accent Line */}
      <div className={`h-1.5 bg-gradient-to-r ${theme.gradient} w-full`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Brand & Title */}
          <div className="flex items-center space-x-3.5">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${theme.logoBg} p-1 flex items-center justify-center shadow-md border overflow-hidden`}>
              <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold font-serif tracking-wide text-white">
                  {appName}
                </h1>
                <span className={`text-white text-xs px-2.5 py-0.5 rounded-full border font-medium capitalize ${theme.badgeBg}`}>
                  {userRole === 'admin' ? 'Bos' : userRole}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pencatatan Pemasukan, Pengeluaran, Stok &amp; Laba Usaha
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenSaleModal}
              className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md transition-all active:scale-95 border border-emerald-500/30 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Pemasukan</span>
            </button>

            <button
              onClick={onOpenExpenseModal}
              className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm shadow-md transition-all active:scale-95 border border-rose-500/30 cursor-pointer"
            >
              <MinusCircle className="w-4 h-4" />
              <span>+ Pengeluaran</span>
            </button>

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
              title="Keluar (Logout)"
              className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 text-sm transition-all border border-slate-700 cursor-pointer ml-2"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 mt-4 pt-2 border-t border-slate-700/60 overflow-x-auto text-sm">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'dashboard'
                ? `bg-slate-800 ${theme.tabActive} border-b-2 font-semibold`
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            📊 Ringkasan
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'history'
                ? `bg-slate-800 ${theme.tabActive} border-b-2 font-semibold`
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            📑 Riwayat
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'inventory'
                ? `bg-slate-800 ${theme.tabActive} border-b-2 font-semibold`
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            📦 Stok Barang
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'analytics'
                ? `bg-slate-800 ${theme.tabActive} border-b-2 font-semibold`
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            📈 Grafik
          </button>
          {userRole === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 rounded-t-lg font-medium transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1 ${
                activeTab === 'admin'
                  ? `bg-slate-800 ${theme.tabActive} border-b-2 font-semibold`
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Panel Bos</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
