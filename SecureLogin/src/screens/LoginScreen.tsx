import React, { JSX } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LoginScreen(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login (Step-2: form + API)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '600' },
});
