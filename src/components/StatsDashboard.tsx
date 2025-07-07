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

  return (
    <div className={`card-bg rounded-xl p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
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

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Total Answers */}
        <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {progress.totalAnswers}
          </div>
          <div className="text-xs text-gray-600 uppercase tracking-wide">
            Total Answers
          </div>
        </div>

        {/* Words Learned */}
        <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {progress.wordsLearned}
          </div>
          <div className="text-xs text-gray-600 uppercase tracking-wide">
            Words Learned
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {accuracy}%
          </div>
          <div className="text-xs text-gray-600 uppercase tracking-wide">
            Accuracy
          </div>
        </div>

        {/* Best Streak */}
        <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600 mb-1">
            {progress.bestStreak}
          </div>
          <div className="text-xs text-gray-600 uppercase tracking-wide">
            Best Streak
          </div>
        </div>
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