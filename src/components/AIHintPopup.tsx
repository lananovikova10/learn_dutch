import { useState, useEffect } from 'react';
import { aiHintService } from '../services/aiHintService';
import type { LearningMode } from '../types';

interface AIHintPopupProps {
  word: string;
  translation: string;
  mode: LearningMode;
  isVisible: boolean;
  onClose?: () => void;
}

const AIHintPopup: React.FC<AIHintPopupProps> = ({ 
  word, 
  translation, 
  mode, 
  isVisible,
  onClose 
}) => {
  const [exampleSentence, setExampleSentence] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isVisible && word && translation) {
      generateHint();
    }
  }, [isVisible, word, translation, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const generateHint = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Determine which language to generate the sentence in
      const targetLang = mode === 'nl-en' ? 'dutch' : 'english';
      const sentence = await aiHintService.generateExampleSentence(
        word, 
        translation, 
        targetLang
      );
      setExampleSentence(sentence);
    } catch (err) {
      setError('Failed to generate example sentence');
      console.error('Hint generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="absolute z-50 bg-gray-900 bg-opacity-95 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-white border-opacity-20 min-w-64 max-w-sm">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wide">
            Example Sentence
          </h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors ml-2"
              aria-label="Close hint"
            >
              ×
            </button>
          )}
        </div>
        
        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-300">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-300 border-t-transparent"></div>
            <span className="text-sm">Generating example...</span>
          </div>
        )}
        
        {error && (
          <div className="text-red-400 text-sm">
            {error}
          </div>
        )}
        
        {exampleSentence && !isLoading && !error && (
          <div className="space-y-2">
            <p className="text-white text-sm leading-relaxed">
              "{exampleSentence}"
            </p>
            <div className="text-xs text-gray-400">
              Word: <span className="text-blue-300">{word}</span> → <span className="text-green-300">{translation}</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Pointer/arrow */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2">
        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900 border-t-opacity-95"></div>
      </div>
    </div>
  );
};

export default AIHintPopup;