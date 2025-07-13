import type { VerbPair, VerbForm, VerbMode } from '../types';
import { shuffleArray } from './csvParser';

export class VerbManager {
  private verbs: VerbPair[] = [];
  private currentIndex = 0;
  private shuffledVerbs: VerbPair[] = [];
  private recentVerbs: VerbPair[] = [];
  private readonly maxRecentVerbs = 5;

  constructor(verbs: VerbPair[]) {
    this.verbs = verbs;
    this.shuffleVerbs();
  }

  private shuffleVerbs(): void {
    this.shuffledVerbs = shuffleArray(this.verbs);
    this.currentIndex = 0;
  }

  getCurrentVerb(): VerbPair | null {
    if (this.shuffledVerbs.length === 0) return null;
    return this.shuffledVerbs[this.currentIndex];
  }

  getNextVerb(): VerbPair | null {
    if (this.shuffledVerbs.length === 0) return null;

    const currentVerb = this.shuffledVerbs[this.currentIndex];
    this.recentVerbs.push(currentVerb);
    
    if (this.recentVerbs.length > this.maxRecentVerbs) {
      this.recentVerbs.shift();
    }

    this.currentIndex++;
    
    if (this.currentIndex >= this.shuffledVerbs.length) {
      this.shuffleVerbs();
    }

    let attempts = 0;
    const maxAttempts = Math.min(10, this.shuffledVerbs.length);
    
    while (attempts < maxAttempts) {
      const nextVerb = this.shuffledVerbs[this.currentIndex];
      const isRecent = this.recentVerbs.some(recent => 
        recent.english_infinitive === nextVerb.english_infinitive
      );
      
      if (!isRecent || this.shuffledVerbs.length <= this.maxRecentVerbs) {
        return nextVerb;
      }
      
      this.currentIndex = (this.currentIndex + 1) % this.shuffledVerbs.length;
      attempts++;
    }

    return this.shuffledVerbs[this.currentIndex];
  }

  getRandomVerbForm(): VerbForm {
    const forms: VerbForm[] = ['dutch_infinitive', 'imperfectum_single', 'imperfectum_plural', 'perfectum'];
    return forms[Math.floor(Math.random() * forms.length)];
  }

  getVerbFormByMode(mode: VerbMode): VerbForm {
    switch (mode) {
      case 'random':
        return this.getRandomVerbForm();
      case 'infinitive':
        return 'dutch_infinitive';
      case 'imperfectum':
        // Randomly choose between single and plural imperfectum
        return Math.random() < 0.5 ? 'imperfectum_single' : 'imperfectum_plural';
      case 'perfectum':
        return 'perfectum';
      default:
        return this.getRandomVerbForm();
    }
  }

  getVerbToDisplay(verb: VerbPair): string {
    return verb.english_infinitive;
  }

  getCorrectAnswer(verb: VerbPair, form: VerbForm): string {
    return verb[form];
  }

  getVerbFormLabel(form: VerbForm): string {
    const labels: Record<VerbForm, string> = {
      dutch_infinitive: 'Dutch infinitive',
      imperfectum_single: 'Imperfectum (single)',
      imperfectum_plural: 'Imperfectum (plural)',
      perfectum: 'Perfectum'
    };
    return labels[form];
  }

  getTotalVerbsCount(): number {
    return this.verbs.length;
  }

  reset(): void {
    this.shuffleVerbs();
    this.recentVerbs = [];
  }
}