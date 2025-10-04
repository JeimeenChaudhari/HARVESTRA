import type { NextApiRequest, NextApiResponse } from 'next';
import { RewardsService } from '@/services/rewardsService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { userLevel = 1, category } = req.query;

  try {
    let rewards;
    
    if (category && typeof category === 'string') {
      rewards = await RewardsService.getRewardsByCategory(category);
    } else {
      rewards = await RewardsService.getRewardsCatalog(parseInt(userLevel as string));
    }
    
    return res.status(200).json(rewards);
  } catch (error) {
    console.error('Rewards catalog API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}