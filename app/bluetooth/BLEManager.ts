import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import type { Device as BleDevice, BleError, Characteristic } from 'react-native-ble-plx';
import { useData } from '../context/DataContext';

const HC01_NAME = 'HC-01'; // Change if your device advertises a different name
const SERVICE_UUID = '12345678-1234-1234-1234-123456789012'; // Replace with your service UUID
const CHARACTERISTIC_UUID = '12345678-1234-1234-1234-123456789012'; // Replace with your characteristic UUID

// Only import BleManager if not in Expo Go/web
const BleManager = (Platform.OS !== 'web' && !(global as any).EXPO_GO)
  ? require('react-native-ble-plx').BleManager
  : null;

export function useBLEWithConfig(config: { autoConnect: boolean }) {
  const [connected, setConnected] = useState(false);
  const [device, setDevice] = useState<BleDevice | null>(null);
  const { addRealTimeData } = useData();

  useEffect(() => {
    if (!BleManager) return;
    if (!config.autoConnect) return;
    const manager = new BleManager();
    // Scan and connect
    const scanAndConnect = () => {
      manager.startDeviceScan(null, null, (error: BleError | null, scannedDevice: BleDevice | null) => {
        if (error) {
          console.log('BLE Scan error:', error);
          return;
        }
        if (scannedDevice?.name === HC01_NAME) {
          manager.stopDeviceScan();
          scannedDevice.connect()
            .then((d: BleDevice) => d.discoverAllServicesAndCharacteristics())
            .then((d: BleDevice) => {
              setDevice(d);
              setConnected(true);
              console.log('Connected to device:', d.name);
              // Subscribe to notifications (replace with your service/char UUIDs)
              d.monitorCharacteristicForService(
                SERVICE_UUID,
                CHARACTERISTIC_UUID,
                (error: BleError | null, characteristic: Characteristic | null) => {
                  if (error) {
                    console.log('Monitor error:', error);
                    return;
                  }
                  if (characteristic?.value) {
                    // Parse value (assume base64, parse to int)
                    const value = parseInt(atob(characteristic.value), 10);
                    addRealTimeData(value);
                  }
                }
              );
            })
            .catch((err: any) => {
              console.log('Connection error:', err);
            });
        }
      });
    };
    scanAndConnect();
    return () => manager.destroy();
  }, [config.autoConnect]);

  // For testing: log connection state changes
  useEffect(() => {
    console.log('Bluetooth connected:', connected);
    if (device) {
      console.log('Connected device:', device.name);
    }
  }, [connected, device]);

  return { connected, device };
}

export function useBLE() {
  // Default to autoConnect true for backward compatibility
  return useBLEWithConfig({ autoConnect: true });
} 