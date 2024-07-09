"use client";
import React, { useState, useEffect } from "react";
import RandomQuote from "./RandomQuote";
import { getWeather } from "../../services/weatherAPI";
import { geolocationService } from "../../services/locationAPI";
import { chatService } from "../../services/llamaService"; 


const Options: React.FC = () => {
  const [weatherInfo, setWeatherInfo] = useState<any>(null);
  const [activityRecommendation, setActivityRecommendation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const position = await geolocationService.getCurrentPosition();
        const { latitude, longitude } = position.coords;
        const weatherData = await getWeather(latitude, longitude);
        setWeatherInfo(weatherData);

        await chatService.setLocationInfo(); // Set location in chatService
        await chatService.setWeatherInfo(); // Set weather in chatService

        const recommendation = await chatService.getActivityRecommendation();
        setActivityRecommendation(recommendation);
      } catch (err) {
        setError("Failed to fetch weather data or activity recommendation");
        console.error("Error fetching weather or recommendation:", err);
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
        <div className="bg-gray-100 p-4 rounded-lg mt-4">
          <div className="text-sm text-gray-500 mb-2">🌤️ Current Weather</div>
          <div className="text-xl text-black-500 pt-2 pb-2">
            {weatherInfo.location.name}, {weatherInfo.location.country}:{" "}
            {weatherInfo.current.temp_c}°C, {weatherInfo.current.condition.text}
          </div>
        </div>
      ) : error ? (
        <div className="pt-4 pb-4 text-red-500">{error}</div>
      ) : (
        <div className="pt-4 pb-4 text-gray-500">Loading weather data...</div>
      )}
      {activityRecommendation ? (
        <div className="bg-gray-100 p-4 rounded-lg mt-4">
          <div className="text-sm text-gray-500 mb-2">🎉 Activity Recommendation</div>
          <div className="text-sm text-black-500 mb-2">
            {activityRecommendation}
          </div>
        </div>
      ) : error ? (
        <div className="pt-4 pb-4 text-red-500">{error}</div>
      ) : (
        <div className="pt-4 pb-4 text-gray-500">Loading activity recommendation...</div>
      )}
      <RandomQuote />
    </div>
  );
};

export default Options;
