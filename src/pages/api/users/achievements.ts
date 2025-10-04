import type { NextApiRequest, NextApiResponse } from 'next';
import { UserService } from '@/services/userService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const achievements = await UserService.getAchievements(userId);
    return res.status(200).json(achievements);
  } catch (error) {
    console.error('Achievements API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}