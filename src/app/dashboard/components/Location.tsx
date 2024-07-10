import React, { useEffect, useState } from 'react';
import Weather from './Weather';

interface Coordinates {
  latitude: number;
  longitude: number;
}

const Location: React.FC = () => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch('/api/location');
        const data = await response.json();
        setCoordinates({
          latitude: data.latitude,
          longitude: data.longitude,
        });
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch location', error);
        setError('Failed to fetch location');
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  if (loading) {
    return <p>Loading location...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!coordinates) {
    return <p>Failed to load location.</p>;
  }

  return <Weather latitude={coordinates.latitude} longitude={coordinates.longitude} />;
};




export async function geolocationService() {
    try {
      const response = await fetch('/api/location');
      const data = await response.json();
      return {
        latitude: data.latitude,
        longitude: data.longitude,
      };
    } catch (error) {
      throw new Error('Failed to fetch location');
    }
  }
  

export default Location;
