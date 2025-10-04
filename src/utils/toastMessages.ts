import { toast } from "@/hooks/use-toast";

// Enhanced toast messages with emojis and engaging content
export const showEngagingToast = (type: string, data?: any) => {
  const toastMessages = {
    // Check-in related
    dailyCheckIn: {
      title: "🌅 Daily Check-in Successful!",
      description: "Ready for another day of sustainable farming! +10 points earned",
      duration: 4000
    },
    streakMilestone: (days: number) => ({
      title: `🔥 ${days} Day Streak Achieved!`,
      description: `You're on fire! Keep this amazing farming journey going!`,
      duration: 5000
    }),
    
    // Module completion
    moduleCompleted: (moduleName: string, points: number) => ({
      title: "🎓 Module Mastered!",
      description: `Congratulations! You've completed "${moduleName}" and earned ${points} points!`,
      duration: 6000
    }),
    firstModule: {
      title: "🌱 Your Farming Journey Begins!",
      description: "Welcome to sustainable farming! You've completed your first module!",
      duration: 6000
    },
    moduleExpert: (moduleCount: number) => ({
      title: "🏆 Learning Champion!",
      description: `Amazing! You've completed ${moduleCount} modules. You're becoming a farming expert!`,
      duration: 5000
    }),
    
    // Quiz success
    quizPassed: (score: number) => ({
      title: "✅ Quiz Passed!",
      description: `Excellent work! You scored ${score}%. Knowledge is power!`,
      duration: 4000
    }),
    perfectScore: {
      title: "🎯 Perfect Score!",
      description: "100% correct! You're truly mastering sustainable farming practices!",
      duration: 5000
    },
    quizFailed: (score: number, required: number) => ({
      title: "📚 Keep Learning!",
      description: `You scored ${score}%. You need ${required}% to pass. Don't give up!`,
      duration: 4000
    }),
    
    // Achievement unlocked
    achievementUnlocked: (achievement: string) => ({
      title: "🏅 Achievement Unlocked!",
      description: `Congratulations! You've earned the "${achievement}" badge!`,
      duration: 6000
    }),
    
    // Level progression
    levelUp: (newLevel: number) => ({
      title: "⭐ Level Up!",
      description: `Fantastic! You've reached Level ${newLevel}! Keep growing!`,
      duration: 5000
    }),
    
    // Community actions
    postCreated: {
      title: "📢 Post Shared!",
      description: "Your farming experience is now shared with the community! +10 points",
      duration: 4000
    },
    helpfulComment: {
      title: "🤝 Community Helper!",
      description: "Thanks for helping fellow farmers! +5 points earned",
      duration: 4000
    },
    
    // Rewards
    rewardRedeemed: (reward: string, points: number) => ({
      title: "🎁 Reward Redeemed!",
      description: `You've successfully redeemed "${reward}" for ${points} points!`,
      duration: 5000
    }),
    insufficientPoints: (needed: number) => ({
      title: "💰 More Points Needed",
      description: `You need ${needed} more points for this reward. Keep farming!`,
      duration: 4000
    }),
    
    // Mission completion
    missionCompleted: (mission: string, points: number) => ({
      title: "🎯 Mission Accomplished!",
      description: `Great job completing "${mission}"! You earned ${points} points!`,
      duration: 5000
    }),
    
    // Farming milestones
    seedPlanted: {
      title: "🌰 Seeds of Success!",
      description: "You've planted the seeds of sustainable farming! Watch them grow!",
      duration: 4000
    },
    harvestReady: {
      title: "🌾 Harvest Time!",
      description: "Your sustainable farming efforts are ready to harvest rewards!",
      duration: 4000
    },
    
    // Social achievements
    topLeaderboard: (rank: number) => ({
      title: "🏆 Leaderboard Champion!",
      description: `Amazing! You're now ranked #${rank} among Kerala's top farmers!`,
      duration: 6000
    }),
    
    // Gamification
    badgeCollected: (badge: string) => ({
      title: "🎖️ Badge Collected!",
      description: `You've earned the "${badge}" badge! Add it to your collection!`,
      duration: 5000
    }),
    avatarUnlocked: (avatar: string) => ({
      title: "👤 New Avatar Unlocked!",
      description: `Congratulations! You can now use the "${avatar}" avatar!`,
      duration: 5000
    }),
    
    // Seasonal/Cultural
    monsoonBonus: {
      title: "🌧️ Monsoon Bonus!",
      description: "Perfect timing with Kerala's monsoon! Extra points for water conservation!",
      duration: 5000
    },
    harvestFestival: {
      title: "🎊 Harvest Festival Bonus!",
      description: "Celebrating Kerala's rich farming heritage! Festival bonus points awarded!",
      duration: 6000
    },
    
    // Error/Warning messages with positive spin
    networkError: {
      title: "🌐 Connection Issue",
      description: "Like nature, technology needs patience. Please try again!",
      duration: 4000
    },
    tryAgain: {
      title: "🔄 Second Chances",
      description: "Every farmer knows - sometimes you need to replant. Try again!",
      duration: 4000
    },
    
    // Motivational/Encouraging
    keepGoing: {
      title: "💪 Keep Growing!",
      description: "Like crops, progress takes time. You're doing great!",
      duration: 4000
    },
    almostThere: (percentage: number) => ({
      title: "🎯 Almost There!",
      description: `You're ${percentage}% complete! Success is just around the corner!`,
      duration: 4000
    }),
    
    // Weather-related
    goodWeather: {
      title: "☀️ Perfect Farming Weather!",
      description: "Great conditions for learning about sustainable farming today!",
      duration: 4000
    },
    
    // Community milestones
    communityGrowth: (members: number) => ({
      title: "🌱 Community Growing!",
      description: `Our farming community now has ${members} members! Together we grow!`,
      duration: 5000
    })
  };

  switch (type) {
    case 'dailyCheckIn':
      return toast(toastMessages.dailyCheckIn);
    
    case 'streakMilestone':
      return toast(toastMessages.streakMilestone(data?.days || 7));
    
    case 'moduleCompleted':
      return toast(toastMessages.moduleCompleted(data?.moduleName || 'Module', data?.points || 50));
    
    case 'firstModule':
      return toast(toastMessages.firstModule);
    
    case 'moduleExpert':
      return toast(toastMessages.moduleExpert(data?.moduleCount || 5));
    
    case 'quizPassed':
      return toast(toastMessages.quizPassed(data?.score || 85));
    
    case 'perfectScore':
      return toast(toastMessages.perfectScore);
    
    case 'quizFailed':
      return toast({
        ...toastMessages.quizFailed(data?.score || 60, data?.required || 70),
        variant: "destructive"
      });
    
    case 'achievementUnlocked':
      return toast(toastMessages.achievementUnlocked(data?.achievement || 'New Achievement'));
    
    case 'levelUp':
      return toast(toastMessages.levelUp(data?.newLevel || 2));
    
    case 'postCreated':
      return toast(toastMessages.postCreated);
    
    case 'helpfulComment':
      return toast(toastMessages.helpfulComment);
    
    case 'rewardRedeemed':
      return toast(toastMessages.rewardRedeemed(data?.reward || 'Reward', data?.points || 100));
    
    case 'insufficientPoints':
      return toast({
        ...toastMessages.insufficientPoints(data?.needed || 50),
        variant: "destructive"
      });
    
    case 'missionCompleted':
      return toast(toastMessages.missionCompleted(data?.mission || 'Mission', data?.points || 100));
    
    case 'topLeaderboard':
      return toast(toastMessages.topLeaderboard(data?.rank || 1));
    
    case 'badgeCollected':
      return toast(toastMessages.badgeCollected(data?.badge || 'Special Badge'));
    
    case 'avatarUnlocked':
      return toast(toastMessages.avatarUnlocked(data?.avatar || 'New Avatar'));
    
    case 'monsoonBonus':
      return toast(toastMessages.monsoonBonus);
    
    case 'harvestFestival':
      return toast(toastMessages.harvestFestival);
    
    case 'keepGoing':
      return toast(toastMessages.keepGoing);
    
    case 'almostThere':
      return toast(toastMessages.almostThere(data?.percentage || 75));
    
    case 'communityGrowth':
      return toast(toastMessages.communityGrowth(data?.members || 100));
    
    default:
      return toast({
        title: "🌱 Harvestra",
        description: "Something good happened in your farming journey!",
        duration: 3000
      });
  }
};

// Quick access functions for common toasts
export const showSuccess = (title: string, description: string) => {
  return toast({
    title: `✅ ${title}`,
    description,
    duration: 4000
  });
};

export const showError = (title: string, description: string) => {
  return toast({
    title: `❌ ${title}`,
    description,
    variant: "destructive",
    duration: 4000
  });
};

export const showInfo = (title: string, description: string) => {
  return toast({
    title: `ℹ️ ${title}`,
    description,
    duration: 3000
  });
};

// Seasonal/contextual toasts
export const showSeasonalToast = () => {
  const now = new Date();
  const month = now.getMonth(); // 0-11
  
  // Monsoon season in Kerala (June-September)
  if (month >= 5 && month <= 8) {
    return showEngagingToast('monsoonBonus');
  }
  
  // Harvest season (November-January)
  if (month >= 10 || month <= 0) {
    return showEngagingToast('harvestFestival');
  }
  
  // Default good weather message
  return showEngagingToast('goodWeather');
};

export default showEngagingToast;