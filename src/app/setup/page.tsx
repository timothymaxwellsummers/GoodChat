"use client";
import React from "react";
import GeneralInfoQuestions from "./components/GeneralnfoQuestions";
import Header from "../components/Header";

const SetupPage: React.FC = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-blue-200 flex items-center justify-center p-4">
        <GeneralInfoQuestions />
      </div>
    </>
  );
};

export default SetupPage;
