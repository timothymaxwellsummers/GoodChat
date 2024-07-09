// components/moodRequest.tsx
import React, { useState } from "react";

interface MoodRequestProps {
  onMoodSelect: (moodInfo: string) => void;
}

const MoodRequest: React.FC<MoodRequestProps> = ({ onMoodSelect }) => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const moods = [
    { emoji: "😢", label: "Very Sad" },
    { emoji: "😟", label: "Sad" },
    { emoji: "😐", label: "Neutral" },
    { emoji: "😊", label: "Happy" },
    { emoji: "😁", label: "Very Happy" }
  ];

  const handleMoodSelect = (index: number) => {
    const mood = moods[index].label;
    setSelectedMood(index);
    onMoodSelect(mood);
  };

  if (selectedMood !== null) {
    return null;
  }

  return (
    <div className="bg-gray-100 p-4 rounded-lg mt-4">
      <div className="text-3xl font-medium">😊 Choose Your Mood</div>
      <div className="flex justify-around">
        {moods.map((moodItem, index) => (
          <div key={index} className="text-center">
            <button
              onClick={() => handleMoodSelect(index)}
              className="relative inline-block text-2xl focus:outline-none"
            >
              <span role="img" aria-label={moodItem.label}>{moodItem.emoji}</span>
            </button>
            <div className="mt-1 text-sm">{moodItem.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodRequest;
