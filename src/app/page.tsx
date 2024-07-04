"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";

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
      <div>
        <p className="text-3xl font-medium relative inline-block">
          GoodChat
          <span
            className="text-sky-600 text-7xl absolute top-0"
            style={{ lineHeight: "0.1" }}
          >
            .
          </span>
        </p>
      </div>
    </div>
  );
};

export default HomePage;
