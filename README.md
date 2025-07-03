# Vib Sensor App

This app connects to an SW-420 vibration sensor via Bluetooth (HC-05 module, classic Bluetooth) and displays real-time vibration data.  
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
      BluetoothClassicManager.ts
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

- **Classic Bluetooth (HC-05) Integration**

  - Connects to a paired HC-05 device (classic Bluetooth, not BLE).
  - Reads vibration data sent as plain text from the Arduino.
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

## Bluetooth Device Requirements

- The app is designed to connect to a classic Bluetooth device (e.g., HC-05) that is already paired with your phone.
  - **Device Name:** `HC-05` (changeable in `app/bluetooth/BluetoothClassicManager.ts`)

---

## Setup & Installation

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- A physical Android device (iOS support for classic Bluetooth is limited)
- An HC-05 module paired with your phone

### 1. Clone the Repository

```bash
git clone https://github.com/reydangelo/vib-sensor-app.git
cd vib-sensor-app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Pair Your HC-05 Device

- Go to your phone's Bluetooth settings and pair with the HC-05 module.
- Make sure the device is powered and visible.

### 4. Run on Your Device

**Development Build (Required for Bluetooth):**

```bash
npx expo run:android   # for Android
```

> Classic Bluetooth will NOT work in Expo Go. You must use a development build or standalone app.

**Start the Metro Bundler:**

```bash
npx expo start
```

**Open the app on your device** using the QR code or via the Expo dev client.

---

## Usage

1. Power on your HC-05 device and ensure it is paired with your phone.
2. Open the app on your phone.
3. The app will connect automatically (if auto-connect is enabled).
4. View real-time vibration data, history, and alerts.
5. Adjust settings as needed.

---

## Troubleshooting

- **No device found?**

  - Make sure your HC-05 is powered and paired in system Bluetooth settings.
  - Double-check the device name in `BluetoothClassicManager.ts`.

- **Bluetooth not working in Expo Go?**

  - You must use a development build or standalone app for Bluetooth features.

- **Permissions**
  - Make sure Bluetooth permissions are enabled on your phone.
  - On Android, location permissions may also be required for Bluetooth scanning.

---

## Main Dependencies

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [react-native-bluetooth-classic](https://github.com/kenjdavidson/react-native-bluetooth-classic) (for classic Bluetooth)
- [@react-navigation](https://reactnavigation.org/) (for navigation)
- [@react-native-community/slider](https://github.com/callstack/react-native-slider)
- [react-native-svg](https://github.com/software-mansion/react-native-svg) (for graphs)

---

## License

MIT
