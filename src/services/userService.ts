import { connectToDatabase } from '@/lib/mongodb';
import { Profile, UserPoints, UserStreak, ModuleProgress, QuizAttempt, Achievement, AvatarUnlock } from '@/models/schemas';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  district?: string;
  panchayat?: string;
  primary_crop?: string;
  avatar: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserStats {
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  completedModules: number;
  totalAchievements: number;
  averageQuizScore: number;
}

export class UserService {
  private static async ensureConnection() {
    await connectToDatabase();
  }

  // Create or update user profile
  static async createOrUpdateProfile(profileData: UserProfile): Promise<UserProfile> {
    await this.ensureConnection();
    
    const updatedProfile = await Profile.findOneAndUpdate(
      { id: profileData.id },
      {
        ...profileData,
        updated_at: new Date()
      },
      { upsert: true, new: true }
    );
    
    return updatedProfile.toObject();
  }

  // Get user profile
  static async getProfile(userId: string): Promise<UserProfile | null> {
    await this.ensureConnection();
    
    const profile = await Profile.findOne({ id: userId });
    return profile ? profile.toObject() : null;
  }

  // Add points to user
  static async addPoints(userId: string, points: number, source: string, description?: string): Promise<void> {
    await this.ensureConnection();
    
    await UserPoints.create({
      user_id: userId,
      points,
      source,
      description
    });
  }

  // Get user's total points
  static async getTotalPoints(userId: string): Promise<number> {
    await this.ensureConnection();
    
    const result = await UserPoints.aggregate([
      { $match: { user_id: userId } },
      { $group: { _id: null, total: { $sum: '$points' } } }
    ]);
    
    return result[0]?.total || 0;
  }

  // Update user streak
  static async updateStreak(userId: string, activityDate: string): Promise<{ currentStreak: number; longestStreak: number }> {
    await this.ensureConnection();
    
    const today = activityDate;
    const yesterday = new Date(new Date(today).getTime() - 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0];
    
    let streakData = await UserStreak.findOne({ user_id: userId });
    
    if (!streakData) {
      // First streak entry
      streakData = await UserStreak.create({
        user_id: userId,
        current_streak: 1,
        longest_streak: 1,
        last_activity_date: today
      });
    } else {
      // Check if activity is consecutive
      if (streakData.last_activity_date === yesterday) {
        // Consecutive day - increment streak
        streakData.current_streak += 1;
        streakData.longest_streak = Math.max(streakData.longest_streak, streakData.current_streak);
      } else if (streakData.last_activity_date !== today) {
        // Non-consecutive day - reset streak
        streakData.current_streak = 1;
      }
      // If same day, no change to streak
      
      streakData.last_activity_date = today;
      streakData.updated_at = new Date();
      await streakData.save();
    }
    
    return {
      currentStreak: streakData.current_streak,
      longestStreak: streakData.longest_streak
    };
  }

  // Get user streak data
  static async getStreak(userId: string): Promise<{ currentStreak: number; longestStreak: number }> {
    await this.ensureConnection();
    
    const streakData = await UserStreak.findOne({ user_id: userId });
    return {
      currentStreak: streakData?.current_streak || 0,
      longestStreak: streakData?.longest_streak || 0
    };
  }

  // Update module progress
  static async updateModuleProgress(
    userId: string, 
    moduleId: string, 
    progressPercentage: number, 
    completed: boolean = false
  ): Promise<void> {
    await this.ensureConnection();
    
    await ModuleProgress.findOneAndUpdate(
      { user_id: userId, module_id: moduleId },
      {
        progress_percentage: progressPercentage,
        completed,
        completed_at: completed ? new Date() : undefined,
        updated_at: new Date()
      },
      { upsert: true }
    );
  }

  // Get module progress
  static async getModuleProgress(userId: string, moduleId: string): Promise<any> {
    await this.ensureConnection();
    
    const progress = await ModuleProgress.findOne({ 
      user_id: userId, 
      module_id: moduleId 
    });
    
    return progress ? progress.toObject() : null;
  }

