import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function LiveDataScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Vibration Data</Text>
      <View style={styles.dataBox}>
        <Text style={styles.dataText}>No data yet</Text>
      </View>
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
  dataBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 40,
    marginTop: 20,
  },
  dataText: {
    fontSize: 32,
    color: '#1976D2',
  },
}); 