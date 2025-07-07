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
      <div className="text-secondary text-sm font-medium">
        Learning Mode
      </div>

      <div className="card-bg rounded-xl p-2 flex space-x-2">
        {modes.map((modeOption) => (
          <button
            key={modeOption.value}
            onClick={() => !disabled && onModeChange(modeOption.value)}
            disabled={disabled}
            className={`
              px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300
              border-2
              ${mode === modeOption.value
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl border-blue-400 transform scale-105'
                : 'text-primary btn-primary border-transparent hover:border-white hover:border-opacity-30'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-102'}
            `}
            title={modeOption.description}
          >
            <div className="flex flex-col items-center space-y-1">
              <span className="text-lg font-bold">{modeOption.label}</span>
              <span className={`text-xs font-semibold ${mode === modeOption.value ? 'text-blue-100' : 'opacity-70'}`}>
                {modeOption.value === 'nl-en' ? 'NL → EN' : 'EN → NL'}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="text-muted text-xs text-center max-w-xs">
        {mode === 'nl-en'
          ? 'You\'ll see Dutch words and type English translations'
          : 'You\'ll see English words and type Dutch translations'
        }
      </div>
    </div>
  );
};

export default ModeToggle;