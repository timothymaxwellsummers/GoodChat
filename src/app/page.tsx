'use client';
import React, { useState } from "react";
import ChatWrapper from "./components/ChatWrapper";
import GAD7Form, { QAObject } from "./components/Questionnaire";

export default function Home() {
  const [chatMode, setChatMode] = useState<boolean>(false);
  const [formResponses, setFormResponses] = useState<QAObject | null>(null);
  const [formScore, setFormScore] = useState<number | null>(null);

  const handleFormSubmit = (responses: QAObject, score: number) => {
    setFormResponses(responses);
    setFormScore(score);
    setChatMode(true);
  };

  return (
    <main className="min-h-screen bg-blue-200 flex items-center justify-center p-4">
      {chatMode ? (
        <ChatWrapper responses={formResponses} score={formScore} />
      ) : (
        <GAD7Form
          onSubmit={handleFormSubmit}
          score={(score: number) => setFormScore(score)}
        />
      )}
    </main>
  );
}
