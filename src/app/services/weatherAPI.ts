import axios from 'axios';

const API_KEY = 'e49d6f3eef724890ba1124136240907';
const BASE_URL = 'http://api.weatherapi.com/v1';

interface WeatherResponse {
    location: {
        name: string;
        region: string;
        country: string;
        lat: number;
        lon: number;
        tz_id: string;
        localtime_epoch: number;
        localtime: string;
    };
    current: {
        last_updated_epoch: number;
        last_updated: string;
        temp_c: number;
        temp_f: number;
        is_day: number;
        condition: {
            text: string;
            icon: string;
            code: number;
        };
        wind_mph: number;
        wind_kph: number;
        wind_degree: number;
        wind_dir: string;
        pressure_mb: number;
        pressure_in: number;
        precip_mm: number;
        precip_in: number;
        humidity: number;
        cloud: number;
        feelslike_c: number;
        feelslike_f: number;
        vis_km: number;
        vis_miles: number;
        uv: number;
        gust_mph: number;
        gust_kph: number;
    };
}

export async function getWeather(latitude: number, longitude: number): Promise<WeatherResponse> {
    try {
        const response = await axios.get(`${BASE_URL}/current.json`, {
            params: {
                key: API_KEY,
                q: `${latitude},${longitude}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Error fetching weather data');
    }
}
