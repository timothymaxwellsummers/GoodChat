"use client";
import React from "react";
import GeneralInfoQuestions from "./components/GeneralnfoQuestions";
import Header from "../components/Header";

const SetupPage: React.FC = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center p-1 pt-20 pb-6">
        <GeneralInfoQuestions />
      </div>
    </>
  );
};

export default SetupPage;
