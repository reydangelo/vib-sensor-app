# Vib Sensor App

This app connects to an SW-420 vibration sensor via Bluetooth (HC-01 module or compatible BLE device) and displays real-time vibration data.  
Made with Expo, React Native, and love.

---

## Project Structure

```
vib-sensor-app/
  app/
    _layout.tsx
    (tabs)/
      _layout.tsx
      alert.tsx
      history.tsx
      index.tsx
      settings.tsx
    +not-found.tsx
    bluetooth/
      BLEManager.ts
    context/
      DataContext.tsx
  assets/
    fonts/
      SpaceMono-Regular.ttf
    images/
      adaptive-icon.png
      favicon.png
      icon.png
      partial-react-logo.png
      react-logo.png
      react-logo@2x.png
      react-logo@3x.png
      splash-icon.png
  components/
    AboutScreen.jsx
    Collapsible.tsx
    ExternalLink.tsx
    HapticTab.tsx
    HelloWave.tsx
    HistoryScreen.jsx
    HomeScreen.jsx
    LiveDataScreen.jsx
    ParallaxScrollView.tsx
    ThemedText.tsx
    ThemedView.tsx
    ui/
      IconSymbol.ios.tsx
      IconSymbol.tsx
      TabBarBackground.ios.tsx
      TabBarBackground.tsx
  constants/
    Colors.ts
  hooks/
    useColorScheme.ts
    useColorScheme.web.ts
    useThemeColor.ts
  navigation/
    AppNavigator.js
  scripts/
    reset-project.js
  ios/
    vibsensorapp/
      AppDelegate.swift
      Info.plist
      Images.xcassets/
      ...
```

---

## Features & Functionalities

- **Bluetooth Low Energy (BLE) Integration**
  - Scans for and connects to a BLE device (default: `HC-01`).
  - Reads vibration data from a specified service and characteristic UUID.
  - Real-time updates and notifications from the sensor.

- **Data Visualization**
  - Home screen displays current vibration, status (Low/Moderate/High), and a real-time graph.
  - Alerts when vibration exceeds a configurable threshold.

- **History & Export**
  - View historical vibration data with time filtering (1h, 6h, 1d, 1w).
  - Peak and average stats for today.
  - (UI for Export/Calibrate is present, but functionality may need to be implemented.)

- **Alerts**
  - Alerts tab shows a list of vibration events with severity and timestamps.

- **Settings**
  - Configure Bluetooth auto-connect, vibration threshold, and theme (light/dark).
  - (UI for clearing history is present, but functionality may need to be implemented.)

- **Theming**
  - Light and dark mode support.

---

## BLE Device Requirements

- The app is designed to connect to a BLE device (e.g., HC-01, HM-10, ESP32) advertising with:
  - **Device Name:** `HC-01` (changeable in `app/bluetooth/BLEManager.ts`)
  - **Service UUID:** `12345678-1234-1234-1234-123456789012` (replace with your device's actual UUID)
  - **Characteristic UUID:** `12345678-1234-1234-1234-123456789012` (replace with your device's actual UUID)

> **How to find your UUIDs:**  
> Use a BLE scanner app (like nRF Connect) to scan your device and copy the Service and Characteristic UUIDs.

---

## Setup & Installation

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- A physical iOS or Android device (BLE does not work in Expo Go; use a development build or standalone app)
- A BLE peripheral device (e.g., HC-01, HM-10, ESP32) advertising the correct name and UUIDs

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd vib-sensor-app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure BLE Device Name and UUIDs

Edit `app/bluetooth/BLEManager.ts` and set:
```ts
const HC01_NAME = 'YourDeviceName';
const SERVICE_UUID = 'your-service-uuid';
const CHARACTERISTIC_UUID = 'your-characteristic-uuid';
```

### 4. Run on Your Device

**Development Build (Recommended for BLE):**
```bash
npx expo run:ios   # for iOS
npx expo run:android   # for Android
```
> BLE will NOT work in Expo Go. You must use a development build or standalone app.

**Start the Metro Bundler:**
```bash
npx expo start
```

**Open the app on your device** using the QR code or via the Expo Go/dev client.

---

## Usage

1. Power on your BLE device and ensure it is advertising.
2. Open the app on your phone.
3. The app will scan for the device and connect automatically (if auto-connect is enabled).
4. View real-time vibration data, history, and alerts.
5. Adjust settings as needed.

---

## Troubleshooting

- **No device found?**
  - Make sure your BLE device is powered and advertising.
  - Double-check the device name and UUIDs in `BLEManager.ts`.
  - Use a BLE scanner app to verify your device is visible and get the correct UUIDs.

- **BLE not working in Expo Go?**
  - You must use a development build or standalone app for BLE features.

- **Permissions**
  - Make sure Bluetooth permissions are enabled on your phone.
  - On Android, location permissions may also be required for BLE scanning.

---

## Main Dependencies

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [react-native-ble-plx](https://github.com/dotintent/react-native-ble-plx) (for BLE)
- [@react-navigation](https://reactnavigation.org/) (for navigation)
- [@react-native-community/slider](https://github.com/callstack/react-native-slider)
- [react-native-svg](https://github.com/software-mansion/react-native-svg) (for graphs)

---

## License

MIT
