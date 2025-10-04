import type { NextApiRequest, NextApiResponse } from 'next';
import { RewardsService } from '@/services/rewardsService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        const missions = await RewardsService.getMissions();
        return res.status(200).json(missions);

      case 'POST':
        const { userId, missionId, proofDescription, proofImageUrl } = req.body;
        
        if (!userId || !missionId || !proofDescription) {
          return res.status(400).json({ 
            error: 'User ID, mission ID, and proof description are required' 
          });
        }
        
        const result = await RewardsService.submitMissionProof(
          userId,
          missionId,
          proofDescription,
          proofImageUrl
        );
        
        if (result.success) {
          return res.status(200).json(result);
        } else {
          return res.status(400).json(result);
        }

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('Missions API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}