import React, { useEffect, useState } from 'react';

interface WeatherProps {
  latitude: number;
  longitude: number;
}

interface WeatherData {
  location: {
    name: string;
    city: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
    };
  };
}

const Weather: React.FC<WeatherProps> = ({ latitude, longitude }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      setWeather(data.weather);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch weather', error);
      setError('Failed to fetch weather');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [latitude, longitude]);

  if (loading) {
    return <p>Loading weather...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!weather) {
    return <p>Failed to load weather.</p>;
  }

  return (
    <div className="bg-gray-100 p-4 rounded-lg mt-4">
      <p className="text-sm text-gray-500 mb-2">🌤️ Current Weather</p>
      <blockquote className="text-base italic text-gray-700">
        {weather.location.name}, {weather.location.city}: {weather.current.temp_c}°C, {weather.current.condition.text}
      </blockquote>
    </div>
  );
};

export async function getWeather(latitude: number, longitude: number) {
    try {
      const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      return data.weather;
    } catch (error) {
      throw new Error('Failed to fetch weather');
    }
  }
  

export default Weather;
