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
    console.log('AI Hint: API key set, length:', apiKey.length, 'starts with:', apiKey.substring(0, 10) + '...');
  }

  private getCacheKey(word: string, targetLang: 'dutch' | 'english'): string {
    return `${word}_${targetLang}`;
  }

  async generateExampleSentence(
    word: string, 
    translation: string,
    targetLang: 'dutch' | 'english'
  ): Promise<string> {
    console.log('AI Hint: Generating example for word:', word, 'translation:', translation, 'targetLang:', targetLang);
    
    if (!this.apiKey) {
      console.error('AI Hint: No API key configured');
      throw new Error('API key not configured');
    }

    const cacheKey = this.getCacheKey(word, targetLang);
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      console.log('AI Hint: Found in cache:', this.cache.get(cacheKey));
      return this.cache.get(cacheKey)!;
    }

    console.log('AI Hint: Not in cache, making API request...');

    try {
      const prompt = targetLang === 'dutch' 
        ? `Create a simple Dutch sentence using the word "${word}" (which means "${translation}" in English). Return only the sentence, nothing else. Make it beginner-friendly and practical.`
        : `Create a simple English sentence using the word "${word}" (which is "${translation}" in Dutch). Return only the sentence, nothing else. Make it beginner-friendly and practical.`;

      console.log('AI Hint: Using prompt:', prompt);

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'sonar',
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
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data: PerplexityResponse = await response.json();
      console.log('AI Hint: API Response received:', data);
      
      if (!data.choices || data.choices.length === 0) {
        console.error('AI Hint: No choices in response');
        throw new Error('No response from AI service');
      }

      const sentence = data.choices[0].message.content.trim();
      console.log('AI Hint: Generated sentence:', sentence);
      
      // Cache the result
      this.cache.set(cacheKey, sentence);
      
      return sentence;
    } catch (error) {
      console.error('AI service error:', error);
      // Return a simple fallback message without translation
      return targetLang === 'dutch' 
        ? `Helaas, een voorbeeld zin kan niet worden gegenereerd.`
        : `Sorry, unable to generate an example sentence.`;
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