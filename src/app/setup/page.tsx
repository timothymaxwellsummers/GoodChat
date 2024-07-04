"use client";
import React from "react";
import GeneralInfoQuestions from "./components/GeneralnfoQuestions";

const SetupPage: React.FC = () => {

  return (
    <div className="min-h-screen bg-blue-200 flex items-center justify-center p-4">
      <GeneralInfoQuestions />
    </div>
  );
};

export default SetupPage;
