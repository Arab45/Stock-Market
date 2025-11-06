import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { formatCurrency } from '../utils/format';
import { Stock } from '../type';

type Props = { item: Stock; onRemove: (s: string) => void; onUpdateQty?: (s: string, q: number) => void };

export default function StockItem({ item, onRemove }: Props) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.symbol}>{item.symbol}</Text>
        <Text style={styles.name}>{item.name}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text>{formatCurrency(item.price ?? 0)}</Text>
        <Text>Qty: {item.quantity}</Text>
        <Text>Total: {formatCurrency((item.price ?? 0) * item.quantity)}</Text>
      </View>
      <Pressable onPress={() => onRemove(item.symbol)} style={styles.removeBtn}>
        <Text style={{ color: 'white' }}>Remove</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', padding: 12, alignItems: 'center', borderBottomWidth: 1, borderColor: '#eee' },
  symbol: { fontWeight: '700', fontSize: 16 },
  name: { color: '#666' },
  removeBtn: { backgroundColor: '#d9534f', padding: 8, borderRadius: 6, marginLeft: 8 }
});
