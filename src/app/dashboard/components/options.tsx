"use client";
import React, { useState, useEffect } from "react";
import RandomQuote from "./RandomQuote";
import { getWeather } from "../../services/weatherAPI";
import { geolocationService } from "../../services/locationAPI";

const Options: React.FC = () => {
  const [weatherInfo, setWeatherInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const position = await geolocationService.getCurrentPosition();
        const { latitude, longitude } = position.coords;
        const weatherData = await getWeather(latitude, longitude);
        setWeatherInfo(weatherData);
      } catch (err) {
        setError("Failed to fetch weather data");
        console.error("Error fetching weather:", err);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="px-4 pt-14">
      <div className="text-3xl font-medium">🛋️ Your Dashboard</div>
      <div className="text-xl text-gray-500 pt-2 pb-2">
        Here you can start chatting or explore more options.
      </div>
      {weatherInfo ? (
        <div className="pt-4 pb-4">
          <div className="text-2xl font-medium">🌤️ Current Weather</div>
          <div className="text-lg text-gray-600">
            {weatherInfo.location.name}, {weatherInfo.location.country}:{" "}
            {weatherInfo.current.temp_c}°C, {weatherInfo.current.condition.text}
          </div>
        </div>
      ) : error ? (
        <div className="pt-4 pb-4 text-red-500">{error}</div>
      ) : (
        <div className="pt-4 pb-4 text-gray-500">Loading weather data...</div>
      )}
      <RandomQuote />
    </div>
  );
};

export default Options;
