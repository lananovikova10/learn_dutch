import type { WordPair, LearningMode } from '../types';
import { shuffleArray } from './csvParser';

export class WordManager {
  private words: WordPair[] = [];
  private currentIndex = 0;
  private shuffledWords: WordPair[] = [];
  private recentWords: WordPair[] = [];
  private readonly maxRecentWords = 5; // Prevent immediate repetition

  constructor(words: WordPair[]) {
    this.words = words;
    this.shuffleWords();
  }

  private shuffleWords(): void {
    this.shuffledWords = shuffleArray(this.words);
    this.currentIndex = 0;
  }

  getCurrentWord(): WordPair | null {
    if (this.shuffledWords.length === 0) return null;
    return this.shuffledWords[this.currentIndex];
  }

  getNextWord(): WordPair | null {
    if (this.shuffledWords.length === 0) return null;

    // Add current word to recent words
    const currentWord = this.shuffledWords[this.currentIndex];
    this.recentWords.push(currentWord);
    
    // Keep only the last few words to prevent immediate repetition
    if (this.recentWords.length > this.maxRecentWords) {
      this.recentWords.shift();
    }

    // Move to next word
    this.currentIndex++;
    
    // If we've gone through all words, reshuffle
    if (this.currentIndex >= this.shuffledWords.length) {
      this.shuffleWords();
    }

    // Try to avoid recent words if possible
    let attempts = 0;
    const maxAttempts = Math.min(10, this.shuffledWords.length);
    
    while (attempts < maxAttempts) {
      const nextWord = this.shuffledWords[this.currentIndex];
      const isRecent = this.recentWords.some(recent => 
        recent.dutch === nextWord.dutch && recent.english === nextWord.english
      );
      
      if (!isRecent || this.shuffledWords.length <= this.maxRecentWords) {
        return nextWord;
      }
      
      // Try next word
      this.currentIndex = (this.currentIndex + 1) % this.shuffledWords.length;
      attempts++;
    }

    // If we couldn't find a non-recent word, just return the current one
    return this.shuffledWords[this.currentIndex];
  }

  getWordToDisplay(word: WordPair, mode: LearningMode): string {
    return mode === 'nl-en' ? word.dutch : word.english;
  }

  getCorrectAnswer(word: WordPair, mode: LearningMode): string {
    return mode === 'nl-en' ? word.english : word.dutch;
  }

  getTotalWordsCount(): number {
    return this.words.length;
  }

  reset(): void {
    this.shuffleWords();
    this.recentWords = [];
  }
}