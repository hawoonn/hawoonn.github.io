export interface Coin {
  id: string;
  symbol: string;
  name: string;
  nameKr: string;
  location: string;
  price: number;
  prevPrice: number;
  changeRate: number;
  volume24h: number; // In million KRW
}

export interface Asset {
  symbol: string;
  balance: number;
  avgPrice: number;
  currPrice: number;
  color: string;
}

export interface OrderBookItem {
  price: number;
  amount: number;
  changeRate: number;
  
}

export type TabId = 'exchange' | 'info' | 'investment' | 'deposit' | 'more';