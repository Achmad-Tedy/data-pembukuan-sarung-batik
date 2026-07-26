const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/showToast\('Gagal menambahkan produk', 'error'\);/g, "showToast(`Gagal: ${(err as Error).message || 'Gagal menambahkan produk'}`, 'error');");
code = code.replace(/showToast\('Gagal menyimpan penjualan', 'error'\);/g, "showToast(`Gagal: ${(err as Error).message || 'Gagal menyimpan penjualan'}`, 'error');");
code = code.replace(/showToast\('Gagal menyimpan pengeluaran', 'error'\);/g, "showToast(`Gagal: ${(err as Error).message || 'Gagal menyimpan pengeluaran'}`, 'error');");

fs.writeFileSync('src/App.tsx', code);
