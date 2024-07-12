import { NextApiRequest, NextApiResponse } from 'next';
import { geolocationService } from '../../dashboard/components/Location';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const position = await geolocationService.getCurrentPosition();
    res.status(200).json({ location: position });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching location data' });
  }
}
