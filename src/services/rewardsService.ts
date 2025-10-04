import { connectToDatabase } from '@/lib/mongodb';
import { RewardRedemption, MissionSubmission } from '@/models/schemas';
import { UserService } from './userService';

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: 'tools' | 'seeds' | 'learning' | 'equipment' | 'organic';
  icon: string;
  availability: 'available' | 'limited' | 'out_of_stock';
  requiredLevel?: number;
  estimatedDelivery: string;
  termsAndConditions?: string;
}

export interface MissionData {
  id: string;
  title: string;
  description: string;
  pointsReward: number;
  category: 'farming' | 'community' | 'learning' | 'seasonal';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  requirements: string[];
  icon: string;
  deadline?: Date;
  isActive: boolean;
}

export interface RedemptionWithReward {
  _id: string;
  user_id: string;
  reward_id: string;
  reward_title: string;
  points_spent: number;
  status: 'pending' | 'approved' | 'delivered' | 'cancelled';
  redeemed_at: Date;
  updated_at: Date;
  reward?: RewardItem;
}

export class RewardsService {
  private static async ensureConnection() {
    await connectToDatabase();
  }

  // Predefined reward items
  private static rewardCatalog: RewardItem[] = [
    {
      id: 'organic-seeds-tomato',
      title: '🍅 Organic Tomato Seeds Pack',
      description: 'Premium quality organic tomato seeds suitable for all seasons',
      pointsCost: 500,
      category: 'seeds',
      icon: '🍅',
      availability: 'available',
      estimatedDelivery: '3-5 working days',
      termsAndConditions: 'Seeds are non-returnable. Store in cool, dry place.'
    },
    {
      id: 'farming-tools-basic',
      title: '🔨 Basic Farming Tool Kit',
      description: 'Essential farming tools including spade, hoe, and weeder',
      pointsCost: 2000,
      category: 'tools',
      icon: '🔨',
      availability: 'limited',
      requiredLevel: 5,
      estimatedDelivery: '7-10 working days',
      termsAndConditions: 'Tools come with 6-month warranty'
    },
    {
      id: 'organic-fertilizer',
      title: '🌱 Organic Fertilizer (5kg)',
      description: 'NPK-rich organic fertilizer made from compost',
      pointsCost: 800,
      category: 'organic',
      icon: '🌱',
      availability: 'available',
      estimatedDelivery: '5-7 working days'
    },
    {
      id: 'drip-irrigation',
      title: '💧 Drip Irrigation Kit',
      description: 'Water-efficient irrigation system for small farms',
      pointsCost: 3500,
      category: 'equipment',
      icon: '💧',
      availability: 'limited',
      requiredLevel: 10,
      estimatedDelivery: '10-15 working days'
    },
    {
      id: 'farming-course',
      title: '📚 Advanced Farming Course',
      description: 'Online course on modern sustainable farming techniques',
      pointsCost: 1200,
      category: 'learning',
      icon: '📚',
      availability: 'available',
      estimatedDelivery: 'Instant access'
    },
    {
      id: 'vegetable-seeds-mix',
      title: '🥬 Mixed Vegetable Seeds',
      description: 'Variety pack of seasonal vegetable seeds',
      pointsCost: 750,
      category: 'seeds',
      icon: '🥬',
      availability: 'available',
      estimatedDelivery: '3-5 working days'
    },
    {
      id: 'soil-testing-kit',
      title: '🔬 Soil pH Testing Kit',
      description: 'Test your soil pH and nutrients levels',
      pointsCost: 600,
      category: 'tools',
      icon: '🔬',
      availability: 'available',
      estimatedDelivery: '3-5 working days'
    },
    {
      id: 'premium-seeds-hybrid',
      title: '🌽 Premium Hybrid Seeds',
      description: 'High-yield hybrid seeds for corn, wheat, and rice',
      pointsCost: 1500,
      category: 'seeds',
      icon: '🌽',
      availability: 'limited',
      requiredLevel: 8,
      estimatedDelivery: '5-7 working days'
    }
  ];

