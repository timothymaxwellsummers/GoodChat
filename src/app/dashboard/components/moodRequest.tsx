import React from 'react';

interface MoodRequestProps {
    onMoodSelect: (mood: string) => void;
}

const MoodRequest: React.FC<MoodRequestProps> = ({ onMoodSelect }) => {
    const moods = ["😢", "😟", "😐", "😊", "😁"];
    const labels = ["Very Sad", "Sad", "Neutral", "Happy", "Very Happy"];

    const handleMoodSelect = (index: number) => {
        onMoodSelect(labels[index]);
    };

    return (
        <div className="bg-gray-100 p-4 rounded-lg mt-4">
            <div className="text-sm text-gray-500 mb-2">😊 Choose Your Mood</div>
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
    );
};

export default MoodRequest;
