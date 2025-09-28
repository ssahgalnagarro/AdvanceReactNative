import Geolocation, {
  GeoPosition,
  GeoError,
} from 'react-native-geolocation-service';
import type { Coordinates } from '../types/location';

export type GetLocationOptions = {
  timeoutMs?: number;
  maximumAgeMs?: number;
  highAccuracy?: boolean;
};

export async function getCurrentCoordinates(
  options: GetLocationOptions = {},
): Promise<Coordinates> {
  const {
    timeoutMs = 15000,
    maximumAgeMs = 10000,
    highAccuracy = true,
  } = options;

  return new Promise<Coordinates>((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (pos: GeoPosition) => {
        const { latitude, longitude, accuracy } = pos.coords;
        resolve({ latitude, longitude, accuracy });
      },
      (error: GeoError) => {
        reject(new Error(`${error.code}: ${error.message}`));
      },
      {
        enableHighAccuracy: highAccuracy,
        timeout: timeoutMs,
        maximumAge: maximumAgeMs,
        forceRequestLocation: true,
        showLocationDialog: true,
      },
    );
  });
}
