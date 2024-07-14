import React, { useState } from "react";

interface MoodRequestProps {
  setTodaysMood: (mood: string) => void;
}

const MoodRequest: React.FC<MoodRequestProps> = ({ setTodaysMood }) => {
  const moods = ["😢", "😟", "😐", "😊", "😁"];
  const labels = ["Very Sad", "Sad", "Neutral", "Happy", "Very Happy"];

  const handleMoodSelect = (index: number) => {
    setTodaysMood(labels[index]);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="px-4 mt-24">
        <div className="text-3xl font-medium">
          🛋️ How are you feeling today?
        </div>
        <div className="bg-gray-100 p-4 rounded-lg mt-4">
          <div className="flex justify-around">
            {moods.map((moodEmoji, index) => (
              <button
                key={index}
                onClick={() => handleMoodSelect(index)}
                className="text-2xl focus:outline-none"
              >
                <div className="flex flex-col items-center">
                  {moodEmoji}
                  <span className="text-sm">{labels[index]}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodRequest;
