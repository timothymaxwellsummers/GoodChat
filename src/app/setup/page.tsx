"use client";
import React from "react";
import { useRouter } from "next/navigation";

const SetupPage: React.FC = () => {
  const router = useRouter();

  const savePersInfo = () => {
    const personalInformation = {
      name: "John Doe",
      age: "27",
      // Add more fields as needed
    };

    localStorage.setItem(
      "personalInformation.json",
      JSON.stringify(personalInformation)
    );
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Setup</h1>
      <button
        onClick={savePersInfo}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Generate Personal Information
      </button>
    </div>
  );
};

export default SetupPage;
