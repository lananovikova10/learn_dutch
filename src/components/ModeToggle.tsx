import type { LearningMode } from '../types';

interface ModeToggleProps {
  mode: LearningMode;
  onModeChange: (mode: LearningMode) => void;
  disabled?: boolean;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onModeChange, disabled = false }) => {
    const modes = [
    { value: 'nl-en' as LearningMode, label: '🇳🇱 → 🇬🇧', description: 'Dutch to English' },
    { value: 'en-nl' as LearningMode, label: '🇬🇧 → 🇳🇱', description: 'English to Dutch' },
  ];

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="text-secondary-light text-sm font-medium">
        Learning Mode
      </div>

      <div className="card-bg rounded-xl p-1 flex">
        {modes.map((modeOption) => (
          <button
            key={modeOption.value}
            onClick={() => !disabled && onModeChange(modeOption.value)}
            disabled={disabled}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
              ${mode === modeOption.value
                ? 'bg-white bg-opacity-90 text-gray-900 shadow-lg font-semibold'
                : 'text-primary-light hover:bg-white hover:bg-opacity-20'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
            `}
            title={modeOption.description}
          >
            <div className="flex flex-col items-center space-y-1">
              <span className="text-lg">{modeOption.label}</span>
              <span className={`text-xs ${mode === modeOption.value ? 'text-gray-600' : 'opacity-70'}`}>
                {modeOption.value === 'nl-en' ? 'NL → EN' : 'EN → NL'}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="text-muted-light text-xs text-center max-w-xs">
        {mode === 'nl-en'
          ? 'You\'ll see Dutch words and type English translations'
          : 'You\'ll see English words and type Dutch translations'
        }
      </div>
    </div>
  );
};

export default ModeToggle;