export interface WordPair {
  dutch: string;
  english: string;
}

export interface UserProgress {
  correctAnswers: number;
  totalAnswers: number;
  currentStreak: number;
  bestStreak: number;
  wordsLearned: number;
  lastSessionDate: string;
}

export interface SessionStats {
  correct: number;
  total: number;
  accuracy: number;
  streak: number;
}

export type LearningMode = 'nl-en' | 'en-nl';

export type FeedbackType = 'correct' | 'incorrect' | null;

export interface GameState {
  currentWord: WordPair | null;
  mode: LearningMode;
  feedback: FeedbackType;
  sessionStats: SessionStats;
  isLoading: boolean;
  error: string | null;
}