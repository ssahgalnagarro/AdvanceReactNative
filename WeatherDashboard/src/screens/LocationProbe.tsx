import React, { useState, useCallback, JSX } from 'react';
import {
  Button,
  SafeAreaView,
  Text,
  View,
  Alert,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  ensureLocationPermission,
  openAppSettings,
} from '../services/permissions';
import { getCurrentCoordinates } from '../services/location';
import type { Coordinates } from '../types/location';

export default function LocationProbe(): JSX.Element {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [status, setStatus] = useState<
    'idle' | 'requesting' | 'locating' | 'error'
  >('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onReadLocation = useCallback(async () => {
    setStatus('requesting');
    setErrorMsg(null);
    const perm = await ensureLocationPermission();

    if (perm === 'blocked') {
      Alert.alert(
        'Permission blocked',
        'Open Settings to enable location permission?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: openAppSettings },
        ],
      );
      setStatus('error');
      return;
    }
    if (perm !== 'granted') {
      setErrorMsg('Location permission not granted.');
      setStatus('error');
      return;
    }

    try {
      setStatus('locating');
      const current = await getCurrentCoordinates();
      setCoords(current);
      setStatus('idle');
    } catch (err) {
      setErrorMsg((err as Error).message);
      setStatus('error');
    }
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.card}>
        <Text style={styles.title}>Location Probe</Text>
        {coords ? (
          <>
            <Text>Latitude: {coords.latitude.toFixed(6)}</Text>
            <Text>Longitude: {coords.longitude.toFixed(6)}</Text>
            {coords.accuracy != null && (
              <Text>Accuracy: {coords.accuracy} m</Text>
            )}
          </>
        ) : (
          <Text>No coordinates yet.</Text>
        )}
        {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
        <Button
          title={status === 'locating' ? 'Reading…' : 'Read My Location'}
          onPress={onReadLocation}
          disabled={status === 'locating' || status === 'requesting'}
        />
        <Text style={styles.hint}>Platform: {Platform.OS}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  title: { fontSize: 18, fontWeight: '600' },
  error: { color: '#B00020' },
});
