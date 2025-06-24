import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vibration Sensor App</Text>
      <Button
        title="Live Data"
        color="#1976D2"
        onPress={() => navigation.navigate('Live Data')}
      />
      <Button
        title="History"
        color="#1976D2"
        onPress={() => navigation.navigate('History')}
      />
      <Button
        title="About"
        color="#1976D2"
        onPress={() => navigation.navigate('About')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  title: {
    fontSize: 28,
    color: '#1976D2',
    marginBottom: 40,
    fontWeight: 'bold',
  },
}); 