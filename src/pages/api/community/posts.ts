import type { NextApiRequest, NextApiResponse } from 'next';
import { CommunityService } from '@/services/communityService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        const { limit = 20, skip = 0, topic, search } = req.query;
        
        let posts;
        if (search && typeof search === 'string') {
          posts = await CommunityService.searchPosts(
            search, 
            parseInt(limit as string)
          );
        } else {
          posts = await CommunityService.getPosts(
            parseInt(limit as string),
            parseInt(skip as string),
            topic as string
          );
        }
        
        return res.status(200).json(posts);

      case 'POST':
        const { user_id, content, topic, image_url } = req.body;
        
        if (!user_id || !content) {
          return res.status(400).json({ 
            error: 'User ID and content are required' 
          });
        }
        
        const newPost = await CommunityService.createPost({
          user_id,
          content,
          topic,
          image_url
        });
        
        return res.status(201).json(newPost);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('Community posts API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}