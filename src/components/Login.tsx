import React, { useState } from 'react';
import { Lock, LogIn, AlertCircle, Store, Shield } from 'lucide-react';

interface LoginProps {
  onLogin: (role: 'admin' | 'cashier', password?: string) => void;
  error?: string;
  appName: string;
}

export function Login({ onLogin, error, appName }: LoginProps) {
  const [password, setPassword] = useState('');

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin('admin', password);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 selection:bg-blue-300">
      <div className="max-w-md w-full bg-slate-800 rounded-3xl shadow-xl border border-slate-700 overflow-hidden">
        {/* Header section */}
        <div className="bg-blue-700 px-8 py-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-900 mb-4 ring-4 ring-blue-700/30 overflow-hidden">
            <img src="https://lh3.googleusercontent.com/d/14NRix0QJ1BuDB79624v8J2U4x_P-jaY4" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mb-2">Selamat Datang</h2>
          <p className="text-blue-100 text-sm">{appName}</p>
        </div>

        {/* Main Access section */}
        <div className="px-8 py-8 space-y-8">
          
          {/* Bos Access */}
          <div>
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2" htmlFor="password">
                  Password Bos
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                  required
                />
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-rose-400 bg-rose-900/20 p-3 rounded-xl text-sm font-medium border border-rose-900/50">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white rounded-xl py-3 px-4 font-bold hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-900/20"
              >
                <span>Masuk sebagai Bos</span>
                <LogIn className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
