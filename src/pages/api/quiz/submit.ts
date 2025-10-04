import type { NextApiRequest, NextApiResponse } from 'next';
import { UserService } from '@/services/userService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { 
    userId, 
    quizId, 
    moduleId, 
    score, 
    totalQuestions, 
    timeTakenSeconds, 
    answers,
    passed 
  } = req.body;

  if (!userId || !quizId || !moduleId || score === undefined || !totalQuestions) {
    return res.status(400).json({ 
      error: 'Required fields: userId, quizId, moduleId, score, totalQuestions' 
    });
  }

  try {
    // Record quiz attempt
    await UserService.recordQuizAttempt(
      userId,
      quizId,
      moduleId,
      score,
      totalQuestions,
      timeTakenSeconds || 0,
      answers || {},
      passed || false
    );

    // Award points for quiz completion
    const basePoints = 50;
    const bonusPoints = Math.floor((score / totalQuestions) * 100); // Bonus based on percentage
    const totalPoints = basePoints + bonusPoints;

    await UserService.addPoints(
      userId, 
      totalPoints, 
      'quiz_completion', 
      `Quiz: ${quizId} (${score}/${totalQuestions})`
    );

    // Update module progress
    const progressPercentage = (score / totalQuestions) * 100;
    const moduleCompleted = passed && progressPercentage >= 80;
    
    await UserService.updateModuleProgress(
      userId,
      moduleId,
      progressPercentage,
      moduleCompleted
    );

    // Update streak
    const today = new Date().toISOString().split('T')[0];
    await UserService.updateStreak(userId, today);

    // Check for achievements
    if (passed) {
      await UserService.addAchievement(
        userId,
        `quiz_passed_${moduleId}`,
        'Quiz Master',
        `Passed quiz for ${moduleId}`,
        25
      );
    }

    if (score === totalQuestions) {
      await UserService.addAchievement(
        userId,
        `perfect_score_${moduleId}`,
        'Perfect Score',
        `Got 100% on ${moduleId} quiz`,
        50
      );
    }

    return res.status(200).json({ 
      success: true, 
      pointsAwarded: totalPoints,
      passed,
      moduleCompleted
    });

  } catch (error) {
    console.error('Quiz submit API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}