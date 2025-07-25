/**
 * AI service for generating example sentences using Perplexity API
 */

interface PerplexityResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
  }>;
}

class AIHintService {
  private apiKey: string | null = null;
  private cache = new Map<string, string>();
  private readonly baseUrl = 'https://api.perplexity.ai/chat/completions';

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  private getCacheKey(word: string, targetLang: 'dutch' | 'english'): string {
    return `${word}_${targetLang}`;
  }

  async generateExampleSentence(
    word: string, 
    translation: string,
    targetLang: 'dutch' | 'english'
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('API key not configured');
    }

    const cacheKey = this.getCacheKey(word, targetLang);
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const prompt = targetLang === 'dutch' 
        ? `Create a simple Dutch sentence using the word "${word}" (which means "${translation}" in English). Return only the sentence, nothing else. Make it beginner-friendly and practical.`
        : `Create a simple English sentence using the word "${word}" (which is "${translation}" in Dutch). Return only the sentence, nothing else. Make it beginner-friendly and practical.`;

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 100,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data: PerplexityResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from AI service');
      }

      const sentence = data.choices[0].message.content.trim();
      
      // Cache the result
      this.cache.set(cacheKey, sentence);
      
      return sentence;
    } catch (error) {
      console.error('AI service error:', error);
      // Return a fallback message
      return targetLang === 'dutch' 
        ? `Example sentence with "${word}" (${translation})`
        : `Example sentence with "${word}" (${translation})`;
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}

export const aiHintService = new AIHintService();