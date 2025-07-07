import type { WordPair, LearningMode, FeedbackType } from '../types';

interface WordCardProps {
  word: WordPair | null;
  mode: LearningMode;
  feedback: FeedbackType;
  isLoading?: boolean;
}

const WordCard: React.FC<WordCardProps> = ({ word, mode, feedback, isLoading = false }) => {
    if (isLoading) {
      return (
        <div className="card-bg rounded-xl p-8 text-center animate-pulse">
          <div className="h-16 bg-white bg-opacity-20 rounded-lg mb-4"></div>
          <div className="h-4 bg-white bg-opacity-10 rounded w-32 mx-auto"></div>
        </div>
      );
    }

    if (!word) {
      return (
        <div className="card-bg rounded-xl p-8 text-center">
          <div className="text-primary-light text-opacity-60">
            No words available 😕
          </div>
        </div>
      );
    }

    const displayWord = mode === 'nl-en' ? word.dutch : word.english;
    const sourceLanguage = mode === 'nl-en' ? 'Dutch' : 'English';
    const targetLanguage = mode === 'nl-en' ? 'English' : 'Dutch';

    const getFeedbackClasses = (): string => {
      switch (feedback) {
        case 'correct':
          return 'feedback-correct border-green-300 card-bg';
        case 'incorrect':
          return 'feedback-incorrect border-red-300 card-bg';
        default:
          return 'card-bg border-white border-opacity-20';
      }
    };

  return (
    <div className={`${getFeedbackClasses()} rounded-xl p-8 text-center transition-all duration-300 border-2 animate-slide-up`}>
      <div className="mb-2">
        <span className="text-secondary-light text-sm font-medium uppercase tracking-wide">
          {sourceLanguage} → {targetLanguage}
        </span>
      </div>

      <div className="mb-6">
        <h2 className="text-4xl md:text-5xl font-bold text-primary-light mb-2">
          {displayWord}
        </h2>
      </div>

      <div className="text-secondary-light text-sm">
        Translate to {targetLanguage}
      </div>
    </div>
  );
};

export default WordCard;