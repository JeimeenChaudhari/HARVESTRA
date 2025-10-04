import type { NextApiRequest, NextApiResponse } from 'next';
import { UserService } from '@/services/userService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { userId } = req.query;

  try {
    switch (method) {
      case 'GET':
        if (!userId || typeof userId !== 'string') {
          return res.status(400).json({ error: 'User ID is required' });
        }
        
        const profile = await UserService.getProfile(userId);
        if (!profile) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        return res.status(200).json(profile);

      case 'POST':
        const profileData = req.body;
        if (!profileData.id || !profileData.name || !profileData.email) {
          return res.status(400).json({ error: 'Required fields: id, name, email' });
        }
        
        const updatedProfile = await UserService.createOrUpdateProfile(profileData);
        return res.status(200).json(updatedProfile);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('Profile API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}