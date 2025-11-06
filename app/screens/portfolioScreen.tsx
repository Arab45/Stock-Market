import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, TextInput, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { fetchQuote } from '../../api/fmp';
import { formatCurrency } from '../utils/format';
import StockItem from '../component/stockItem';
import SearchBar from '../component/searchBar';

export default function PortfolioScreen() {
  const stocks = usePortfolioStore(state => state.stocks);
  const addStock = usePortfolioStore(state => state.addStock);
  const removeStock = usePortfolioStore(state => state.removeStock);
  const setPrice = usePortfolioStore(state => state.setPrice);

  const [symbol, setSymbol] = useState('');
  const [qty, setQty] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query) return stocks;
    const q = query.toLowerCase();
    return stocks.filter(s => s.symbol.toLowerCase().includes(q) || (s.name || '').toLowerCase().includes(q));
  }, [stocks, query]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await Promise.all(stocks.map(async s => {
          try {
            const res = await fetchQuote(s.symbol);
            setPrice(s.symbol, res.price ?? 0);
          } catch (e) {
            // ignore per-symbol error
          }
        }));
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = useMemo(() => stocks.reduce((acc, s) => acc + (s.price ?? 0) * s.quantity, 0), [stocks]);

  const handleAdd = async () => {
    setError(null);
    const sym = symbol.trim().toUpperCase();
    const quantity = Number(qty);
    if (!sym.match(/^[A-Z.]{1,6}$/)) {
      setError('Invalid symbol');
      return;
    }
    if (!quantity || quantity <= 0) {
      setError('Quantity must be > 0');
      return;
    }
    setLoading(true);
    try {
      const res = await fetchQuote(sym);
      addStock({ symbol: res.symbol, quantity, price: res.price, name: res.name });
      setSymbol('');
      setQty('1');
    } catch (e) {
      setError('Symbol not found or API error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>Portfolio</Text>
        <Text style={{ marginTop: 8 }}>Total value: {formatCurrency(total)}</Text>

        <View style={{ marginTop: 12 }}>
          <TextInput placeholder="Symbol (e.g. AAPL)" value={symbol} onChangeText={setSymbol} autoCapitalize="characters" style={styles.input} />
          <TextInput placeholder="Quantity" value={qty} onChangeText={setQty} keyboardType="numeric" style={styles.input} />
          {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
          <Button title="Add Stock" onPress={handleAdd} disabled={loading} />
        </View>

        <SearchBar value={query} onChange={setQuery} />

        {loading && <ActivityIndicator style={{ marginTop: 16 }} />}

        <FlatList
          data={filtered}
          keyExtractor={i => i.symbol}
          renderItem={({ item }) => (
            <StockItem item={item} onRemove={(s) => removeStock(s)} onUpdateQty={() => {}} />
          )}
          style={{ marginTop: 12 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: { backgroundColor: '#fff', padding: 8, borderRadius: 8, marginBottom: 8 }
});
