import DateTimePicker from '@react-native-community/datetimepicker';
import React, {useState} from 'react';
import {Alert, Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {useInvestmentStore} from '../store/useInvestmentStore';

export default function AddInvestment() {
  const addInvestment = useInvestmentStore((s) => s.addInvestment);

  const [symbol, setSymbol] = useState('');
  const [price, setPrice] = useState('');
  const [shares, setShares] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onSubmit = () => {
    if (!symbol || !price || !shares) {
      Alert.alert('請填寫所有欄位');
      return;
    }

    addInvestment({
      symbol: symbol.toUpperCase(),
      price: parseFloat(price),
      shares: parseFloat(shares),
      date: date.toISOString().split('T')[0],
    });

    Alert.alert('已新增投資紀錄');
    setSymbol('');
    setPrice('');
    setShares('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>股票 / ETF 代號</Text>
      <TextInput style={styles.input} value={symbol} onChangeText={setSymbol} placeholder="ex: 2330, AAPL" />

      <Text style={styles.label}>購買價格</Text>
      <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="decimal-pad" />

      <Text style={styles.label}>購買股數</Text>
      <TextInput style={styles.input} value={shares} onChangeText={setShares} keyboardType="decimal-pad" />

      <Text style={styles.label}>購買日期</Text>
      <Button title={date.toISOString().split('T')[0]} onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <View style={{ marginTop: 24 }}>
        <Button title="新增投資" onPress={onSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontSize: 16, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },
});
