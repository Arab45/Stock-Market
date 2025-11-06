import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

type Props = { value: string; onChange: (t: string) => void };

export default function SearchBar({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search symbol or name"
        value={value}
        onChangeText={onChange}
        style={styles.input}
        autoCapitalize="characters"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 8 },
  input: { backgroundColor: '#efefef', padding: 8, borderRadius: 8 }
});
