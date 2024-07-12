import React, { useEffect, useState } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
}

interface Position {
  coords: Coordinates;
  timestamp: number;
}

interface PositionError {
  code: number;
  message: string;
}

class GeolocationService {
  public getCurrentPosition(): Promise<Position> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position),
          (error) => reject(error)
        );
      } else {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    });
  }

  public watchPosition(
    successCallback: (position: Position) => void,
    errorCallback?: (error: PositionError) => void,
    options?: PositionOptions
  ): number | void {
    if (navigator.geolocation) {
      return navigator.geolocation.watchPosition(successCallback, errorCallback, options);
    } else {
      errorCallback && errorCallback({
        code: 0,
        message: 'Geolocation is not supported by this browser.'
      } as PositionError);
    }
  }

  public clearWatch(watchId: number): void {
    if (navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
    }
  }
}

export const geolocationService = new GeolocationService();

const Location: React.FC = () => {
  const [location, setLocation] = useState<Position | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const position = await geolocationService.getCurrentPosition();
        setLocation(position);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch location', error);
        setError('Failed to fetch location');
        setLoading(false);
      }
    };

    fetchLocationData();
  }, []);

  if (loading) {
    return <p>Loading location...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!location) {
    return <p>Failed to load location.</p>;
  }

};

export default Location;
