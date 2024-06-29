import { fetchWeatherApi } from 'openmeteo';

const BASE_URL = "https://api.open-meteo.com/v1/dwd-icon";
const DEFAULT_PARAMS = {
    latitude: 48.1374,
    longitude: 11.5755,
    current: ["temperature_2m", "apparent_temperature", "is_day", "rain"],
    hourly: ["temperature_2m", "rain", "showers", "snowfall", "cloud_cover"],
    daily: ["temperature_2m_max", "temperature_2m_min", "sunrise", "sunset", "daylight_duration", "sunshine_duration"],
    timezone: "Europe/Berlin",
    forecast_days: 3
};

const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

class WeatherService {
    static async getWeather(params = DEFAULT_PARAMS) {
        try {
            const responses = await fetchWeatherApi(BASE_URL, params);
            const response = responses[0];

            // Attributes for timezone and location
            const utcOffsetSeconds = response.utcOffsetSeconds();
            const current = response.current()!;
            const hourly = response.hourly()!;
            const daily = response.daily()!;

            // Process weather data
            const weatherData = {
                current: {
                    time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
                    temperature2m: current.variables(0)!.value(),
                    apparentTemperature: current.variables(1)!.value(),
                    isDay: current.variables(2)!.value(),
                    rain: current.variables(3)!.value(),
                },
                hourly: {
                    time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                        (t) => new Date((t + utcOffsetSeconds) * 1000)
                    ),
                    temperature2m: hourly.variables(0)!.valuesArray()!,
                    rain: hourly.variables(1)!.valuesArray()!,
                    showers: hourly.variables(2)!.valuesArray()!,
                    snowfall: hourly.variables(3)!.valuesArray()!,
                    cloudCover: hourly.variables(4)!.valuesArray()!,
                },
                daily: {
                    time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                        (t) => new Date((t + utcOffsetSeconds) * 1000)
                    ),
                    temperature2mMax: daily.variables(0)!.valuesArray()!,
                    temperature2mMin: daily.variables(1)!.valuesArray()!,
                    sunrise: daily.variables(2)!.valuesArray()!,
                    sunset: daily.variables(3)!.valuesArray()!,
                    daylightDuration: daily.variables(4)!.valuesArray()!,
                    sunshineDuration: daily.variables(5)!.valuesArray()!,
                },
            };

            return weatherData;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            throw new Error('Failed to fetch weather data');
        }
    }
}

export default WeatherService;
