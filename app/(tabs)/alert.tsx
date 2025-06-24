import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from '../context/DataContext';

const severityColor = {
  low: '#1976D2',
  moderate: '#FFA000',
  high: '#D32F2F',
};

export default function AlertPage() {
  const { alerts, config } = useData();
  const isDark = config.theme === 'dark';
  const backgroundColor = isDark ? '#151718' : '#F7FAFF';
  const cardColor = isDark ? '#23262b' : '#fff';
  const textColor = isDark ? '#fff' : '#1976D2';
  const secondaryText = isDark ? '#9BA1A6' : '#1976D2';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Alerts & Notifications</Text>
      {alerts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: secondaryText }]}>No alerts yet. All clear!</Text>
        </View>
      ) : (
        <FlatList
          data={alerts}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: cardColor }]}>
              <View style={styles.rowBetween}>
                <View style={styles.rowLeft}>
                  <View style={[styles.dot, { backgroundColor: severityColor[item.severity] }]} />
                  <Text style={[styles.valueText, { color: textColor }]}>{item.value}</Text>
                  <Text style={[styles.severityText, { color: secondaryText }]}>{item.severity.charAt(0).toUpperCase() + item.severity.slice(1)}</Text>
                </View>
                <Text style={[styles.timeText, { color: secondaryText }]}>{item.time}</Text>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
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
    fontWeight: 'bold',
    marginBottom: 18,
    alignSelf: 'center',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
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
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  valueText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976D2',
    marginRight: 8,
  },
  severityText: {
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'capitalize',
    color: '#666',
  },
  timeText: {
    fontSize: 13,
    color: '#888',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: '#1976D2',
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.7,
  },
}); 