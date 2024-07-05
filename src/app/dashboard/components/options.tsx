"use client";
import React from "react";
import RandomQuote from "./RandomQuote";

const Options: React.FC = () => {
  return (
    <div className="px-4 pt-14">
      <div className="text-3xl font-medium">🛋️ Your Dashboard</div>
      <div className="text-xl text-gray-500 pt-2 pb-2">
        Here you can start chatting or explore more options.
      </div>
      <RandomQuote />
    </div>
  );
};

export default Options;
