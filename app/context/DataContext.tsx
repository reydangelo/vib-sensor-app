import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type VibrationData = { timestamp: number; value: number };
export type Alert = { id: string; time: string; value: number; severity: 'low' | 'moderate' | 'high' };
export type Config = { threshold: number; autoConnect: boolean; theme: 'light' | 'dark' };

type DataContextType = {
  realTimeData: VibrationData[];
  addRealTimeData: (value: number) => void;
  history: VibrationData[];
  addHistory: (data: VibrationData) => void;
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  config: Config;
  setConfig: (c: Config) => void;
  clearHistory: () => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Session (in-memory) real-time data
  const [realTimeData, setRealTimeData] = useState<VibrationData[]>([]);
  // Persistent data
  const [history, setHistory] = useState<VibrationData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [config, setConfigState] = useState<Config>({ threshold: 80, autoConnect: true, theme: 'light' });

  // Load persistent data on mount
  useEffect(() => {
    (async () => {
      const h = await AsyncStorage.getItem('history');
      const a = await AsyncStorage.getItem('alerts');
      const c = await AsyncStorage.getItem('config');
      if (h) setHistory(JSON.parse(h));
      if (a) setAlerts(JSON.parse(a));
      if (c) setConfigState(JSON.parse(c));
    })();
  }, []);

  // Save persistent data on change
  useEffect(() => { AsyncStorage.setItem('history', JSON.stringify(history)); }, [history]);
  useEffect(() => { AsyncStorage.setItem('alerts', JSON.stringify(alerts)); }, [alerts]);
  useEffect(() => { AsyncStorage.setItem('config', JSON.stringify(config)); }, [config]);

  // API
  const addRealTimeData = (value: number) => {
    const data = { timestamp: Date.now(), value };
    setRealTimeData((prev) => [...prev, data]);
    setHistory((prev) => [...prev, data]);
    // Optionally, add alert logic here
  };

  const addHistory = (data: VibrationData) => setHistory((prev) => [...prev, data]);
  const addAlert = (alert: Alert) => setAlerts((prev) => [...prev, alert]);
  const clearHistory = () => setHistory([]);

  const setConfig = (c: Config) => setConfigState(c);

  return (
    <DataContext.Provider value={{
      realTimeData, addRealTimeData,
      history, addHistory,
      alerts, addAlert,
      config, setConfig,
      clearHistory,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}; 