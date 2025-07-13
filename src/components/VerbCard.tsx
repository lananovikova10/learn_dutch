import type { VerbPair, VerbForm, FeedbackType } from '../types';
import { useRef, useEffect, useState } from 'react';

interface VerbCardProps {
  verb: VerbPair | null;
  verbForm: VerbForm | null;
  verbFormLabel: string;
  feedback: FeedbackType;
  correctAnswer?: string;
}

const VerbCard: React.FC<VerbCardProps> = ({
  verb,
  verbForm,
  verbFormLabel,
  feedback,
  correctAnswer
}) => {
  const textRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState('text-4xl md:text-5xl');

  const adjustFontSize = () => {
    if (!textRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const textElement = textRef.current;

    const availableWidth = container.clientWidth - 64;

    const fontSizes = [
      { class: 'text-4xl md:text-5xl', size: 48 },
      { class: 'text-3xl md:text-4xl', size: 36 },
      { class: 'text-2xl md:text-3xl', size: 24 },
      { class: 'text-xl md:text-2xl', size: 20 },
      { class: 'text-lg md:text-xl', size: 18 },
      { class: 'text-base md:text-lg', size: 16 },
      { class: 'text-sm md:text-base', size: 14 }
    ];

    for (const fontOption of fontSizes) {
      textElement.className = `${fontOption.class} font-bold text-primary-light mb-2`;
      textElement.offsetHeight;

      if (textElement.scrollWidth <= availableWidth) {
        setFontSize(fontOption.class);
        return;
      }
    }

    setFontSize('text-sm md:text-base');
  };

  useEffect(() => {
    if (verb) {
      setTimeout(() => adjustFontSize(), 10);
    }
  }, [verb, verbForm, feedback, correctAnswer]);

  if (!verb || !verbForm) {
    return (
      <div className="card-bg rounded-xl p-8 text-center border-2 border-white border-opacity-20">
        <div className="animate-pulse">
          <div className="h-4 bg-white bg-opacity-20 rounded mb-4"></div>
          <div className="h-16 bg-white bg-opacity-20 rounded mb-4"></div>
          <div className="h-4 bg-white bg-opacity-20 rounded"></div>
        </div>
      </div>
    );
  }

  const displayWord = feedback === 'incorrect' && correctAnswer
    ? correctAnswer
    : verb.english_infinitive;

  const cardLabel = feedback === 'incorrect' && correctAnswer
    ? `Correct Answer: ${verbFormLabel}`
    : `English → ${verbFormLabel}`;

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

      {/*<div className="text-secondary-light text-sm">*/}
      {/*  Provide the {verbFormLabel.toLowerCase()} form*/}
      {/*</div>*/}
    </div>
  );
};

export default VerbCard;