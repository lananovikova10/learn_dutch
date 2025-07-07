import type { UserProgress } from '../types';

const STORAGE_KEY = 'dutch-learning-progress';

const defaultProgress: UserProgress = {
  correctAnswers: 0,
  totalAnswers: 0,
  currentStreak: 0,
  bestStreak: 0,
  wordsLearned: 0,
  lastSessionDate: new Date().toISOString(),
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
  currentStreak: number
): UserProgress => {
  const newProgress: UserProgress = {
    ...currentProgress,
    correctAnswers: currentProgress.correctAnswers + (isCorrect ? 1 : 0),
    totalAnswers: currentProgress.totalAnswers + 1,
    currentStreak: isCorrect ? currentStreak : 0,
    bestStreak: Math.max(currentProgress.bestStreak, isCorrect ? currentStreak : 0),
    wordsLearned: currentProgress.wordsLearned + (isCorrect ? 1 : 0),
    lastSessionDate: new Date().toISOString(),
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