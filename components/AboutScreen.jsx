import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About</Text>
      <Text style={styles.info}>
        This app connects to an SW-420 vibration sensor via Bluetooth (HC-05
        module, classic Bluetooth) and displays real-time vibration data.
      </Text>
      <Text style={styles.info}>Made with Expo, React Native, and love.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    color: "#1976D2",
    marginBottom: 20,
    fontWeight: "bold",
  },
  info: {
    fontSize: 16,
    color: "#1976D2",
    marginBottom: 10,
    textAlign: "center",
  },
});
