import type { UserProgress } from '../types';

const STORAGE_KEY = 'dutch-learning-progress';

const defaultProgress: UserProgress = {
  correctAnswers: 0,
  totalAnswers: 0,
  currentStreak: 0,
  bestStreak: 0,
  wordsLearned: 0,
  lastSessionDate: new Date().toISOString(),
  // Hint-related statistics
  totalHintsUsed: 0,
  questionsWithHints: 0,
  hintsPerSession: [],
};

export const loadProgress = (): UserProgress => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultProgress, ...parsed };
    }
  } catch (error) {
    console.error('Error loading progress:', error);
  }
  return defaultProgress;
};

export const saveProgress = (progress: UserProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

export const updateProgress = (
  currentProgress: UserProgress,
  isCorrect: boolean,
  currentStreak: number,
  hintsUsedForQuestion: number = 0
): UserProgress => {
  const newProgress: UserProgress = {
    ...currentProgress,
    correctAnswers: currentProgress.correctAnswers + (isCorrect ? 1 : 0),
    totalAnswers: currentProgress.totalAnswers + 1,
    currentStreak: isCorrect ? currentStreak : 0,
    bestStreak: Math.max(currentProgress.bestStreak, isCorrect ? currentStreak : 0),
    wordsLearned: currentProgress.wordsLearned + (isCorrect ? 1 : 0),
    lastSessionDate: new Date().toISOString(),
    // Update hint statistics
    totalHintsUsed: currentProgress.totalHintsUsed + hintsUsedForQuestion,
    questionsWithHints: currentProgress.questionsWithHints + (hintsUsedForQuestion > 0 ? 1 : 0),
    hintsPerSession: [...currentProgress.hintsPerSession.slice(-9), hintsUsedForQuestion], // Keep last 10 sessions
  };

  saveProgress(newProgress);
  return newProgress;
};

export const resetProgress = (): UserProgress => {
  const resetProgress = { ...defaultProgress };
  saveProgress(resetProgress);
  return resetProgress;
};

export const getAccuracy = (progress: UserProgress): number => {
  if (progress.totalAnswers === 0) return 0;
  return Math.round((progress.correctAnswers / progress.totalAnswers) * 100);
};

export const getHintStats = (progress: UserProgress): {
  averageHintsPerQuestion: number;
  hintUsagePercentage: number;
  recentHintTrend: number;
} => {
  try {
    // Validate input
    if (!progress || typeof progress !== 'object') {
      console.warn('Storage: Invalid progress data provided for hint stats');
      return {
        averageHintsPerQuestion: 0,
        hintUsagePercentage: 0,
        recentHintTrend: 0
      };
    }
    
    const totalAnswers = progress.totalAnswers || 0;
    const totalHintsUsed = progress.totalHintsUsed || 0;
    const questionsWithHints = progress.questionsWithHints || 0;
    const hintsPerSession = progress.hintsPerSession || [];
    
    const averageHintsPerQuestion = totalAnswers > 0 
      ? totalHintsUsed / totalAnswers 
      : 0;
    
    const hintUsagePercentage = totalAnswers > 0 
      ? (questionsWithHints / totalAnswers) * 100 
      : 0;
    
    // Calculate recent hint trend (last 5 sessions vs previous 5)
    const recentSessions = hintsPerSession.slice(-5);
    const previousSessions = hintsPerSession.slice(-10, -5);
    
    const recentAverage = recentSessions.length > 0 
      ? recentSessions.reduce((sum, hints) => sum + (hints || 0), 0) / recentSessions.length 
      : 0;
    
    const previousAverage = previousSessions.length > 0 
      ? previousSessions.reduce((sum, hints) => sum + (hints || 0), 0) / previousSessions.length 
      : 0;
    
    const recentHintTrend = previousAverage > 0 
      ? ((recentAverage - previousAverage) / previousAverage) * 100 
      : 0;
    
    return {
      averageHintsPerQuestion: Math.round(averageHintsPerQuestion * 100) / 100,
      hintUsagePercentage: Math.round(hintUsagePercentage),
      recentHintTrend: Math.round(recentHintTrend)
    };
  } catch (error) {
    console.error('Storage: Error calculating hint stats:', error);
    return {
      averageHintsPerQuestion: 0,
      hintUsagePercentage: 0,
      recentHintTrend: 0
    };
  }
};