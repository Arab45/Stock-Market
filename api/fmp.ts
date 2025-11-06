import axios from 'axios';

const BASE = 'https://financialmodelingprep.com/api/v3';
const API_KEY = process.env.FMP_API_KEY || '';

export async function fetchQuote(symbol: string) {
  const url = `${BASE}/quote/${encodeURIComponent(symbol)}?apikey=${API_KEY}`;
  const res = await axios.get(url);
  if (!res?.data || !Array.isArray(res.data) || res.data.length === 0) {
    throw new Error('No quote found');
  }
  const q = res.data[0];
  return {
    symbol: q.symbol,
    price: q.price,
    name: q.name || q.companyName || q.symbol,
  };
}
