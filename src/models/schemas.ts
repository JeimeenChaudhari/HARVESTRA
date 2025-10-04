import mongoose from 'mongoose';

// User Profile Schema
const ProfileSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  district: String,
  panchayat: String,
  primary_crop: String,
  avatar: { type: String, default: '🌾' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// User Points Schema
const UserPointsSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  points: { type: Number, required: true },
  source: { type: String, required: true },
  description: String,
  created_at: { type: Date, default: Date.now }
});

// User Streak Schema
const UserStreakSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  current_streak: { type: Number, default: 0 },
  longest_streak: { type: Number, default: 0 },
  last_activity_date: String,
  updated_at: { type: Date, default: Date.now }
});

// Module Progress Schema
const ModuleProgressSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  module_id: { type: String, required: true },
  completed: { type: Boolean, default: false },
  progress_percentage: { type: Number, default: 0 },
  started_at: { type: Date, default: Date.now },
  completed_at: Date,
  updated_at: { type: Date, default: Date.now }
});

// Quiz Attempts Schema
const QuizAttemptSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  quiz_id: { type: String, required: true },
  module_id: { type: String, required: true },
  score: { type: Number, required: true },
  total_questions: { type: Number, required: true },
  time_taken_seconds: Number,
  answers: mongoose.Schema.Types.Mixed,
  passed: { type: Boolean, required: true },
  created_at: { type: Date, default: Date.now }
});

// Community Posts Schema
const CommunityPostSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  content: { type: String, required: true },
  topic: { type: String, default: 'General' },
  image_url: String,
  likes_count: { type: Number, default: 0 },
  comments_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Achievements Schema
const AchievementSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  achievement_id: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  points_awarded: { type: Number, default: 0 },
  unlocked_at: { type: Date, default: Date.now }
});

// Reward Redemptions Schema
const RewardRedemptionSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  reward_id: { type: String, required: true },
  reward_title: { type: String, required: true },
  points_spent: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'delivered', 'cancelled'], default: 'pending' },
  redeemed_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Avatar Unlocks Schema
const AvatarUnlockSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  avatar_id: { type: String, required: true },
  avatar_name: { type: String, required: true },
  unlocked_at: { type: Date, default: Date.now }
});

// Mission Submissions Schema
const MissionSubmissionSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  mission_id: { type: String, required: true },
  proof_description: { type: String, required: true },
  proof_image_url: String,
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  points_awarded: { type: Number, default: 0 },
  submitted_at: { type: Date, default: Date.now },
  verified_at: Date
});

// Create and export models
export const Profile = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
export const UserPoints = mongoose.models.UserPoints || mongoose.model('UserPoints', UserPointsSchema);
export const UserStreak = mongoose.models.UserStreak || mongoose.model('UserStreak', UserStreakSchema);
export const ModuleProgress = mongoose.models.ModuleProgress || mongoose.model('ModuleProgress', ModuleProgressSchema);
export const QuizAttempt = mongoose.models.QuizAttempt || mongoose.model('QuizAttempt', QuizAttemptSchema);
export const CommunityPost = mongoose.models.CommunityPost || mongoose.model('CommunityPost', CommunityPostSchema);
export const Achievement = mongoose.models.Achievement || mongoose.model('Achievement', AchievementSchema);
export const RewardRedemption = mongoose.models.RewardRedemption || mongoose.model('RewardRedemption', RewardRedemptionSchema);
export const AvatarUnlock = mongoose.models.AvatarUnlock || mongoose.model('AvatarUnlock', AvatarUnlockSchema);
export const MissionSubmission = mongoose.models.MissionSubmission || mongoose.model('MissionSubmission', MissionSubmissionSchema);