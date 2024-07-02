"use client";
import React from "react";
import { useRouter } from "next/navigation";
import GeneralInfoQuestions from "./components/GeneralnfoQuestions";

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
    <div className="min-h-screen bg-blue-200 flex items-center justify-center p-4">
      <GeneralInfoQuestions />
    </div>
  );
};

export default SetupPage;
