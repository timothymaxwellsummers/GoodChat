"use client";
import React from "react";
import RandomQuote from "./RandomQuote";
import { Weather } from "@/app/types/types";

interface OptionsProps {
  weather: Weather;
}

const Options: React.FC<OptionsProps> = ({ weather }) => {
  return (
    <div className="px-4 pt-14">
      <div className="text-3xl font-medium">🛋️ Your Dashboard</div>
      <div className="text-xl text-gray-500 pt-2 pb-2">
        Here you can start chatting or get some inspiration.
      </div>
      <div className="text-xl pt-2">
        ⛅️ {weather.location.name}: {weather.current.temp_c}°C
      </div>
      <RandomQuote />
    </div>
  );
};

export default Options;
