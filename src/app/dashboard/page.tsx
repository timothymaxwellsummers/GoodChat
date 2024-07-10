"use client"
import React, { useState } from 'react';
import Header from '../components/Header';
import MoodRequest from './components/moodRequest';
import Options from './components/options';
import Chat from './components/chat'; 

const DashboardPage: React.FC = () => {
    const [showDashboard, setShowDashboard] = useState(false);

    const handleMoodSelected = () => {
        setShowDashboard(true);
    };

    return (
        <div className='pt-11 pb-16'>
            <Header />
            <div className="px-4">
                
               <Chat><Options /></Chat>
            </div>
        </div>
    );
};

export default DashboardPage;
