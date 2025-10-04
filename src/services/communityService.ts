import { connectToDatabase } from '@/lib/mongodb';
import { CommunityPost, Profile } from '@/models/schemas';

export interface CommunityPostData {
  user_id: string;
  content: string;
  topic?: string;
  image_url?: string;
}

export interface CommunityPostWithUser {
  _id: string;
  user_id: string;
  content: string;
  topic: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: Date;
  updated_at: Date;
  user?: {
    name: string;
    avatar: string;
  };
}

export class CommunityService {
  private static async ensureConnection() {
    await connectToDatabase();
  }

  // Create a new community post
  static async createPost(postData: CommunityPostData): Promise<CommunityPostWithUser> {
    await this.ensureConnection();
    
    const post = await CommunityPost.create({
      user_id: postData.user_id,
      content: postData.content,
      topic: postData.topic || 'General',
      image_url: postData.image_url
    });
    
    // Get user info for the post
    const user = await Profile.findOne({ id: postData.user_id }, { name: 1, avatar: 1 });
    
    return {
      ...post.toObject(),
      user: user ? { name: user.name, avatar: user.avatar } : undefined
    };
  }

  // Get all community posts with user information
  static async getPosts(limit: number = 20, skip: number = 0, topic?: string): Promise<CommunityPostWithUser[]> {
    await this.ensureConnection();
    
    const query = topic && topic !== 'All' ? { topic } : {};
    
    const posts = await CommunityPost.find(query)
      .sort({ created_at: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    // Get user information for each post
    const userIds = [...new Set(posts.map(post => post.user_id))];
    const users = await Profile.find(
      { id: { $in: userIds } },
      { id: 1, name: 1, avatar: 1 }
    ).lean();
    
    const userMap = new Map(users.map(user => [user.id, user]));
    
    return posts.map(post => ({
      ...post,
      _id: post._id.toString(),
      user: userMap.get(post.user_id) ? {
        name: userMap.get(post.user_id)!.name,
        avatar: userMap.get(post.user_id)!.avatar
      } : undefined
    }));
  }

  // Get posts by specific user
  static async getUserPosts(userId: string, limit: number = 10): Promise<CommunityPostWithUser[]> {
    await this.ensureConnection();
    
    const posts = await CommunityPost.find({ user_id: userId })
      .sort({ created_at: -1 })
      .limit(limit)
      .lean();

    // Get user info
    const user = await Profile.findOne({ id: userId }, { name: 1, avatar: 1 });
    const userInfo = user ? { name: user.name, avatar: user.avatar } : undefined;
    
    return posts.map(post => ({
      ...post,
      _id: post._id.toString(),
      user: userInfo
    }));
  }

  // Get post by ID
  static async getPostById(postId: string): Promise<CommunityPostWithUser | null> {
    await this.ensureConnection();
    
    const post = await CommunityPost.findById(postId).lean();
    if (!post) return null;
    
    // Get user info
    const user = await Profile.findOne({ id: post.user_id }, { name: 1, avatar: 1 });
    
    return {
      ...post,
      _id: post._id.toString(),
      user: user ? { name: user.name, avatar: user.avatar } : undefined
    };
  }

  // Update post content
  static async updatePost(postId: string, userId: string, content: string, imageUrl?: string): Promise<boolean> {
    await this.ensureConnection();
    
    const result = await CommunityPost.findOneAndUpdate(
      { _id: postId, user_id: userId }, // Only allow user to update their own posts
      {
        content,
        image_url: imageUrl,
        updated_at: new Date()
      }
    );
    
    return !!result;
  }

  // Delete post
  static async deletePost(postId: string, userId: string): Promise<boolean> {
    await this.ensureConnection();
    
    const result = await CommunityPost.findOneAndDelete({
      _id: postId,
      user_id: userId // Only allow user to delete their own posts
    });
    
    return !!result;
  }

  // Increment likes count
  static async likePost(postId: string): Promise<number> {
    await this.ensureConnection();
    
    const post = await CommunityPost.findByIdAndUpdate(
      postId,
      { $inc: { likes_count: 1 } },
      { new: true }
    );
    
    return post?.likes_count || 0;
  }

  // Decrement likes count
  static async unlikePost(postId: string): Promise<number> {
    await this.ensureConnection();
    
    const post = await CommunityPost.findByIdAndUpdate(
      postId,
      { $inc: { likes_count: -1 } },
      { new: true }
    );
    
    // Ensure likes don't go below 0
    if (post && post.likes_count < 0) {
      post.likes_count = 0;
      await post.save();
    }
    
    return post?.likes_count || 0;
  }

  // Increment comments count
  static async incrementCommentsCount(postId: string): Promise<number> {
    await this.ensureConnection();
    
    const post = await CommunityPost.findByIdAndUpdate(
      postId,
      { $inc: { comments_count: 1 } },
      { new: true }
    );
    
    return post?.comments_count || 0;
  }

  // Decrement comments count
  static async decrementCommentsCount(postId: string): Promise<number> {
    await this.ensureConnection();
    
    const post = await CommunityPost.findByIdAndUpdate(
      postId,
      { $inc: { comments_count: -1 } },
      { new: true }
    );
    
    // Ensure comments don't go below 0
    if (post && post.comments_count < 0) {
      post.comments_count = 0;
      await post.save();
    }
    
    return post?.comments_count || 0;
  }

  // Get popular topics
  static async getPopularTopics(limit: number = 10): Promise<{ topic: string; count: number }[]> {
    await this.ensureConnection();
    
    const topics = await CommunityPost.aggregate([
      { $group: { _id: '$topic', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      { $project: { topic: '$_id', count: 1, _id: 0 } }
    ]);
    
    return topics;
  }

  // Search posts by content
  static async searchPosts(searchTerm: string, limit: number = 20): Promise<CommunityPostWithUser[]> {
    await this.ensureConnection();
    
    const posts = await CommunityPost.find({
      $or: [
        { content: { $regex: searchTerm, $options: 'i' } },
        { topic: { $regex: searchTerm, $options: 'i' } }
      ]
    })
    .sort({ created_at: -1 })
    .limit(limit)
    .lean();

    // Get user information for each post
    const userIds = [...new Set(posts.map(post => post.user_id))];
    const users = await Profile.find(
      { id: { $in: userIds } },
      { id: 1, name: 1, avatar: 1 }
    ).lean();
    
    const userMap = new Map(users.map(user => [user.id, user]));
    
    return posts.map(post => ({
      ...post,
      _id: post._id.toString(),
      user: userMap.get(post.user_id) ? {
        name: userMap.get(post.user_id)!.name,
        avatar: userMap.get(post.user_id)!.avatar
      } : undefined
    }));
  }

  // Get community stats
  static async getCommunityStats(): Promise<{
    totalPosts: number;
    totalUsers: number;
    postsThisWeek: number;
    popularTopics: { topic: string; count: number }[];
  }> {
    await this.ensureConnection();
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const [totalPosts, totalUsers, postsThisWeek, popularTopics] = await Promise.all([
      CommunityPost.countDocuments(),
      Profile.countDocuments(),
      CommunityPost.countDocuments({ created_at: { $gte: weekAgo } }),
      this.getPopularTopics(5)
    ]);
    
    return {
      totalPosts,
      totalUsers,
      postsThisWeek,
      popularTopics
    };
  }
}