export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherMain {
  temp: number;
  humidity: number;
}

export interface WeatherResponse {
  weather: WeatherCondition[];
  main: WeatherMain;
  name: string;
}
