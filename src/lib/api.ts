import { ProductItem, Transaction, TransactionItemDetail } from '../types';
import { INITIAL_PRODUCTS, INITIAL_TRANSACTIONS } from '../data/initialData';

// Local storage keys
const PRODUCTS_KEY = 'batik_products';
const TRANSACTIONS_KEY = 'batik_transactions';

const getLocalData = <T>(key: string, initialData: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialData;
  } catch (error) {
    return initialData;
  }
};

const saveLocalData = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving local data:', error);
  }
};

export const fetchProducts = async (): Promise<ProductItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getLocalData(PRODUCTS_KEY, INITIAL_PRODUCTS));
    }, 300); // Simulate network delay
  });
};

export const fetchTransactions = async (): Promise<Transaction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getLocalData(TRANSACTIONS_KEY, INITIAL_TRANSACTIONS));
    }, 300);
  });
};

const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

export const addProduct = async (product: Omit<ProductItem, 'id' | 'createdAt'>): Promise<ProductItem> => {
  const newProduct: ProductItem = {
    ...product,
    id: generateId(),
    createdAt: new Date().toISOString()
  };
  
  const current = getLocalData<ProductItem[]>(PRODUCTS_KEY, INITIAL_PRODUCTS);
  saveLocalData(PRODUCTS_KEY, [newProduct, ...current]);
  
  return newProduct;
};

export const updateProduct = async (product: ProductItem): Promise<void> => {
  const current = getLocalData<ProductItem[]>(PRODUCTS_KEY, INITIAL_PRODUCTS);
  const updated = current.map(p => p.id === product.id ? product : p);
  saveLocalData(PRODUCTS_KEY, updated);
};

export const deleteProduct = async (id: string): Promise<void> => {
  const current = getLocalData<ProductItem[]>(PRODUCTS_KEY, INITIAL_PRODUCTS);
  const updated = current.filter(p => p.id !== id);
  saveLocalData(PRODUCTS_KEY, updated);
};

export const addTransaction = async (tx: Omit<Transaction, 'id'>): Promise<Transaction> => {
  const newTx: Transaction = {
    ...tx,
    id: generateId(),
    timestamp: new Date(tx.date).getTime()
  };
  
  const current = getLocalData<Transaction[]>(TRANSACTIONS_KEY, INITIAL_TRANSACTIONS);
  saveLocalData(TRANSACTIONS_KEY, [newTx, ...current]);
  
  
  
  return newTx;
};

export const updateTransaction = async (id: string, updates: Partial<Transaction>): Promise<void> => {
  const current = getLocalData<Transaction[]>(TRANSACTIONS_KEY, INITIAL_TRANSACTIONS);
  const updated = current.map(tx => tx.id === id ? { ...tx, ...updates } : tx);
  saveLocalData(TRANSACTIONS_KEY, updated);
};

export const deleteTransaction = async (id: string): Promise<void> => {
  const current = getLocalData<Transaction[]>(TRANSACTIONS_KEY, INITIAL_TRANSACTIONS);
  const updated = current.filter(tx => tx.id !== id);
  saveLocalData(TRANSACTIONS_KEY, updated);
};

export const clearTransactions = async (): Promise<void> => {
  saveLocalData(TRANSACTIONS_KEY, []);
};

export const clearProducts = async (): Promise<void> => {
  saveLocalData(PRODUCTS_KEY, []);
};
