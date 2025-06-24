import Slider from '@react-native-community/slider';
import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from '../context/DataContext';

export default function Settings() {
  const { config, setConfig } = useData();
  const isDark = config.theme === 'dark';
  const backgroundColor = isDark ? '#151718' : '#F7FAFF';
  const cardColor = isDark ? '#23262b' : '#fff';
  const textColor = isDark ? '#fff' : '#1976D2';
  const secondaryText = isDark ? '#9BA1A6' : '#1976D2';
  const clearButtonColor = isDark ? '#D32F2F' : '#D32F2F';
  const clearButtonTextColor = isDark ? '#fff' : '#fff';

  const handleThemeChange = (theme: 'light' | 'dark') => {
    setConfig({ ...config, theme });
  };

  const handleAutoConnectChange = (value: boolean) => {
    setConfig({ ...config, autoConnect: value });
  };

  const handleThresholdChange = (value: number) => {
    setConfig({ ...config, threshold: value });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Settings</Text>

      {/* Bluetooth Auto-Connect */}
      <View style={[styles.card, { backgroundColor: cardColor }]}>
        <View style={styles.rowBetween}>
          <Text style={[styles.label, { color: secondaryText }]}>Bluetooth Auto-Connect</Text>
          <Switch
            value={config.autoConnect}
            onValueChange={handleAutoConnectChange}
            trackColor={{ false: '#E3F2FD', true: '#90caf9' }}
            thumbColor={config.autoConnect ? '#1976D2' : '#fff'}
          />
        </View>
      </View>

      {/* Vibration Threshold */}
      <View style={[styles.card, { backgroundColor: cardColor }]}>
        <Text style={[styles.label, { color: secondaryText }]}>Vibration Threshold: <Text style={{color:'#1976D2', fontWeight:'bold'}}>{config.threshold}</Text></Text>
        <View style={styles.sliderRow}>
          <Text style={[styles.sliderLabel, { color: secondaryText }]}>0</Text>
          <Slider
            style={{ flex: 1 }}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={config.threshold}
            onValueChange={handleThresholdChange}
            minimumTrackTintColor="#1976D2"
            maximumTrackTintColor="#E3F2FD"
            thumbTintColor="#1976D2"
          />
          <Text style={[styles.sliderLabel, { color: secondaryText }]}>100</Text>
        </View>
      </View>

      {/* Theme Selection */}
      <View style={[styles.card, { backgroundColor: cardColor }]}>
        <Text style={[styles.label, { color: secondaryText }]}>Theme</Text>
        <View style={styles.themeRow}>
          <TouchableOpacity
            style={[styles.themeButton, config.theme === 'light' && styles.themeButtonActive]}
            onPress={() => handleThemeChange('light')}
          >
            <Text style={[styles.themeButtonText, config.theme === 'light' && styles.themeButtonTextActive]}>Light</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.themeButton, config.theme === 'dark' && styles.themeButtonActive]}
            onPress={() => handleThemeChange('dark')}
          >
            <Text style={[styles.themeButtonText, config.theme === 'dark' && styles.themeButtonTextActive]}>Dark</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Clear History */}
      <View style={[styles.card, { backgroundColor: cardColor }]}>
        <TouchableOpacity style={[styles.clearButton, { backgroundColor: clearButtonColor }]} onPress={() => {}}>
          <Text style={[styles.clearButtonText, { color: clearButtonTextColor }]}>Clear All History</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    color: '#1976D2',
    fontWeight: 'bold',
    marginBottom: 18,
    alignSelf: 'center',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#1976D2',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    color: '#1976D2',
    fontWeight: '600',
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  sliderLabel: {
    fontSize: 13,
    color: '#1976D2',
    width: 24,
    textAlign: 'center',
  },
  themeRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  themeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
  },
  themeButtonActive: {
    backgroundColor: '#1976D2',
  },
  themeButtonText: {
    color: '#1976D2',
    fontWeight: 'bold',
    fontSize: 15,
  },
  themeButtonTextActive: {
    color: '#fff',
  },
  clearButton: {
    backgroundColor: '#D32F2F',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
}); 