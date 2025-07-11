import type { WordPair, LearningMode, FeedbackType } from '../types';
import { useRef, useEffect, useState } from 'react';

interface WordCardProps {
  word: WordPair | null;
  mode: LearningMode;
  feedback: FeedbackType;
  isLoading?: boolean;
  correctAnswer?: string;
}

const WordCard: React.FC<WordCardProps> = ({ word, mode, feedback, isLoading = false, correctAnswer }) => {
  const textRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState('text-4xl md:text-5xl');

  const adjustFontSize = (text: string) => {
    if (!textRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const textElement = textRef.current;

    // Available width (container minus padding)
    const availableWidth = container.clientWidth - 64; // 32px padding on each side (p-8)

    // Font size options from largest to smallest
    const fontSizes = [
      { class: 'text-4xl md:text-5xl', size: 48 },
      { class: 'text-3xl md:text-4xl', size: 36 },
      { class: 'text-2xl md:text-3xl', size: 24 },
      { class: 'text-xl md:text-2xl', size: 20 },
      { class: 'text-lg md:text-xl', size: 18 },
      { class: 'text-base md:text-lg', size: 16 },
      { class: 'text-sm md:text-base', size: 14 }
    ];

    // Test each font size until text fits
    for (const fontOption of fontSizes) {
      textElement.className = `${fontOption.class} font-bold text-primary-light mb-2`;

      // Force reflow to get accurate measurements
      textElement.offsetHeight;

      if (textElement.scrollWidth <= availableWidth) {
        setFontSize(fontOption.class);
        return;
      }
    }

    // If even the smallest size doesn't fit, use the smallest anyway
    setFontSize('text-sm md:text-base');
  };

  useEffect(() => {
    if (word) {
      const currentDisplayWord = feedback === 'incorrect' && correctAnswer 
        ? correctAnswer 
        : mode === 'nl-en' ? word.dutch : word.english;
      // Small delay to ensure DOM is ready
      setTimeout(() => adjustFontSize(currentDisplayWord), 10);
    }
  }, [word, mode, feedback, correctAnswer]);

  // ... existing code ...

  if (!word) {
    // ... existing code ...
  }

  // Show correct answer when feedback is incorrect, otherwise show the original word
  const displayWord = feedback === 'incorrect' && correctAnswer 
    ? correctAnswer 
    : mode === 'nl-en' ? word.dutch : word.english;
  
  const sourceLanguage = mode === 'nl-en' ? 'Dutch' : 'English';
  const targetLanguage = mode === 'nl-en' ? 'English' : 'Dutch';
  
  // Show different label when displaying correct answer
  const cardLabel = feedback === 'incorrect' && correctAnswer
    ? `Correct Answer: ${targetLanguage}`
    : `${sourceLanguage} → ${targetLanguage}`;

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
    <div
      ref={containerRef}
      className={`${getFeedbackClasses()} rounded-xl p-8 text-center transition-all duration-300 border-2 animate-slide-up`}
    >
      <div className="mb-2">
        <span className="text-secondary-light text-sm font-medium uppercase tracking-wide">
          {cardLabel}
        </span>
      </div>

      <div className="mb-6">
        <h2
          ref={textRef}
          className={`${fontSize} font-bold text-primary-light mb-2 transition-all duration-200`}
        >
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