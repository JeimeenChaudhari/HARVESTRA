import type { NextApiRequest, NextApiResponse } from 'next';
import { CommunityService } from '@/services/communityService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { postId } = req.query;
  const { action } = req.body;

  if (!postId || typeof postId !== 'string') {
    return res.status(400).json({ error: 'Post ID is required' });
  }

  if (!action) {
    return res.status(400).json({ error: 'Action is required' });
  }

  try {
    let result;
    
    switch (action) {
      case 'like':
        result = await CommunityService.likePost(postId);
        return res.status(200).json({ likes_count: result });

      case 'unlike':
        result = await CommunityService.unlikePost(postId);
        return res.status(200).json({ likes_count: result });

      case 'comment_added':
        result = await CommunityService.incrementCommentsCount(postId);
        return res.status(200).json({ comments_count: result });

      case 'comment_removed':
        result = await CommunityService.decrementCommentsCount(postId);
        return res.status(200).json({ comments_count: result });

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Community actions API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}