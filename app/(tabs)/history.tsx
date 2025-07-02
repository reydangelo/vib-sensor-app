import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from '../context/DataContext';

function historyToCSV(history) {
  const header = 'Timestamp,Value\n';
  const rows = history.map(h => `${new Date(h.timestamp).toISOString()},${h.value}`).join('\n');
  return header + rows;
}

export default function History() {
  const [historyRange, setHistoryRange] = useState("1d");
  const { history, config } = useData();
  const isDark = config.theme === 'dark';
  const backgroundColor = isDark ? '#151718' : '#F7FAFF';
  const cardColor = isDark ? '#23262b' : '#fff';
  const textColor = isDark ? '#fff' : '#1976D2';
  const secondaryText = isDark ? '#9BA1A6' : '#1976D2';

  // Calculate peak and avg from actual history data
  const today = new Date();
  const todayHistory = history.filter(h => {
    const d = new Date(h.timestamp);
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  });
  const peakToday = todayHistory.length > 0 ? Math.max(...todayHistory.map(h => h.value)) : 0;
  const avgToday = todayHistory.length > 0 ? Math.round(todayHistory.reduce((sum, h) => sum + h.value, 0) / todayHistory.length) : 0;

  const handleExport = async () => {
    if (!history.length) {
      Alert.alert('No data', 'There is no history data to export.');
      return;
    }
    try {
      const csv = historyToCSV(history);
      const fileUri = FileSystem.cacheDirectory + 'vibration_history.csv';
      await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: FileSystem.EncodingType.UTF8 });
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Export Vibration History',
        UTI: 'public.comma-separated-values-text',
      });
    } catch (e) {
      Alert.alert('Export failed', 'Could not export data.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Stats Card */}
        <View style={styles.statsCardRow}>
          <View style={[styles.statsCard, { backgroundColor: cardColor }]}> 
            <Text style={[styles.statsLabel, { color: secondaryText }]}>Peak Today</Text>
            <Text style={[styles.statsValue, { color: textColor }]}>{peakToday}</Text>
          </View>
          <View style={[styles.statsCard, { backgroundColor: cardColor }]}> 
            <Text style={[styles.statsLabel, { color: secondaryText }]}>Avg Today</Text>
            <Text style={[styles.statsValue, { color: textColor }]}>{avgToday}</Text>
          </View>
        </View>

        {/* History Overview */}
        <View style={[styles.card, { backgroundColor: cardColor }]}> 
          <View style={styles.header}>
            <Text style={[styles.title, { color: textColor }]}>Vibration History</Text>
            <View style={[styles.tabs, { backgroundColor: isDark ? '#23262b' : '#E3F2FD' }]}> 
              {["1h", "6h", "1d", "1w"].map((range) => (
                <TouchableOpacity
                  key={range}
                  onPress={() => setHistoryRange(range)}
                  style={[styles.tab, historyRange === range && { backgroundColor: isDark ? '#1976D2' : '#1976D2' }]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      historyRange === range && { color: '#fff' },
                      { color: historyRange === range ? '#fff' : secondaryText },
                    ]}
                  >
                    {range}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.historyList}>
            {history.length === 0 ? (
              <Text style={{ color: isDark ? '#9BA1A6' : '#888', textAlign: 'center', marginVertical: 16 }}>No history data available.</Text>
            ) : (
              history.map((item, idx) => (
                <View key={idx} style={styles.historyItem}>
                  <Text style={[styles.historyTime, { color: secondaryText }]}>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                  <View style={styles.valueContainer}>
                    <Text style={[styles.historyValue, { color: textColor }]}>{item.value}</Text>
                    <View
                      style={[
                        styles.valueDot,
                        {
                          backgroundColor:
                            item.value < 30
                              ? "#1976D2"
                              : item.value < 70
                              ? "#FFA000"
                              : "#D32F2F",
                        },
                      ]}
                    />
                  </View>
                </View>
              ))
            )}
          </View>
        </View>

        {/* Action Buttons Row at the bottom */}
        <View style={[styles.actionsRow, { backgroundColor: cardColor, borderColor: isDark ? '#23262b' : '#E3F2FD' }]}> 
          <TouchableOpacity style={[styles.actionButton, isDark ? { backgroundColor: '#1976D2' } : { backgroundColor: '#E3F2FD', borderWidth: 1, borderColor: '#1976D2' }]} onPress={handleExport}>
            <Text style={[styles.actionButtonText, { color: isDark ? '#fff' : '#1976D2' }]}>Export Data</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, isDark ? { backgroundColor: '#1976D2' } : { backgroundColor: '#E3F2FD', borderWidth: 1, borderColor: '#1976D2' }]} onPress={() => {}}>
            <Text style={[styles.actionButtonText, { color: isDark ? '#fff' : '#1976D2' }]}>Calibrate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFF",
    padding: 16,
  },
  statsCardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 12,
  },
  statsCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    shadowColor: "#1976D2",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  statsLabel: {
    color: "#1976D2",
    fontSize: 15,
    marginBottom: 6,
    fontWeight: "500",
  },
  statsValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1976D2",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#1976D2",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    color: "#1976D2",
    fontWeight: "bold",
    marginBottom: 10,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: "#1976D2",
  },
  tabText: {
    color: "#1976D2",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  tabTextActive: {
    color: "#fff",
  },
  historyList: {
    marginTop: 8,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E3F2FD",
  },
  historyTime: {
    color: "#666",
    fontSize: 15,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  historyValue: {
    color: "#1976D2",
    fontWeight: "bold",
    fontSize: 16,
  },
  valueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    marginTop: 24,
    marginBottom: 18,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    marginHorizontal: 6,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#1976D2',
    shadowOpacity: 0.10,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
 