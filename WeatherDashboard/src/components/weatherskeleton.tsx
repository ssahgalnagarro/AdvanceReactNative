import React, { JSX } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { View } from 'react-native';

export default function WeatherSkeleton(): JSX.Element {
  return (
    <SkeletonPlaceholder borderRadius={8}>
      <View style={{ marginVertical: 12, alignItems: 'center' }}>
        {/* City Name Placeholder */}
        <View style={{ width: 120, height: 20, marginBottom: 12 }} />

        {/* Temperature Placeholder */}
        <View style={{ width: 80, height: 30, marginBottom: 12 }} />

        {/* Condition Placeholder */}
        <View style={{ width: 150, height: 20, marginBottom: 12 }} />

        {/* Humidity Placeholder */}
        <View style={{ width: 100, height: 20 }} />
      </View>
    </SkeletonPlaceholder>
  );
}