  // Get all module progress for user
  static async getAllModuleProgress(userId: string): Promise<any[]> {
    await this.ensureConnection();
    
    const progress = await ModuleProgress.find({ user_id: userId });
    return progress.map(p => p.toObject());
  }

  // Record quiz attempt
  static async recordQuizAttempt(
    userId: string,
    quizId: string,
    moduleId: string,
    score: number,
    totalQuestions: number,
    timeTakenSeconds: number,
    answers: any,
    passed: boolean
  ): Promise<void> {
    await this.ensureConnection();
    
    await QuizAttempt.create({
      user_id: userId,
      quiz_id: quizId,
      module_id: moduleId,
      score,
      total_questions: totalQuestions,
      time_taken_seconds: timeTakenSeconds,
      answers,
      passed
    });
  }

  // Get quiz attempts for user
  static async getQuizAttempts(userId: string, moduleId?: string): Promise<any[]> {
    await this.ensureConnection();
    
    const query: any = { user_id: userId };
    if (moduleId) query.module_id = moduleId;
    
    const attempts = await QuizAttempt.find(query).sort({ created_at: -1 });
    return attempts.map(attempt => attempt.toObject());
  }

  // Add achievement
  static async addAchievement(
    userId: string,
    achievementId: string,
    title: string,
    description: string,
    pointsAwarded: number = 0
  ): Promise<void> {
    await this.ensureConnection();
    
    // Check if achievement already exists
    const existing = await Achievement.findOne({
      user_id: userId,
      achievement_id: achievementId
    });
    
    if (!existing) {
      await Achievement.create({
        user_id: userId,
        achievement_id: achievementId,
        title,
        description,
        points_awarded: pointsAwarded
      });
      
      // Add points if awarded
      if (pointsAwarded > 0) {
        await this.addPoints(userId, pointsAwarded, 'achievement', title);
      }
    }
  }

  // Get user achievements
  static async getAchievements(userId: string): Promise<any[]> {
    await this.ensureConnection();
    
    const achievements = await Achievement.find({ user_id: userId }).sort({ unlocked_at: -1 });
    return achievements.map(achievement => achievement.toObject());
  }

  // Unlock avatar
  static async unlockAvatar(userId: string, avatarId: string, avatarName: string): Promise<void> {
    await this.ensureConnection();
    
    // Check if avatar already unlocked
    const existing = await AvatarUnlock.findOne({
      user_id: userId,
      avatar_id: avatarId
    });
    
    if (!existing) {
      await AvatarUnlock.create({
        user_id: userId,
        avatar_id: avatarId,
        avatar_name: avatarName
      });
    }
  }

  // Get unlocked avatars
  static async getUnlockedAvatars(userId: string): Promise<any[]> {
    await this.ensureConnection();
    
    const avatars = await AvatarUnlock.find({ user_id: userId }).sort({ unlocked_at: -1 });
    return avatars.map(avatar => avatar.toObject());
  }

  // Get comprehensive user stats
  static async getUserStats(userId: string): Promise<UserStats> {
    await this.ensureConnection();
    
    const [
      totalPoints,
      streakData,
      moduleProgress,
      achievements,
      quizAttempts
    ] = await Promise.all([
      this.getTotalPoints(userId),
      this.getStreak(userId),
      ModuleProgress.countDocuments({ user_id: userId, completed: true }),
      Achievement.countDocuments({ user_id: userId }),
      QuizAttempt.find({ user_id: userId })
    ]);
    
    // Calculate average quiz score
    let averageQuizScore = 0;
    if (quizAttempts.length > 0) {
      const totalScore = quizAttempts.reduce((sum, attempt) => {
        return sum + (attempt.score / attempt.total_questions * 100);
      }, 0);
      averageQuizScore = Math.round(totalScore / quizAttempts.length);
    }
    
    return {
      totalPoints,
      currentStreak: streakData.currentStreak,
      longestStreak: streakData.longestStreak,
      completedModules: moduleProgress,
      totalAchievements: achievements,
      averageQuizScore
    };
  }
}