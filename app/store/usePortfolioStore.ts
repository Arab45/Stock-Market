import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import asyncStorageWrapper from '../utils/asyncStorageWrapper';
import { Stock } from '../type';
type State = {
  stocks: Stock[];
  addStock: (s: Stock) => void;
  removeStock: (symbol: string) => void;
  updateQuantity: (symbol: string, qty: number) => void;
  setPrice: (symbol: string, price: number) => void;
  clear: () => void;
};

export const usePortfolioStore = create<State>()(
  persist(
    (set, get) => ({
      stocks: [],
      addStock: (s) => {
        const exists = get().stocks.find(x => x.symbol.toUpperCase() === s.symbol.toUpperCase());
        if (exists) {
          set({
            stocks: get().stocks.map(x =>
              x.symbol.toUpperCase() === s.symbol.toUpperCase()
                ? { ...x, quantity: x.quantity + s.quantity }
                : x
            )
          });
        } else {
          set({ stocks: [...get().stocks, { ...s, symbol: s.symbol.toUpperCase() }] });
        }
      },
      removeStock: (symbol) =>
        set({ stocks: get().stocks.filter(x => x.symbol.toUpperCase() !== symbol.toUpperCase()) }),
      updateQuantity: (symbol, qty) =>
        set({ stocks: get().stocks.map(x => x.symbol.toUpperCase() === symbol.toUpperCase() ? { ...x, quantity: qty } : x) }),
      setPrice: (symbol, price) =>
        set({ stocks: get().stocks.map(x => x.symbol.toUpperCase() === symbol.toUpperCase() ? { ...x, price } : x) }),
      clear: () => set({ stocks: [] }),
    }),
    {
      name: 'portfolio-storage',
      storage: asyncStorageWrapper,
    }
  )
);
