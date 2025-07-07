import type { UserProgress } from '../types';
import { getAccuracy } from '../utils/storage';

interface StatsDashboardProps {
  progress: UserProgress;
  onReset?: () => void;
  className?: string;
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ progress, onReset, className = '' }) => {
    const accuracy = getAccuracy(progress);

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

  const getStreakEmoji = (streak: number): string => {
    if (streak === 0) return '😐';
    if (streak < 5) return '🔥';
    if (streak < 10) return '🚀';
    if (streak < 20) return '⭐';
    return '👑';
  };

  const getAccuracyEmoji = (acc: number): string => {
    if (acc >= 90) return '🏆';
    if (acc >= 80) return '🎯';
    if (acc >= 70) return '👍';
    if (acc >= 60) return '📈';
    return '💪';
  };

  return (
    <div className={`card-bg rounded-xl p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-primary-light font-bold text-lg flex items-center space-x-2">
          <span>All-Time Stats</span>
        </h2>
        {onReset && (
          <button
            onClick={onReset}
            className="text-secondary-light hover:text-primary-light
                     text-sm hover:scale-105 transition-all duration-200"
            title="Reset all progress"
          >
            🔄 Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Total Answers */}
        <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
          <div className="text-2xl mb-1">📝</div>
          <div className="text-2xl font-bold text-primary-light mb-1">
            {progress.totalAnswers}
          </div>
          <div className="text-xs text-secondary-light uppercase tracking-wide">
            Total Answers
          </div>
        </div>

        {/* Words Learned */}
        <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
          <div className="text-2xl mb-1">🧠</div>
          <div className="text-2xl font-bold text-primary-light mb-1">
            {progress.wordsLearned}
          </div>
          <div className="text-xs text-secondary-light uppercase tracking-wide">
            Words Learned
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
          <div className="text-2xl mb-1">{getAccuracyEmoji(accuracy)}</div>
          <div className="text-2xl font-bold text-green-300 mb-1">
            {accuracy}%
          </div>
          <div className="text-xs text-secondary-light uppercase tracking-wide">
            Accuracy
          </div>
        </div>

        {/* Best Streak */}
        <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
          <div className="text-2xl mb-1">{getStreakEmoji(progress.bestStreak)}</div>
          <div className="text-2xl font-bold text-yellow-300 mb-1">
            {progress.bestStreak}
          </div>
          <div className="text-xs text-secondary-light uppercase tracking-wide">
            Best Streak
          </div>
        </div>
      </div>

      {/* Last Session */}
      <div className="bg-white bg-opacity-10 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🕐</span>
            <span className="text-primary-light font-medium text-sm">Last Session</span>
          </div>
          <div className="text-secondary-light text-sm">
            {formatDate(progress.lastSessionDate)}
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="mt-4 text-center">
        <div className="text-secondary-light text-sm">
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