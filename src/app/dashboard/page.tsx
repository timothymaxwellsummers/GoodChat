"use client";
import React, { useEffect, useState } from "react";
import Chat from "./components/chat";
import Options from "./components/options";
import Header from "../components/Header";
import { Weather } from "../types/types";
import MoodRequest from "./components/moodRequest";

const DashboardPage: React.FC = () => {
  const [weather, setWeather] = useState<Weather | null>(null);
  //todo make nice loading logic
  const [loading, setLoading] = useState<boolean>(true);
  const [location, setLocation] = useState<string>("Munich"); // Default location
  const [todasyMood, setTodaysMood] = useState<string | null>(null); // Default mood

  const fetchWeatherData = async (loc: string) => {
    try {
      const response = await fetch(`/api/weather?location=${loc}`);
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const data = await response.json();
      setWeather(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch weather data", error);
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
        console.error("Error getting location", error);
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

  return (
    <>
      {!todasyMood ? (
        <>
          <Header />
          <MoodRequest setTodaysMood={setTodaysMood} />
        </>
      ) : (
        <>
          {!weather ? (
            <div className="flex items-center justify-center h-screen">
              <div>
                <p className="text-3xl font-medium relative inline-block">
                  GoodChat
                  <span
                    className="text-sky-600 text-7xl absolute top-0"
                    style={{ lineHeight: "0.1" }}
                  >
                    .
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div className="pt-11 pb-16">
              <Header />
              <Chat weather={weather} mood={todasyMood} >
                <Options weather={weather}/>
              </Chat>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default DashboardPage;
