import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>🛑 StopList</Text>
      <Text style={styles.subtitle}>Minimal Build Test v1.0.0</Text>
      <Text style={styles.text}>
        If you see this, the build worked!{'\n\n'}
        Full features will be added after successful build.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ff3b30',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#888',
    marginBottom: 30,
  },
  text: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
  },
});
