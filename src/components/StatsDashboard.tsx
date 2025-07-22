import type { UserProgress, WordPair } from '../types';
import { getAccuracy, getHintStats, getKnownWordsFromStorage, unmarkWordAsKnown } from '../utils/storage';
import { useState, useEffect } from 'react';

interface StatsDashboardProps {
  progress: UserProgress;
  onReset?: () => void;
  onKnownWordUnmarked?: () => void;
  className?: string;
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ progress, onReset, onKnownWordUnmarked, className = '' }) => {
    const accuracy = getAccuracy(progress);
    const hintStats = getHintStats(progress);
    const [knownWords, setKnownWords] = useState<WordPair[]>([]);

    // Load known words from localStorage
    useEffect(() => {
      const loadKnownWords = () => {
        const words = getKnownWordsFromStorage();
        setKnownWords(words);
      };
      
      loadKnownWords();
      
      // Listen for localStorage changes (in case user marks words in other tabs)
      const handleStorageChange = () => {
        loadKnownWords();
      };
      
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Handle unmarking a word
    const handleUnmarkWord = (word: WordPair) => {
      unmarkWordAsKnown(word);
      // Update local state immediately
      setKnownWords(prev => prev.filter(w => !(w.dutch === word.dutch && w.english === word.english)));
      // Notify parent component if callback provided
      if (onKnownWordUnmarked) {
        onKnownWordUnmarked();
      }
    };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown';
    }
  };

  return (
    <div className={`card-bg rounded-xl p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-800 font-bold text-lg flex items-center space-x-2">
          <span>All-Time Stats</span>
        </h2>
        {onReset && (
          <button
            onClick={onReset}
            className="text-gray-700 hover:text-gray-900
                     text-sm hover:scale-105 transition-all duration-200"
            title="Reset all progress"
          >
            Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Total Answers */}
        <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-800 mb-4">
            {progress.totalAnswers}
          </div>
          <div className="text-xs text-gray-600 uppercase tracking-wide">
            Total Answers
          </div>
        </div>

        {/* Words Learned */}
        <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-800 mb-4">
            {progress.wordsLearned}
          </div>
          <div className="text-xs text-gray-600 uppercase tracking-wide">
            Words Learned
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600 mb-4">
            {accuracy}%
          </div>
          <div className="text-xs text-gray-600 uppercase tracking-wide">
            Accuracy
          </div>
        </div>

        {/* Best Streak */}
        <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600 mb-4">
            {progress.bestStreak}
          </div>
          <div className="text-xs text-gray-600 uppercase tracking-wide">
            Best Streak
          </div>
        </div>
      </div>

      {/* Hint Statistics */}
      {progress.totalAnswers > 0 && (
        <div className="mb-4">
          <h3 className="text-gray-800 font-semibold text-sm mb-4 flex items-center space-x-2">
            <span>💡 Hint Usage</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Hints Used */}
            <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
              <div className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                {progress.totalHintsUsed}
              </div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">
                Total Hints
              </div>
            </div>

            {/* Average Hints Per Question */}
            <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
              <div className="text-lg sm:text-xl font-bold text-blue-600 mb-4">
                {hintStats.averageHintsPerQuestion}
              </div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">
                Avg Per Question
              </div>
            </div>

            {/* Questions with Hints Percentage */}
            <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
              <div className="text-lg sm:text-xl font-bold text-purple-600 mb-4">
                {hintStats.hintUsagePercentage}%
              </div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">
                Questions with Hints
              </div>
            </div>
          </div>
          
          {/* Hint Trend */}
          {hintStats.recentHintTrend !== 0 && (
            <div className="mt-4 bg-white bg-opacity-10 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-600 uppercase tracking-wide mb-4">
                Recent Hint Trend
              </div>
              <div className={`text-sm font-medium ${hintStats.recentHintTrend > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                {hintStats.recentHintTrend > 0 ? '↗' : '↘'} {Math.abs(hintStats.recentHintTrend)}%
                <span className="text-xs ml-1">
                  {hintStats.recentHintTrend > 0 ? '(using more hints)' : '(using fewer hints)'}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Known Words Section */}
      <div className="mb-4">
        <h3 className="text-gray-800 font-semibold text-sm mb-4 flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <span>✅ Known Words</span>
            <span className="text-xs text-gray-600 bg-white bg-opacity-20 rounded-full px-2 py-1">
              {knownWords.length}
            </span>
          </span>
          {knownWords.length > 0 && (
            <span className="text-xs text-gray-600">
              Click × to unmark
            </span>
          )}
        </h3>
        
        {knownWords.length === 0 ? (
          <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
            <div className="text-gray-600 text-sm">
              No words marked as known yet. Click the checkbox on word cards to mark words you already know!
            </div>
          </div>
        ) : (
          <div className="bg-white bg-opacity-10 rounded-lg p-4 max-h-48 overflow-y-auto">
            <div className="grid grid-cols-1 gap-2">
              {knownWords.map((word, index) => (
                <div 
                  key={`${word.dutch}-${word.english}-${index}`}
                  className="flex items-center justify-between bg-white bg-opacity-20 rounded-lg p-2 hover:bg-opacity-30 transition-all duration-200"
                >
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="font-medium text-gray-800 text-sm">
                      {word.dutch}
                    </span>
                    <span className="text-gray-600 text-xs">→</span>
                    <span className="text-gray-700 text-sm">
                      {word.english}
                    </span>
                  </div>
                  <button
                    onClick={() => handleUnmarkWord(word)}
                    className="text-gray-500 hover:text-red-600 text-sm font-bold ml-2 hover:scale-110 transition-all duration-200"
                    title={`Unmark "${word.dutch}" as known`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Last Session */}
      <div className="bg-white bg-opacity-10 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-gray-800 font-medium text-sm">Last Session</span>
          </div>
          <div className="text-gray-600 text-sm">
            {formatDate(progress.lastSessionDate)}
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="mt-4 text-center">
        <div className="text-gray-600 text-sm">
          {progress.totalAnswers === 0 && "Start learning to see your progress!"}
          {progress.totalAnswers > 0 && accuracy >= 90 && "Amazing work! You're a Dutch master!"}
          {progress.totalAnswers > 0 && accuracy >= 70 && accuracy < 90 && "Great progress! Keep it up!"}
          {progress.totalAnswers > 0 && accuracy < 70 && "Every mistake is a step toward improvement!"}
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;