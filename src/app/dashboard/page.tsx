"use client";
import React, { useEffect, useState } from "react";
import Chat from "./components/chat";
import Options from "./components/options";
import Header from "../components/Header";
import { Weather } from "../types/types";

const DashboardPage: React.FC = () => {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [location, setLocation] = useState<string>('London'); // Default location

  const fetchWeatherData = async (loc: string) => {
    try {
      const response = await fetch(`/api/weather?location=${loc}`);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const data = await response.json();
      setWeather(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch weather data', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`${latitude},${longitude}`);
      },
      (error) => {
        console.error('Error getting location', error);
        // Fallback to default location
        fetchWeatherData(location);
      }
    );
  }, []);

  useEffect(() => {
    if (location) {
      fetchWeatherData(location);
    }
  }, [location]);

  if (loading) {
    return <p>Loading weather data...</p>;
  }

  if (!weather) {
    return <p>Failed to load weather data.</p>;
  }

  return (
    <div className="pt-11 pb-16">
      <Header />
      {weather.location.name}
      <Chat location={weather.location.name}>
        <Options />
      </Chat>
    </div>
  );
};

export default DashboardPage;
