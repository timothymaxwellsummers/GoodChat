"use client";
import { useEffect } from 'react';
import { redirect } from 'next/navigation'

const HomePage: React.FC = () => {

  useEffect(() => {
    // Function to check if personalInformation.json exists in localStorage
    const checkPersonalInformation = () => {
      const personalInfo = localStorage.getItem('profile.json');
      if (personalInfo) {
        redirect('/dashboard')
      } else {
        redirect('/setup')
      }
    };

    checkPersonalInformation();

    window.addEventListener('storage', checkPersonalInformation);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('storage', checkPersonalInformation);
    };
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg text-gray-600">Loading...</p>
    </div>
  );
};

export default HomePage;