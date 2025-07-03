import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';
import { useData } from '../context/DataContext';

const HC05_NAME = 'HC-05'; // Change if your device advertises a different name

export function useBluetoothClassicWithConfig(config: { autoConnect: boolean }) {
  const [connected, setConnected] = useState(false);
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const { addRealTimeData } = useData();

  useEffect(() => {
    let isMounted = true;
    let subscription: any = null;
    let connectedDevice: BluetoothDevice | null = null;

    async function connectAndListen() {
      if (!config.autoConnect) return;
      try {
        // Request BLUETOOTH_CONNECT permission on Android 12+
        if (
          Platform.OS === 'android' &&
          Platform.Version >= 31
        ) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            {
              title: 'Bluetooth Permission',
              message: 'This app needs access to Bluetooth to connect to devices.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('BLUETOOTH_CONNECT permission denied');
            setConnected(false);
            setDevice(null);
            return;
          }
        }
        // Get paired devices
        const paired = await RNBluetoothClassic.getBondedDevices();
        const hc05 = paired.find((d: BluetoothDevice) => d.name === HC05_NAME);
        if (!hc05) {
          console.log('HC-05 not paired. Please pair in system settings.');
          return;
        }
        // Connect
        connectedDevice = await RNBluetoothClassic.connectToDevice(hc05.address);
        if (!isMounted) return;
        setDevice(connectedDevice);
        setConnected(true);
        console.log('Connected to device:', connectedDevice.name);
        // Listen for data
        subscription = connectedDevice.onDataReceived((event: { data: string }) => {
          // Assume data is a number as string, e.g., '42\n'
          const value = parseInt(event.data, 10);
          if (!isNaN(value)) {
            addRealTimeData(value);
          }
        });
      } catch (err) {
        console.log('Bluetooth connection error:', err);
        setConnected(false);
        setDevice(null);
      }
    }
    connectAndListen();
    return () => {
      isMounted = false;
      if (subscription) subscription.remove();
      if (connectedDevice) connectedDevice.disconnect();
    };
  }, [config.autoConnect]);

  useEffect(() => {
    console.log('Bluetooth connected:', connected);
    if (device) {
      console.log('Connected device:', device.name);
    }
  }, [connected, device]);

  return { connected, device };
}

export function useBluetoothClassic() {
  // Default to autoConnect true for backward compatibility
  return useBluetoothClassicWithConfig({ autoConnect: true });
} 