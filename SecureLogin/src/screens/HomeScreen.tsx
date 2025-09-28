import React, { JSX } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Protected Home (Step-2: add Logout)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '600' },
});
