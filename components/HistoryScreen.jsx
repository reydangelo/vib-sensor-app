import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vibration History</Text>
      <Text style={styles.info}>No events recorded yet.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: '#1976D2',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 16,
    color: '#1976D2',
  },
}); 