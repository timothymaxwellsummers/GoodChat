"use client"
import React, { useState } from 'react';
import Header from '../components/Header';
import MoodRequest from './components/moodRequest';
import Options from './components/options';
import Chat from './components/chat';

const DashboardPage: React.FC = () => {
    const [showDashboard, setShowDashboard] = useState(false);
    const [mood, setMood] = useState<string | null>(null); // Adjust state type to string

    const handleMoodSelected = (selectedMood: string) => {
        setMood(selectedMood);
        setShowDashboard(true);
    };

    return (
        <div className='pt-11 pb-16'>
            <Header />
            <div className="px-4">
                {showDashboard ? (
                    <Chat mood={mood}><Options weatherInfo={undefined} activityRecommendation={null} error={null} /></Chat>
                ) : (
                    <MoodRequest onMoodSelect={handleMoodSelected} />
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
