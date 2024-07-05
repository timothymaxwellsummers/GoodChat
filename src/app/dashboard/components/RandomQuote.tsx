// components/RandomQuote.tsx
"use client";
import React, { useEffect, useState } from 'react';

interface Quote {
  q: string;
  a: string;
}

const RandomQuote: React.FC = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRandomQuote = async () => {
    try {
      const response = await fetch('/api/quotes');
      const data = await response.json();
      const quotes: Quote[] = data.data; // Assuming data contains the array of quotes directly
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[randomIndex]);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch quotes', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomQuote();
  }, []);

  useEffect(() => {
    console.log("Quote", quote);
  }, [quote]);

  if (loading) {
    return <p>Loading quote...</p>;
  }

  if (!quote) {
    return <p>Failed to load quote.</p>;
  }

  return (
    <div className="bg-gray-100 p-4 rounded-lg mt-4">
      <p className="text-sm text-gray-500 mb-2">💭 Daily Quote</p>
      <blockquote className="text-base italic text-gray-700">
        &ldquo;{quote.q}&rdquo;
        <footer className="mt-2 text-right text-gray-600">&mdash; {quote.a}</footer>
      </blockquote>
    </div>
  );
};

export default RandomQuote;