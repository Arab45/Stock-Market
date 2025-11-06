export type Stock = {
    symbol: string;
    quantity: number;
    price?: number;
    name?: string;
  };
  
  export type State = {
    stocks: Stock[];
    addStock: (s: Stock) => void;
    removeStock: (symbol: string) => void;
    updateQuantity: (symbol: string, qty: number) => void;
    setPrice: (symbol: string, price: number) => void;
    clear: () => void;
  };