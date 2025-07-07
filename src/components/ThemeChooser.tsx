import { useState, useRef, useEffect } from 'react';
import type { Theme } from '../types/theme';
import { themes } from '../types/theme';

interface ThemeChooserProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  className?: string;
}

const ThemeChooser: React.FC<ThemeChooserProps> = ({
  currentTheme,
  onThemeChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const themeKeys = Object.keys(themes) as Theme[];
  const currentThemeData = themes[currentTheme];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeSelect = (theme: Theme) => {
    onThemeChange(theme);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown Trigger - Same size as Stats button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          btn-primary px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 text-sm font-medium
          flex items-center space-x-2
        "
      >
        <span>{currentThemeData.emoji}</span>
        <span>{currentThemeData.name}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="
          absolute top-full right-0 mt-2 w-48 z-50
          card-bg rounded-lg shadow-xl border border-opacity-20 border-white
          animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden
        ">
          <div className="py-1">
            {themeKeys.map((themeKey) => {
              const theme = themes[themeKey];
              const isActive = currentTheme === themeKey;

              return (
                <button
                  key={themeKey}
                  onClick={() => handleThemeSelect(themeKey)}
                  className="
                    w-full flex items-center space-x-3 px-4 py-2 text-left
                    transition-colors duration-150
                  "
                >
                  <span className="text-xl">{theme.emoji}</span>
                  <div className="flex-1">
                    <div className="font-medium text-primary">
                      {theme.name}
                    </div>
                    <div className="text-xs text-muted opacity-80">
                      {themeKey === 'default' ? 'Ocean vibes' : 'Gentle learning'}
                    </div>
                  </div>
                  {isActive && (
                    <svg className="w-4 h-4 text-primary opacity-90" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeChooser;