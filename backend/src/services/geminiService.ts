
import axios from 'axios';
import { config } from '../config/env';

export class GeminiService {
  private readonly apiKey: string;
  private readonly model: string;

  constructor() {
    this.apiKey = config.geminiApiKey;
    this.model = config.geminiModel;
  }

  private buildFallbackResponse(prompt: string, companyName?: string, reason?: string) {
    const note = reason
      ? `AI research is temporarily unavailable. ${reason}`
      : "AI research is temporarily unavailable because no Gemini API key is configured.";

    const fallbackReport = {
      companyName: companyName || '',
      overview: note,
      industry: 'Unable to determine industry while AI service is unavailable.',
      strengths: [],
      weaknesses: [],
      competitors: [],
      financialAnalysis: {
        revenueGrowth: 'Unavailable',
        profitability: 'Unavailable',
        businessModel: 'Unavailable',
        marketPosition: 'Unavailable',
        scalability: 'Unavailable',
      },
      marketSentiment: {
        recentNews: 'Unavailable',
        sentiment: 'Neutral',
        trends: [],
        risks: ['AI service unavailable'],
      },
      risks: ['AI service unavailable'],
      investmentDecision: 'PASS',
      confidenceScore: 0,
      reasoning: note,
      summary: note,
    };

    return JSON.stringify(fallbackReport, null, 2);
  }

  async generateResearch(prompt: string, companyName?: string) {
    if (!this.apiKey) {
      return this.buildFallbackResponse(prompt, companyName);
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      this.model
    )}:generateContent`;

    const body = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    try {
      const response = await axios.post(endpoint, body, {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': this.apiKey,
        },
      });

      const data = response.data;
      if (Array.isArray(data?.candidates) && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        const content = candidate.content;
        if (content && Array.isArray(content.parts)) {
          const textParts = content.parts
            .filter((item: any) => typeof item?.text === 'string')
            .map((item: any) => item.text);
          if (textParts.length > 0) {
            return textParts.join('\n').trim();
          }
        }
      }

      if (typeof data?.output?.[0]?.content?.[0]?.text === 'string') {
        return data.output[0].content[0].text;
      }

      return JSON.stringify(data, null, 2);
    } catch (error: any) {
      console.error('Gemini research request failed:', error?.response?.data || error?.message || error);
      const message = error?.response?.data?.error?.message || error?.message || 'The AI request failed.';
      return this.buildFallbackResponse(prompt, companyName, message);
    }
  }
}