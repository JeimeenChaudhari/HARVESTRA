import type { NextApiRequest, NextApiResponse } from 'next';
import { UserService } from '@/services/userService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        const { userId } = req.query;
        if (!userId || typeof userId !== 'string') {
          return res.status(400).json({ error: 'User ID is required' });
        }
        
        const streakData = await UserService.getStreak(userId);
        return res.status(200).json(streakData);

      case 'POST':
        const { userId: postUserId, activityDate } = req.body;
        if (!postUserId || !activityDate) {
          return res.status(400).json({ error: 'User ID and activity date are required' });
        }
        
        const updatedStreak = await UserService.updateStreak(postUserId, activityDate);
        return res.status(200).json(updatedStreak);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('Streak API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}