import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Theme, ThemeColors } from '../types/theme';
import { themes } from '../types/theme';

interface ThemeContextType {
  theme: Theme;
  themeColors: ThemeColors;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('fresher-theme');
    return (saved as Theme) || 'default';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('fresher-theme', newTheme);
  };

  const themeColors = themes[theme];

  // Apply theme styles to document
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg-gradient', themeColors.background);
    root.style.setProperty('--card-bg', themeColors.cardBg);
    root.style.setProperty('--text-primary', themeColors.textPrimary);
    root.style.setProperty('--text-secondary', themeColors.textSecondary);
    root.style.setProperty('--text-muted', themeColors.textMuted);
    root.style.setProperty('--input-bg', themeColors.inputBg);
    root.style.setProperty('--input-border', themeColors.inputBorder);
    root.style.setProperty('--button-bg', themeColors.buttonBg);
    root.style.setProperty('--button-hover', themeColors.buttonHover);
    root.style.setProperty('--progress-bar', themeColors.progressBar);
    root.style.setProperty('--correct-feedback', themeColors.correctFeedback);
    root.style.setProperty('--incorrect-feedback', themeColors.incorrectFeedback);
    root.style.setProperty('--hint-bg', themeColors.hintBg);
    root.style.setProperty('--hint-border', themeColors.hintBorder);
    root.style.setProperty('--hint-text', themeColors.hintText);
    root.style.setProperty('--stat-box-bg', themeColors.statBoxBg);
    root.style.setProperty('--stat-box-hover', themeColors.statBoxHover);
  }, [themeColors]);

  return (
    <ThemeContext.Provider value={{ theme, themeColors, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};