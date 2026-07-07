export interface ResearchReport {
  companyName: string;
  overview: string;
  industry: string;
  strengths: string[];
  weaknesses: string[];
  competitors: string[];
  financialAnalysis: {
    revenueGrowth?: string;
    profitability?: string;
    businessModel?: string;
    marketPosition?: string;
    scalability?: string;
  };
  marketSentiment: {
    recentNews?: string;
    sentiment?: string;
    trends?: string[];
    risks?: string[];
  };
  risks: string[];
  investmentDecision: string;
  confidenceScore: number;
  reasoning: string;
  summary: string;
  reportText?: string;
  workflow?: Array<{
    step: string;
    status: string;
    details: string;
  }>;
}
