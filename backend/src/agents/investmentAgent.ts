import { GeminiService } from '../services/geminiService';
import { CompanyResearchReport, ResearchRequest } from '../types';
import { buildInvestmentPrompt } from '../prompts/investmentPrompt';

export class InvestmentAgent {
  constructor(private geminiService: GeminiService) {}

  async run(request: ResearchRequest): Promise<CompanyResearchReport> {
    const companyName = request.companyName?.trim();

    if (!companyName) {
      throw new Error("Company name is required");
    }

    const prompt = buildInvestmentPrompt(companyName);
    const aiResponse = await this.geminiService.generateResearch(prompt, companyName);

    return this.parseReport(aiResponse, companyName);
  }

  private parseReport(aiResponse: string, companyName: string): CompanyResearchReport {
    const defaultReport: CompanyResearchReport = {
      companyName,
      overview: aiResponse,
      reportText: aiResponse,
      industry: 'Unknown',
      strengths: [],
      weaknesses: [],
      competitors: [],
      financialAnalysis: {
        revenueGrowth: '',
        profitability: '',
        businessModel: '',
        marketPosition: '',
        scalability: '',
      },
      marketSentiment: {
        recentNews: '',
        sentiment: '',
        trends: [],
        risks: [],
      },
      risks: [],
      investmentDecision: 'Hold',
      confidenceScore: 0,
      reasoning: aiResponse,
      summary: aiResponse,
      workflow: [
        {
          step: 'AI Research',
          status: 'completed',
          details: aiResponse,
        },
      ],
    };

    try {
      let cleanedResponse = aiResponse.trim();
      if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse
          .replace(/^```(?:json)?/i, '')
          .replace(/```$/i, '')
          .trim();
      }
      const parsed = JSON.parse(cleanedResponse);

      const toString = (value: unknown) => {
        if (typeof value === 'string') return value;
        if (value == null) return '';
        return JSON.stringify(value, null, 2);
      };

      const toStringArray = (value: unknown) => {
        if (Array.isArray(value)) return value.filter(Boolean).map((item) => String(item));
        if (typeof value === 'string' && value.trim()) return [value.trim()];
        return [];
      };

      return {
        companyName,
        overview: toString(parsed.overview || parsed.companyOverview || parsed.summary || aiResponse),
        industry: toString(parsed.industry || ''),
        strengths: toStringArray(parsed.strengths),
        weaknesses: toStringArray(parsed.weaknesses),
        competitors: toStringArray(parsed.competitors),
        financialAnalysis: {
          revenueGrowth: toString(parsed.financialAnalysis?.revenueGrowth || parsed.revenueGrowth || ''),
          profitability: toString(parsed.financialAnalysis?.profitability || parsed.profitability || ''),
          businessModel: toString(parsed.financialAnalysis?.businessModel || parsed.businessModel || ''),
          marketPosition: toString(parsed.financialAnalysis?.marketPosition || parsed.marketPosition || ''),
          scalability: toString(parsed.financialAnalysis?.scalability || parsed.scalability || ''),
        },
        marketSentiment: {
          recentNews: toString(parsed.marketSentiment?.recentNews || ''),
          sentiment: toString(parsed.marketSentiment?.sentiment || ''),
          trends: toStringArray(parsed.marketSentiment?.trends),
          risks: toStringArray(parsed.marketSentiment?.risks),
        },
        risks: toStringArray(parsed.risks),
        investmentDecision: toString(parsed.investmentDecision || parsed.investmentDecisionText || 'Hold'),
        confidenceScore: Number(parsed.confidenceScore) || 0,
        reasoning: toString(parsed.reasoning || parsed.analysis || aiResponse),
        summary: toString(parsed.summary || parsed.overview || aiResponse),
        workflow: [
          {
            step: 'AI Research',
            status: 'completed',
            details: aiResponse,
          },
        ],
      };
    } catch (error) {
      console.warn('Could not parse AI response as JSON. Returning raw text fields.', error);
      return defaultReport;
    }
  }
}
