import Papa from 'papaparse';
import type { WordPair } from '../types';

export const loadCSVData = async (csvPath: string): Promise<WordPair[]> => {
  try {
    const response = await fetch(csvPath);
    const csvText = await response.text();
    
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.toLowerCase().trim()
    });

    if (parsed.errors.length > 0) {
      console.error('CSV parsing errors:', parsed.errors);
      throw new Error('Failed to parse CSV data');
    }

    const wordPairs: WordPair[] = parsed.data.map((row: any) => ({
      dutch: row.dutch?.trim() || '',
      english: row.english?.trim() || ''
    })).filter(pair => pair.dutch && pair.english);

    if (wordPairs.length === 0) {
      throw new Error('No valid word pairs found in CSV');
    }

    return wordPairs;
  } catch (error) {
    console.error('Error loading CSV data:', error);
    throw error;
  }
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};