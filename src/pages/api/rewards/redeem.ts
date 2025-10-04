import type { NextApiRequest, NextApiResponse } from 'next';
import { RewardsService } from '@/services/rewardsService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'POST':
        const { userId, rewardId } = req.body;
        
        if (!userId || !rewardId) {
          return res.status(400).json({ 
            error: 'User ID and reward ID are required' 
          });
        }
        
        const result = await RewardsService.redeemReward(userId, rewardId);
        
        if (result.success) {
          return res.status(200).json(result);
        } else {
          return res.status(400).json(result);
        }

      case 'GET':
        const { userId: getUserId } = req.query;
        
        if (!getUserId || typeof getUserId !== 'string') {
          return res.status(400).json({ error: 'User ID is required' });
        }
        
        const redemptions = await RewardsService.getUserRedemptions(getUserId);
        return res.status(200).json(redemptions);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('Rewards redeem API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}