  // Predefined missions
  private static missionCatalog: MissionData[] = [
    {
      id: 'daily-checkin',
      title: '📅 Daily Check-in',
      description: 'Visit the app and check your progress daily',
      pointsReward: 50,
      category: 'learning',
      difficulty: 'easy',
      estimatedTime: '2 minutes',
      requirements: ['Open the app', 'Review your dashboard'],
      icon: '📅',
      isActive: true
    },
    {
      id: 'complete-quiz',
      title: '🧠 Complete a Learning Quiz',
      description: 'Take and pass any quiz with 80% or higher score',
      pointsReward: 150,
      category: 'learning',
      difficulty: 'medium',
      estimatedTime: '10 minutes',
      requirements: ['Complete any module quiz', 'Score 80% or higher'],
      icon: '🧠',
      isActive: true
    },
    {
      id: 'plant-new-crop',
      title: '🌱 Plant a New Crop',
      description: 'Start cultivation of a new crop variety in your field',
      pointsReward: 300,
      category: 'farming',
      difficulty: 'medium',
      estimatedTime: '1 hour',
      requirements: ['Plant new seeds', 'Upload photo proof', 'Tag location'],
      icon: '🌱',
      isActive: true
    },
    {
      id: 'community-post',
      title: '💬 Share Farming Knowledge',
      description: 'Create a helpful post in the community forum',
      pointsReward: 100,
      category: 'community',
      difficulty: 'easy',
      estimatedTime: '5 minutes',
      requirements: ['Write meaningful post', 'Help fellow farmers'],
      icon: '💬',
      isActive: true
    },
    {
      id: 'harvest-documentation',
      title: '📸 Document Your Harvest',
      description: 'Take photos and share details of your recent harvest',
      pointsReward: 250,
      category: 'farming',
      difficulty: 'easy',
      estimatedTime: '15 minutes',
      requirements: ['Upload harvest photos', 'Include harvest details', 'Share quantities'],
      icon: '📸',
      isActive: true
    },
    {
      id: 'water-conservation',
      title: '💧 Water Conservation Practice',
      description: 'Implement and document water-saving techniques',
      pointsReward: 400,
      category: 'farming',
      difficulty: 'hard',
      estimatedTime: '2 hours',
      requirements: ['Implement water-saving method', 'Document process', 'Show before/after'],
      icon: '💧',
      isActive: true
    },
    {
      id: 'help-neighbor',
      title: '🤝 Help a Fellow Farmer',
      description: 'Assist another farmer in your community',
      pointsReward: 200,
      category: 'community',
      difficulty: 'medium',
      estimatedTime: '30 minutes',
      requirements: ['Help another farmer', 'Document assistance', 'Get confirmation'],
      icon: '🤝',
      isActive: true
    }
  ];

  // Get all available rewards
  static async getRewardsCatalog(userLevel: number = 1): Promise<RewardItem[]> {
    return this.rewardCatalog.filter(reward => 
      !reward.requiredLevel || reward.requiredLevel <= userLevel
    );
  }

  // Get reward by ID
  static async getRewardById(rewardId: string): Promise<RewardItem | null> {
    return this.rewardCatalog.find(reward => reward.id === rewardId) || null;
  }

  // Get rewards by category
  static async getRewardsByCategory(category: string): Promise<RewardItem[]> {
    return this.rewardCatalog.filter(reward => reward.category === category);
  }

  // Redeem a reward
  static async redeemReward(
    userId: string, 
    rewardId: string
  ): Promise<{ success: boolean; message: string; redemptionId?: string }> {
    await this.ensureConnection();
    
    const reward = await this.getRewardById(rewardId);
    if (!reward) {
      return { success: false, message: 'Reward not found' };
    }
    
    // Check availability
    if (reward.availability === 'out_of_stock') {
      return { success: false, message: 'Reward is currently out of stock' };
    }
    
    // Check user points
    const userPoints = await UserService.getTotalPoints(userId);
    if (userPoints < reward.pointsCost) {
      return { 
        success: false, 
        message: `Insufficient points. You need ${reward.pointsCost - userPoints} more points.` 
      };
    }
    
    // Check user level if required
    if (reward.requiredLevel) {
      const userStats = await UserService.getUserStats(userId);
      const userLevel = Math.floor(userStats.completedModules / 2) + 1; // Simple level calculation
      
      if (userLevel < reward.requiredLevel) {
        return { 
          success: false, 
          message: `You need to reach level ${reward.requiredLevel} to redeem this reward.` 
        };
      }
    }
    
    // Create redemption record
    const redemption = await RewardRedemption.create({
      user_id: userId,
      reward_id: rewardId,
      reward_title: reward.title,
      points_spent: reward.pointsCost
    });
    
    // Deduct points
    await UserService.addPoints(userId, -reward.pointsCost, 'reward_redemption', reward.title);
    
    return { 
      success: true, 
      message: `Successfully redeemed ${reward.title}!`,
      redemptionId: redemption._id.toString()
    };
  }

  // Get user's redemption history
  static async getUserRedemptions(userId: string): Promise<RedemptionWithReward[]> {
    await this.ensureConnection();
    
    const redemptions = await RewardRedemption.find({ user_id: userId })
      .sort({ redeemed_at: -1 });
    
    return redemptions.map(redemption => {
      const rewardDetails = this.rewardCatalog.find(r => r.id === redemption.reward_id);
      return {
        ...redemption.toObject(),
        _id: redemption._id.toString(),
        reward: rewardDetails
      };
    });
  }

