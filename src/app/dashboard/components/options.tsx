"use client";
import React from "react";
import RandomQuote from "./RandomQuote";
import { Weather } from "@/app/types/types";

interface OptionsProps {
  weatherInfo: Weather | null;
  activityRecommendation: string | null;
  error: string | null;
}

const Options: React.FC<OptionsProps> = ({ weatherInfo, activityRecommendation, error }) => {
  return (
    <div className="px-4 mt-8"> 
      <div className="text-3xl font-medium">🛋️ Your Dashboard</div>
      <div className="text-xl text-gray-500 pt-2 pb-2">
        Here you can start chatting or explore more options.
      </div>
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/2 pr-4">
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
        </div>
        <div className="w-full md:w-1/2">
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
        </div>
      </div>
      <RandomQuote />
    </div>
  );
};

export default Options;
