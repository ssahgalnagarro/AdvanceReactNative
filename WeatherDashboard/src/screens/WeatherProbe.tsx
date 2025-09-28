import React, { useState, useCallback, JSX } from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet } from 'react-native';
import { ensureLocationPermission } from '../services/permissions';
import { getCurrentCoordinates } from '../services/location';
import { fetchWeather } from '../api/weather';
import type { WeatherResponse } from '../types/weather';

const API_KEY = '7793c81d5caec3cbb253fabef4f67d1b';

export default function WeatherProbe(): JSX.Element {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onLoadWeather = useCallback(async () => {
    setStatus('loading');
    setErrorMsg(null);
    try {
      const perm = await ensureLocationPermission();
      if (perm !== 'granted') {
        setErrorMsg('Location permission not granted.');
        setStatus('error');
        return;
      }
      const coords = await getCurrentCoordinates();
      const data = await fetchWeather(
        coords.latitude,
        coords.longitude,
        API_KEY,
      );
      setWeather(data);
      setStatus('idle');
    } catch (err) {
      setErrorMsg((err as Error).message);
      setStatus('error');
    }
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.card}>
        <Text style={styles.title}>Weather Probe</Text>
        {status === 'loading' && <Text>Loading…</Text>}
        {weather && (
          <>
            <Text>{weather.name}</Text>
            <Text>Temp: {weather.main.temp} °C</Text>
            <Text>Condition: {weather.weather[0].description}</Text>
            <Text>Humidity: {weather.main.humidity}%</Text>
          </>
        )}
        {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
        <Button title="Load Weather" onPress={onLoadWeather} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    gap: 8,
  },
  title: { fontSize: 18, fontWeight: '600' },
  error: { color: '#B00020' },
});
