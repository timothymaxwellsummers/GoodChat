import axios from 'axios';

const API_KEY = 'e49d6f3eef724890ba1124136240907';
const BASE_URL = 'http://api.weatherapi.com/v1';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latitude = searchParams.get('lat');
  const longitude = searchParams.get('lon');

  if (!latitude || !longitude) {
    return new Response('Latitude and longitude are required', { status: 400 });
  }

  try {
    const response = await axios.get(`${BASE_URL}/current.json`, {
      params: {
        key: API_KEY,
        q: `${latitude},${longitude}`,
      },
    });
    const weather = response.data;
    return Response.json({ weather })

  } catch (error) {
    return new Response('Error fetching weather data', { status: 500 });
  }
}
