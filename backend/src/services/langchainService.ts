import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { config } from '../config/env';

export class LangChainService {
  private model: ChatGoogleGenerativeAI | null = null;

  constructor() {
    if (config.geminiApiKey) {
      this.model = new ChatGoogleGenerativeAI({
        apiKey: config.geminiApiKey,
        model: config.geminiModel || "gemini-1.5-flash",
        temperature: 0.2,
      });
    }
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

  async generateResearch(promptText: string, companyName?: string): Promise<string> {
    if (!this.model) {
      return this.buildFallbackResponse(promptText, companyName);
    }

    try {
      console.log(`🤖 [LangChain] Generating research for: ${companyName}...`);

      // Define LangChain components
      // We pass the raw prompt content directly through a PromptTemplate
      const promptTemplate = PromptTemplate.fromTemplate("{input}");
      const outputParser = new StringOutputParser();

      // Create LCEL Chain (PromptTemplate -> Model -> OutputParser)
      const chain = promptTemplate.pipe(this.model).pipe(outputParser);

      // Execute the chain
      const resultText = await chain.invoke({
        input: promptText,
      });

      return resultText.trim();
    } catch (error: any) {
      console.error('LangChain research generation failed:', error?.message || error);
      const message = error?.message || 'The LangChain request failed.';
      return this.buildFallbackResponse(promptText, companyName, message);
    }
  }
}
