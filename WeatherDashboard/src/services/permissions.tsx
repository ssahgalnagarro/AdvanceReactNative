import { Platform } from 'react-native';
import {
  PERMISSIONS,
  RESULTS,
  request,
  check,
  openSettings,
} from 'react-native-permissions';

export type PermissionResult =
  | 'granted'
  | 'denied'
  | 'blocked'
  | 'limited'
  | 'unavailable';

function map(result: string): PermissionResult {
  switch (result) {
    case RESULTS.GRANTED:
      return 'granted';
    case RESULTS.DENIED:
      return 'denied';
    case RESULTS.BLOCKED:
      return 'blocked';
    case RESULTS.LIMITED:
      return 'limited';
    case RESULTS.UNAVAILABLE:
      return 'unavailable';
    default:
      return 'unavailable';
  }
}

const platformPermission = Platform.select({
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  default: undefined,
});

export async function ensureLocationPermission(): Promise<PermissionResult> {
  if (!platformPermission) return 'unavailable';

  const current = await check(platformPermission);
  if (current === RESULTS.GRANTED) return 'granted';
  if (current === RESULTS.BLOCKED) return 'blocked';

  const next = await request(platformPermission);
  return map(next);
}

export async function openAppSettings(): Promise<void> {
  await openSettings();
}