  // Update redemption status (for admin use)
  static async updateRedemptionStatus(
    redemptionId: string, 
    status: 'pending' | 'approved' | 'delivered' | 'cancelled'
  ): Promise<boolean> {
    await this.ensureConnection();
    
    const result = await RewardRedemption.findByIdAndUpdate(
      redemptionId,
      { 
        status,
        updated_at: new Date()
      }
    );
    
    return !!result;
  }

  // Get all available missions
  static async getMissions(): Promise<MissionData[]> {
    return this.missionCatalog.filter(mission => mission.isActive);
  }

  // Get mission by ID
  static async getMissionById(missionId: string): Promise<MissionData | null> {
    return this.missionCatalog.find(mission => mission.id === missionId) || null;
  }

  // Submit mission proof
  static async submitMissionProof(
    userId: string,
    missionId: string,
    proofDescription: string,
    proofImageUrl?: string
  ): Promise<{ success: boolean; message: string; submissionId?: string }> {
    await this.ensureConnection();
    
    const mission = await this.getMissionById(missionId);
    if (!mission) {
      return { success: false, message: 'Mission not found' };
    }
    
    // Check if user already has a pending/verified submission for this mission
    const existingSubmission = await MissionSubmission.findOne({
      user_id: userId,
      mission_id: missionId,
      status: { $in: ['pending', 'verified'] }
    });
    
    if (existingSubmission) {
      return { success: false, message: 'You already have a submission for this mission' };
    }
    
    // Create mission submission
    const submission = await MissionSubmission.create({
      user_id: userId,
      mission_id: missionId,
      proof_description: proofDescription,
      proof_image_url: proofImageUrl
    });
    
    return {
      success: true,
      message: 'Mission proof submitted successfully! It will be reviewed soon.',
      submissionId: submission._id.toString()
    };
  }

  // Get user's mission submissions
  static async getUserMissionSubmissions(userId: string): Promise<any[]> {
    await this.ensureConnection();
    
    const submissions = await MissionSubmission.find({ user_id: userId })
      .sort({ submitted_at: -1 });
    
    return submissions.map(submission => {
      const missionDetails = this.missionCatalog.find(m => m.id === submission.mission_id);
      return {
        ...submission.toObject(),
        mission: missionDetails
      };
    });
  }

  // Verify mission submission (for admin use)
  static async verifyMissionSubmission(
    submissionId: string,
    approved: boolean
  ): Promise<{ success: boolean; message: string }> {
    await this.ensureConnection();
    
    const submission = await MissionSubmission.findById(submissionId);
    if (!submission) {
      return { success: false, message: 'Submission not found' };
    }
    
    const mission = await this.getMissionById(submission.mission_id);
    if (!mission) {
      return { success: false, message: 'Mission not found' };
    }
    
    if (approved) {
      // Award points
      await UserService.addPoints(
        submission.user_id, 
        mission.pointsReward, 
        'mission_completion', 
        mission.title
      );
      
      submission.status = 'verified';
      submission.points_awarded = mission.pointsReward;
      submission.verified_at = new Date();
    } else {
      submission.status = 'rejected';
    }
    
    await submission.save();
    
    return { 
      success: true, 
      message: approved ? 'Mission verified and points awarded!' : 'Mission submission rejected.' 
    };
  }

  // Get rewards statistics
  static async getRewardsStats(): Promise<{
    totalRedemptions: number;
    totalPointsSpent: number;
    popularRewards: { reward_id: string; count: number; reward?: RewardItem }[];
    pendingRedemptions: number;
  }> {
    await this.ensureConnection();
    
    const [totalRedemptions, pointsResult, popularRewards, pendingRedemptions] = await Promise.all([
      RewardRedemption.countDocuments(),
      RewardRedemption.aggregate([
        { $group: { _id: null, total: { $sum: '$points_spent' } } }
      ]),
      RewardRedemption.aggregate([
        { $group: { _id: '$reward_id', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $project: { reward_id: '$_id', count: 1, _id: 0 } }
      ]),
      RewardRedemption.countDocuments({ status: 'pending' })
    ]);
    
    const totalPointsSpent = pointsResult[0]?.total || 0;
    
    // Add reward details to popular rewards
    const popularRewardsWithDetails = popularRewards.map(item => ({
      ...item,
      reward: this.rewardCatalog.find(r => r.id === item.reward_id)
    }));
    
    return {
      totalRedemptions,
      totalPointsSpent,
      popularRewards: popularRewardsWithDetails,
      pendingRedemptions
    };
  }
}