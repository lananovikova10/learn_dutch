import { useState, useEffect, useRef } from 'react';
import type { FeedbackType } from '../types';

interface InputFieldProps {
  onSubmit: (answer: string) => void;
  feedback: FeedbackType;
  disabled?: boolean;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
        onSubmit,
        feedback,
        disabled = false,
        placeholder = "Type your answer..."
      }) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input when component mounts or feedback resets
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled, feedback]);

  useEffect(() => {
    // Clear input after feedback is shown
    if (feedback !== null) {
      const timer = setTimeout(() => {
        setValue('');
        if (inputRef.current && !disabled) {
          inputRef.current.focus();
        }
      }, 1500); // Match the feedback display duration

      return () => clearTimeout(timer);
    }
  }, [feedback, disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSubmit(value.trim());
      setValue(''); // 🧹 Clear input immediately after submission
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim() && !disabled) {
      onSubmit(value.trim());
      setValue(''); // 🧹 Clear input immediately after submission
    }
  };

  const getFeedbackClasses = (): string => {
      switch (feedback) {
        case 'correct':
          return 'border-green-300 bg-green-500 bg-opacity-20 text-white placeholder-green-200';
        case 'incorrect':
          return 'border-red-300 bg-red-500 bg-opacity-20 text-white placeholder-red-200';
        default:
          return 'input-field text-white placeholder-white placeholder-opacity-60 border-white border-opacity-20';
      }
    };



  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="relative">


        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full pl-4 pr-4 py-4 rounded-xl text-lg font-medium border
            focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30
            transition-all duration-300
            ${getFeedbackClasses()}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-20'}
          `}
          autoComplete="off"
          spellCheck={false}
        />

        {value && !disabled && (
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2
                     bg-blue-600 hover:bg-blue-700
                     rounded-lg px-3 py-2 text-white font-medium text-sm
                     transition-all duration-200 hover:scale-105 border border-blue-500
                     shadow-lg hover:shadow-xl"
          >
            Submit ↵
          </button>
        )}
      </div>
    </form>
  );
};

export default InputField;