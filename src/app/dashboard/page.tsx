"use client"
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import MoodRequest from './components/moodRequest';
import Options from './components/options';
import Chat from './components/chat';
import { geolocationService } from './components/Location';
import { getWeather } from './components/Weather';

const DashboardPage: React.FC = () => {
    const [showDashboard, setShowDashboard] = useState(false);
    const [mood, setMood] = useState<string | null>(null); 
    const [error, setError] = useState<string | null>(null);
    const [weatherInfo, setWeatherInfo] = useState<any>(null);
    const [locationInfo, setLocationInfo] = useState<any>(null);

    const handleMoodSelected = (selectedMood: string) => {
        setMood(selectedMood);
        setShowDashboard(true);
    };

    useEffect(() => {
        const fetchWeatherAndRecommendation = async () => {
            try {
                const position = await geolocationService.getCurrentPosition();
                setLocationInfo(position);
                const { latitude, longitude } = position.coords;
                const weatherData = await getWeather(latitude, longitude);
                setWeatherInfo(weatherData);
            } catch (err) {
                setError("Failed to fetch weather data or activity recommendation");
                console.error("Error fetching weather or recommendation:", err);
            }
        };

        fetchWeatherAndRecommendation();
    }, []);

    return (
        <div className='pt-11 pb-16'>
            <Header />
            <div className="pt-11 pb-16">
                {showDashboard ? (
                    <Chat 
                        mood={mood} 
                        weatherInfo={weatherInfo} 
                        locationInfo={weatherInfo?.location?.name || 'Location not available'} 
                    />
                ) : (
                    <MoodRequest onMoodSelect={handleMoodSelected} />
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
