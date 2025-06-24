import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useData } from '../context/DataContext';

const HC01_NAME = 'HC-01'; // Change if your device advertises a different name
const SERVICE_UUID = '12345678-1234-1234-1234-123456789012'; // Replace with your service UUID
const CHARACTERISTIC_UUID = '12345678-1234-1234-1234-123456789012'; // Replace with your characteristic UUID

// Only import BleManager if not in Expo Go/web
const BleManager = (Platform.OS !== 'web' && !global.EXPO_GO)
  ? require('react-native-ble-plx').BleManager
  : null;

export function useBLE() {
  const [connected, setConnected] = useState(false);
  const [device, setDevice] = useState<Device | null>(null);
  const { addRealTimeData } = useData();

  useEffect(() => {
    // If BLE is not available, do nothing
    if (!BleManager) return;
    const manager = new BleManager();
    // Scan and connect
    const scanAndConnect = () => {
      manager.startDeviceScan(null, null, (error, scannedDevice) => {
        if (error) return;
        if (scannedDevice?.name === HC01_NAME) {
          manager.stopDeviceScan();
          scannedDevice.connect()
            .then((d) => d.discoverAllServicesAndCharacteristics())
            .then((d) => {
              setDevice(d);
              setConnected(true);
              // Subscribe to notifications (replace with your service/char UUIDs)
              d.monitorCharacteristicForService(
                SERVICE_UUID,
                CHARACTERISTIC_UUID,
                (error, characteristic) => {
                  if (characteristic?.value) {
                    // Parse value (assume base64, parse to int)
                    const value = parseInt(atob(characteristic.value), 10);
                    addRealTimeData(value);
                  }
                }
              );
            });
        }
      });
    };
    scanAndConnect();
    return () => manager.destroy();
  }, []);

  return { connected, device };
} 