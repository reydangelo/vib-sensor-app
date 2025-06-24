import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useMemo } from 'react';
import { useData } from '../context/DataContext';

const lightTabBar = {
  backgroundColor: '#fff',
  height: 70,
  paddingBottom: 24,
  paddingTop: 8,
};
const darkTabBar = {
  backgroundColor: '#151718',
  height: 70,
  paddingBottom: 24,
  paddingTop: 8,
};

export default function TabLayout() {
  const { config } = useData();
  const isDark = config.theme === 'dark';
  const tabBarStyle = useMemo(() => (isDark ? darkTabBar : lightTabBar), [isDark]);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDark ? '#fff' : '#1976D2',
        tabBarInactiveTintColor: isDark ? '#9BA1A6' : '#888',
        tabBarStyle,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="alert"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 