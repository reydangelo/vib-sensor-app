import React from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Polyline, Rect, Text as SvgText } from 'react-native-svg';
import { useBLEWithConfig } from '../bluetooth/BLEManager';
import { useData } from '../context/DataContext';

const windowHeight = Dimensions.get('window').height;

const BAR_WIDTH = 260;
const MARKER_SIZE = 22;
const GRAPH_WIDTH = Dimensions.get('window').width - 64;
const GRAPH_HEIGHT = 160;
const GRAPH_PADDING = 20;
const Y_AXIS_STEPS = 5;

export default function Home() {
  const { realTimeData, config } = useData();
  const { connected } = useBLEWithConfig(config);
  const isDark = config.theme === 'dark';
  const backgroundColor = isDark ? '#151718' : '#F7FAFF';
  const cardColor = isDark ? '#23262b' : '#fff';
  const textColor = isDark ? '#fff' : '#1976D2';
  const secondaryText = isDark ? '#9BA1A6' : '#1976D2';
  const alertCardColor = isDark ? '#3a2323' : '#FFD6D6';
  const alertTextColor = isDark ? '#ffb4b4' : '#D32F2F';

  // Only use actual data
  const displayData = realTimeData;

  // Use the latest value for current vibration
  const currentVibration = displayData.length > 0 ? displayData[displayData.length - 1].value : 0;
  const vibrationStatus = currentVibration < 30 ? 'Low' : currentVibration < 70 ? 'Moderate' : 'High';
  const vibrationColor = currentVibration < 30 ? '#1976D2' : currentVibration < 70 ? '#FFA000' : '#D32F2F';
  const threshold = config.threshold;
  const exceeded = currentVibration > threshold;

  // Segmented bar
  const safeVibration = Math.max(0, Math.min(100, currentVibration));
  const markerLeft = (safeVibration / 100) * (BAR_WIDTH - MARKER_SIZE);

  // Real-time data for the graph
  const graphData = displayData.slice(-14); // Show last 14 points
  const maxGraphValue = graphData.length > 0 ? Math.max(...graphData.map(d => d.value), 100) : 100;
  const minGraphValue = graphData.length > 0 ? Math.min(...graphData.map(d => d.value), 0) : 0;

  const getGraphPoints = (data: { value: number }[]) => {
    if (data.length === 0) return '';
    return data
      .map((d: { value: number }, i: number) => {
        const x = (i / (data.length - 1)) * (GRAPH_WIDTH - 2 * GRAPH_PADDING) + GRAPH_PADDING;
        const y =
          GRAPH_HEIGHT -
          ((d.value - minGraphValue) / (maxGraphValue - minGraphValue || 1)) * (GRAPH_HEIGHT - 2 * GRAPH_PADDING) -
          GRAPH_PADDING;
        return `${x},${y}`;
      })
      .join(' ');
  };

  const graphContainerBg = isDark ? '#181A1B' : '#F8FAFF';

  return (
    <SafeAreaView style={[styles.root, { backgroundColor }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: textColor }]}>Vibration Sensor</Text>

        {/* Bluetooth Status */}
        <View style={styles.bluetoothStatus}>
          <View
            style={[
              styles.bluetoothIndicator,
              { backgroundColor: connected ? '#4CAF50' : '#FF5252' },
            ]}
          />
          <Text style={[styles.bluetoothText, { color: secondaryText }]}>
            {connected ? 'Connected' : 'Not Connected'}
          </Text>
        </View>

        {/* Current Vibration Card */}
        <View style={[styles.card, { backgroundColor: cardColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Current Vibration</Text>
          <View style={styles.centerColumn}>
            <Text style={[styles.currentValue, { color: vibrationColor }]}>{currentVibration}</Text>
            <View style={[styles.statusBadge, { backgroundColor: vibrationColor + '22', marginTop: 6 }]}>
              <Text style={[styles.statusText, { color: vibrationColor }]}>{vibrationStatus}</Text>
            </View>
          </View>
          {/* Segmented Status Bar */}
          <View style={styles.segmentedBarContainer}>
            <View style={styles.segmentedBar}>
              <View style={[styles.segment, styles.leftSegment]} />
              <View style={[styles.segment, styles.middleSegment]} />
              <View style={[styles.segment, styles.rightSegment]} />
              <View
                style={[
                  styles.marker,
                  {
                    left: markerLeft,
                    borderColor: vibrationColor,
                    shadowColor: vibrationColor,
                  },
                ]}
              />
            </View>
            <View style={styles.segmentLabels}>
              <Text style={[styles.segmentLabel, { color: '#1976D2' }]}>Low</Text>
              <Text style={[styles.segmentLabel, { color: '#FFA000' }]}>Moderate</Text>
              <Text style={[styles.segmentLabel, { color: '#D32F2F' }]}>High</Text>
            </View>
          </View>
        </View>

        {/* Threshold Alert */}
        {exceeded && (
          <View style={[styles.alertCard, { backgroundColor: alertCardColor, borderColor: alertTextColor }]}>
            <Text style={[styles.alertText, { color: alertTextColor }]}>⚠️ Threshold Exceeded!</Text>
          </View>
        )}

        {/* Real-Time Data as a Graph */}
        <View style={[styles.card, { backgroundColor: cardColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Real-Time Data</Text>
          <View style={[styles.graphContainer, { backgroundColor: graphContainerBg }]}>
            <Svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT}>
              {/* Background */}
              <Rect
                x={0}
                y={0}
                width={GRAPH_WIDTH}
                height={GRAPH_HEIGHT}
                fill={isDark ? '#181A1B' : '#F8FAFF'}
                rx={12}
              />
              {/* Grid Lines & Y-axis labels */}
              {Array.from({ length: Y_AXIS_STEPS }).map((_, i) => {
                const y = (GRAPH_HEIGHT - 2 * GRAPH_PADDING) * (i / (Y_AXIS_STEPS - 1)) + GRAPH_PADDING;
                const value = Math.round(maxGraphValue - ((maxGraphValue - minGraphValue) * i) / (Y_AXIS_STEPS - 1));
                return (
                  <React.Fragment key={i}>
                    <Line
                      x1={GRAPH_PADDING + 24}
                      y1={y}
                      x2={GRAPH_WIDTH - GRAPH_PADDING}
                      y2={y}
                      stroke={isDark ? '#35383B' : '#E3F2FD'}
                      strokeWidth="1"
                    />
                    <SvgText
                      x={GRAPH_PADDING + 18}
                      y={y + 4}
                      fontSize="11"
                      fill={isDark ? '#9BA1A6' : '#666'}
                      textAnchor="end"
                    >
                      {value}
                    </SvgText>
                  </React.Fragment>
                );
              })}
              {/* Data line */}
              <Polyline
                points={getGraphPoints(graphData)}
                fill="none"
                stroke="#1976D2"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* Data points */}
              {graphData.map((d, index) => {
                const x = (index / (graphData.length - 1)) * (GRAPH_WIDTH - 2 * GRAPH_PADDING) + GRAPH_PADDING;
                const y =
                  GRAPH_HEIGHT -
                  ((d.value - minGraphValue) / (maxGraphValue - minGraphValue || 1)) * (GRAPH_HEIGHT - 2 * GRAPH_PADDING) -
                  GRAPH_PADDING;
                return (
                  <Circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="3"
                    fill={isDark ? '#181A1B' : '#fff'}
                    stroke="#1976D2"
                    strokeWidth="2"
                  />
                );
              })}
            </Svg>
            <View style={styles.timeLabels}>
              <Text style={[styles.timeLabel, { color: secondaryText }]}>Past</Text>
              <Text style={[styles.timeLabel, { color: secondaryText }]}>Now</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: windowHeight,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 0,
    alignItems: 'stretch',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    alignSelf: 'center',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#1976D2',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 12,
  },
  statsCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#1976D2',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  statsLabel: {
    color: '#1976D2',
    fontSize: 15,
    marginBottom: 6,
    fontWeight: '500',
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  centerColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  currentValue: {
    fontSize: 44,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    alignSelf: 'center',
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  segmentedBarContainer: {
    width: BAR_WIDTH,
    alignSelf: 'center',
    marginTop: 14,
    marginBottom: 8,
  },
  segmentedBar: {
    flexDirection: 'row',
    width: BAR_WIDTH,
    height: 18,
    borderRadius: 9,
    overflow: 'visible',
    backgroundColor: 'transparent',
    position: 'relative',
    alignItems: 'center',
    marginBottom: 2,
  },
  segment: {
    flex: 1,
    height: '100%',
  },
  leftSegment: {
    backgroundColor: '#1976D2',
    borderTopLeftRadius: 9,
    borderBottomLeftRadius: 9,
  },
  middleSegment: {
    backgroundColor: '#FFA000',
  },
  rightSegment: {
    backgroundColor: '#D32F2F',
    borderTopRightRadius: 9,
    borderBottomRightRadius: 9,
  },
  marker: {
    position: 'absolute',
    top: -((MARKER_SIZE - 18) / 2),
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderRadius: MARKER_SIZE / 2,
    borderWidth: 3,
    backgroundColor: '#fff',
    zIndex: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
  },
  segmentLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    width: BAR_WIDTH,
    alignSelf: 'center',
  },
  segmentLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    opacity: 0.85,
    width: 60,
    textAlign: 'center',
  },
  graphContainer: {
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
  },
  alertCard: {
    backgroundColor: '#FFD6D6',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D32F2F',
  },
  alertText: {
    color: '#D32F2F',
    fontWeight: 'bold',
    fontSize: 16,
  },
  realtimeValue: {
    fontSize: 32,
    color: '#1976D2',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyTabs: {
    flexDirection: 'row',
    gap: 4,
  },
  historyTab: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
    marginLeft: 4,
  },
  historyTabActive: {
    backgroundColor: '#1976D2',
  },
  historyTabText: {
    color: '#1976D2',
    fontWeight: 'bold',
    fontSize: 14,
  },
  historyTabTextActive: {
    color: '#fff',
  },
  historyList: {
    width: '100%',
    marginTop: 6,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  historyTime: {
    color: '#1976D2',
    fontSize: 15,
  },
  historyValue: {
    color: '#1976D2',
    fontWeight: 'bold',
    fontSize: 15,
  },
  stickyActions: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: Platform.OS === 'ios' ? 24 : 12,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#E3F2FD',
    zIndex: 10,
    gap: 16,
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
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 32,
    marginTop: 4,
  },
  timeLabel: {
    fontSize: 12,
    color: '#666',
  },
  bluetoothStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#1976D2',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  bluetoothIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  bluetoothText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1976D2',
  },
});