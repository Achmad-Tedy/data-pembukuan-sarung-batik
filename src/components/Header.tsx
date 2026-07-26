import React from 'react';
import { ShoppingBag, PlusCircle, MinusCircle, PackagePlus, RefreshCw, Download, Sparkles, LogOut, Settings } from 'lucide-react';

interface HeaderProps {
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
  return (
    <header className="bg-slate-900 border-b border-slate-700/60 sticky top-0 z-30">
      {/* Decorative Top Accent Line */}
      <div className="h-1.5 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-500 w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Brand & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 p-1 flex items-center justify-center shadow-md border border-blue-500/30 overflow-hidden">
              <img src="https://lh3.googleusercontent.com/d/14NRix0QJ1BuDB79624v8J2U4x_P-jaY4" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold font-serif tracking-wide text-white">
                  {appName}
                </h1>
                <span className="bg-blue-600 text-white text-xs px-2.5 py-0.5 rounded-full border border-blue-500/50 font-medium capitalize">
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
                ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            📊 Ringkasan
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            📑 Riwayat
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            📦 Stok Barang
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500 font-semibold'
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
                  ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500 font-semibold'
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
