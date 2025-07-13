import { useState, useEffect, useCallback } from 'react';
import type { LearningMode, GameState, UserProgress, SessionStats, ContentType } from './types';
import { loadCSVData, loadVerbData } from './utils/csvParser';
import { fuzzyMatch } from './utils/fuzzyMatch';
import { WordManager } from './utils/wordManager';
import { VerbManager } from './utils/verbManager';
import { loadProgress, updateProgress, resetProgress } from './utils/storage';
import { useTheme } from './contexts/ThemeContext';

// Components
import WordCard from './components/WordCard';
import VerbCard from './components/VerbCard';
import InputField from './components/InputField';
import ModeToggle from './components/ModeToggle';
import ContentTypeSwitcher from './components/ContentTypeSwitcher';
import ProgressIndicator from './components/ProgressIndicator';
import StatsDashboard from './components/StatsDashboard';
import ThemeChooser from './components/ThemeChooser';

function App() {
  const { theme, setTheme } = useTheme();
  const [gameState, setGameState] = useState<GameState>({
    currentWord: null,
    currentVerb: null,
    mode: 'nl-en',
    contentType: 'words',
    currentVerbForm: null,
    feedback: null,
    sessionStats: { correct: 0, total: 0, accuracy: 0, streak: 0 },
    isLoading: true,
    error: null
  });
  
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);

  const [userProgress, setUserProgress] = useState<UserProgress>(loadProgress());
  const [wordManager, setWordManager] = useState<WordManager | null>(null);
  const [verbManager, setVerbManager] = useState<VerbManager | null>(null);
  const [showStats, setShowStats] = useState(false);

  // Initialize the app and load CSV data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setGameState(prev => ({ ...prev, isLoading: true, error: null }));

        // Load both words and verbs data
        const [words, verbs] = await Promise.all([
          loadCSVData('/data/dutch_common_words.csv'),
          loadVerbData('/data/dutch_irregular_verbs.csv')
        ]);

        console.log('Loaded words:', words.length);
        console.log('Loaded verbs:', verbs.length);

        const wordMgr = new WordManager(words);
        const verbMgr = new VerbManager(verbs);

        setWordManager(wordMgr);
        setVerbManager(verbMgr);

        const firstWord = wordMgr.getCurrentWord();
        setGameState(prev => ({
          ...prev,
          currentWord: firstWord,
          isLoading: false
        }));
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setGameState(prev => ({
          ...prev,
          error: 'Failed to load vocabulary data. Please refresh the page.',
          isLoading: false
        }));
      }
    };

    initializeApp();
  }, []);

  // Calculate session statistics
  const updateSessionStats = useCallback((stats: SessionStats): SessionStats => {
    const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    return { ...stats, accuracy };
  }, []);

  // Handle answer submission
  const handleAnswerSubmit = useCallback((userAnswer: string) => {
    if (gameState.contentType === 'words') {
      if (!gameState.currentWord || !wordManager) return;

      const correctAnswer = wordManager.getCorrectAnswer(gameState.currentWord, gameState.mode);
      const isCorrect = fuzzyMatch(userAnswer, correctAnswer);

      // Update session stats
      const newSessionStats = updateSessionStats({
        correct: gameState.sessionStats.correct + (isCorrect ? 1 : 0),
        total: gameState.sessionStats.total + 1,
        streak: isCorrect ? gameState.sessionStats.streak + 1 : 0,
        accuracy: 0 // Will be calculated in updateSessionStats
      });

      // Update user progress
      const newProgress = updateProgress(userProgress, isCorrect, newSessionStats.streak);
      setUserProgress(newProgress);

      // Set feedback and store correct answer if wrong
      setGameState(prev => ({
        ...prev,
        feedback: isCorrect ? 'correct' : 'incorrect',
        sessionStats: newSessionStats
      }));

      // Store correct answer for display if the answer was wrong
      if (!isCorrect) {
        setCorrectAnswer(correctAnswer);
      }

      // Move to next word after feedback delay
      setTimeout(() => {
        const nextWord = wordManager.getNextWord();
        setGameState(prev => ({
          ...prev,
          currentWord: nextWord,
          feedback: null
        }));
        // Clear correct answer when moving to next word
        setCorrectAnswer(null);
      }, 1500);
    } else if (gameState.contentType === 'verbs') {
      if (!gameState.currentVerb || !verbManager || !gameState.currentVerbForm) return;

      const correctAnswer = verbManager.getCorrectAnswer(gameState.currentVerb, gameState.currentVerbForm);
      const isCorrect = fuzzyMatch(userAnswer, correctAnswer);

      // Update session stats
      const newSessionStats = updateSessionStats({
        correct: gameState.sessionStats.correct + (isCorrect ? 1 : 0),
        total: gameState.sessionStats.total + 1,
        streak: isCorrect ? gameState.sessionStats.streak + 1 : 0,
        accuracy: 0
      });

      // Update user progress
      const newProgress = updateProgress(userProgress, isCorrect, newSessionStats.streak);
      setUserProgress(newProgress);

      // Set feedback and store correct answer if wrong
      setGameState(prev => ({
        ...prev,
        feedback: isCorrect ? 'correct' : 'incorrect',
        sessionStats: newSessionStats
      }));

      // Store correct answer for display if the answer was wrong
      if (!isCorrect) {
        setCorrectAnswer(correctAnswer);
      }

      // Move to next verb after feedback delay
      setTimeout(() => {
        const nextVerb = verbManager.getNextVerb();
        const nextVerbForm = verbManager.getRandomVerbForm();
        setGameState(prev => ({
          ...prev,
          currentVerb: nextVerb,
          currentVerbForm: nextVerbForm,
          feedback: null
        }));
        // Clear correct answer when moving to next verb
        setCorrectAnswer(null);
      }, 1500);
    }
  }, [gameState.currentWord, gameState.currentVerb, gameState.mode, gameState.contentType, gameState.currentVerbForm, gameState.sessionStats, wordManager, verbManager, userProgress, updateSessionStats]);

  // Handle mode change
  const handleModeChange = useCallback((newMode: LearningMode) => {
    setGameState(prev => ({
      ...prev,
      mode: newMode,
      feedback: null
    }));
  }, []);

  // Handle content type change
  const handleContentTypeChange = useCallback((newContentType: ContentType) => {
    if (newContentType === 'words') {
      if (!wordManager) return;
      const firstWord = wordManager.getCurrentWord();
      setGameState(prev => ({
        ...prev,
        contentType: newContentType,
        currentWord: firstWord,
        currentVerb: null,
        currentVerbForm: null,
        feedback: null
      }));
    } else if (newContentType === 'verbs') {
      if (!verbManager) return;
      const firstVerb = verbManager.getCurrentVerb();
      const firstVerbForm = verbManager.getRandomVerbForm();
      setGameState(prev => ({
        ...prev,
        contentType: newContentType,
        currentWord: null,
        currentVerb: firstVerb,
        currentVerbForm: firstVerbForm,
        feedback: null
      }));
    }
  }, [wordManager, verbManager]);

  // Handle progress reset
  const handleResetProgress = useCallback(() => {
    const resetUserProgress = resetProgress();
    setUserProgress(resetUserProgress);
    setGameState(prev => ({
      ...prev,
      sessionStats: { correct: 0, total: 0, accuracy: 0, streak: 0 }
    }));
  }, []);


  if (gameState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🔄</div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Dutch Words...</h2>
          <p className="text-white text-opacity-70">Getting ready for your learning session 📚</p>
        </div>
      </div>
    );
  }

  if (gameState.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
          <p className="text-white text-opacity-70 mb-4">{gameState.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105"
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-primary">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary flex items-center space-x-2">
          <span>Dutch Learning</span>
        </h1>
        <div className="flex items-center space-x-4">
          <ThemeChooser
            currentTheme={theme}
            onThemeChange={setTheme}
          />
          <button
            onClick={() => setShowStats(!showStats)}
            className="btn-primary px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 text-sm font-medium"
          >
            Stats
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {showStats ? (
            <div className="max-w-md mx-auto animate-fade-in">
              <StatsDashboard
                progress={userProgress}
                onReset={handleResetProgress}
              />
              <button
                onClick={() => setShowStats(false)}
                className="w-full mt-4 btn-primary font-medium px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105"
              >
                🔙 Back to Learning
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 items-start">
              {/* Content Type Switcher and Mode Toggle */}
              <div className="flex flex-col space-y-4">
                <ContentTypeSwitcher
                  contentType={gameState.contentType}
                  onContentTypeChange={handleContentTypeChange}
                  disabled={gameState.feedback !== null}
                />
                {gameState.contentType === 'words' && (
                  <ModeToggle
                    mode={gameState.mode}
                    onModeChange={handleModeChange}
                    disabled={gameState.feedback !== null}
                  />
                )}
              </div>

              {/* Main Learning Area */}
              <div className="space-y-6">
                {gameState.contentType === 'words' ? (
                  <WordCard
                    word={gameState.currentWord}
                    mode={gameState.mode}
                    feedback={gameState.feedback}
                    correctAnswer={correctAnswer || undefined}
                  />
                ) : (
                  <VerbCard
                    verb={gameState.currentVerb}
                    verbForm={gameState.currentVerbForm}
                    verbFormLabel={gameState.currentVerbForm && verbManager ? verbManager.getVerbFormLabel(gameState.currentVerbForm) : ''}
                    feedback={gameState.feedback}
                    correctAnswer={correctAnswer || undefined}
                  />
                )}

                <div className="flex justify-center">
                  <InputField
                    onSubmit={handleAnswerSubmit}
                    feedback={gameState.feedback}
                    disabled={gameState.feedback !== null}
                    placeholder={gameState.contentType === 'words'
                      ? `Type ${gameState.mode === 'nl-en' ? 'English' : 'Dutch'} translation...`
                      : `Type the ${gameState.currentVerbForm && verbManager ? verbManager.getVerbFormLabel(gameState.currentVerbForm).toLowerCase() : 'verb form'}...`
                    }
                  />
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="flex justify-center md:justify-end">
                <ProgressIndicator
                  sessionStats={gameState.sessionStats}
                  className="w-full max-w-xs"
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-muted text-sm">
        <p>Built with ❤️ for Dutch language learners • Press Enter to submit answers</p>
      </footer>
    </div>
  );
}

export default App;
