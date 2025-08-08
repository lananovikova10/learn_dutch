import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { aiHintService } from '../services/aiHintService';

interface AIHintContextType {
  isConfigured: boolean;
  setApiKey: (apiKey: string) => void;
  clearApiKey: () => void;
  showConfigDialog: boolean;
  setShowConfigDialog: (show: boolean) => void;
}

const AIHintContext = createContext<AIHintContextType | undefined>(undefined);

interface AIHintProviderProps {
  children: ReactNode;
}

const API_KEY_STORAGE_KEY = 'ai_hint_api_key';

export const AIHintProvider: React.FC<AIHintProviderProps> = ({ children }) => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [showConfigDialog, setShowConfigDialog] = useState(false);

  useEffect(() => {
    // Check if API key is already stored
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedKey) {
      aiHintService.setApiKey(storedKey);
      setIsConfigured(true);
    }
  }, []);

  const setApiKey = (apiKey: string) => {
    if (apiKey.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
      aiHintService.setApiKey(apiKey.trim());
      setIsConfigured(true);
      setShowConfigDialog(false);
    }
  };

  const clearApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setIsConfigured(false);
    aiHintService.clearCache();
  };

  return (
    <AIHintContext.Provider value={{
      isConfigured,
      setApiKey,
      clearApiKey,
      showConfigDialog,
      setShowConfigDialog
    }}>
      {children}
    </AIHintContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAIHint = () => {
  const context = useContext(AIHintContext);
  if (context === undefined) {
    throw new Error('useAIHint must be used within an AIHintProvider');
  }
  return context;
};