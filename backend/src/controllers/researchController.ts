import { Request, Response } from 'express';
import { InvestmentAgent } from '../agents/investmentAgent';
// import { GeminiService } from '../services/geminiService'; // Original raw API service
import { LangChainService } from '../services/langchainService'; // LangChain service for bonus points
import { CompanyResearchReport, ResearchRequest } from '../types';

const reports = new Map<string, CompanyResearchReport>();

// Using LangChainService (drop-in replacement for GeminiService)
const langchainService = new LangChainService();
const investmentAgent = new InvestmentAgent(langchainService);

export const researchCompany = async (req: Request, res: Response) => {
  try {
    console.log("🚀 REQUEST BODY:", req.body);

    const { companyName } = req.body as ResearchRequest;

    if (!companyName || companyName.trim().length < 2) {
      return res.status(400).json({
        message: "Company name is required"
      });
    }

    const key = companyName.toLowerCase().trim();

    // Optional cache check (fast response)
    if (reports.has(key)) {
      console.log("📦 Returning cached report");
      return res.json(reports.get(key));
    }

    console.log("🤖 Calling Gemini agent...");

    const report = await investmentAgent.run({ companyName: key });

    console.log("✅ REPORT GENERATED");

    reports.set(key, report);

    return res.json(report);

  } catch (error: any) {
    console.error("🔥 ERROR IN researchCompany:", error);

    return res.status(500).json({
      message: error?.message || "Research failed",
    });
  }
};

export const analyzeCompany = async (req: Request, res: Response) => {
  try {
    const { companyName } = req.body as ResearchRequest;

    if (!companyName) {
      return res.status(400).json({
        message: "Company name is required"
      });
    }

    const key = companyName.toLowerCase().trim();

    // cache first
    const cached = reports.get(key);
    if (cached) {
      return res.json(cached);
    }

    console.log("🤖 Running analysis via Gemini agent...");

    const report = await investmentAgent.run({ companyName: key });

    reports.set(key, report);

    return res.json(report);

  } catch (error: any) {
    console.error("🔥 ERROR IN analyzeCompany:", error);

    return res.status(500).json({
      message: error?.message || "Analysis failed",
    });
  }
};

export const getReport = async (req: Request, res: Response) => {
  try {
    const { company } = req.params;

    const companyName = (Array.isArray(company) ? company[0] : company)
      ?.toLowerCase()
      .trim();

    if (!companyName) {
      return res.status(400).json({
        message: "Invalid company name"
      });
    }

    const report = reports.get(companyName);

    if (!report) {
      return res.status(404).json({
        message: "Report not found"
      });
    }

    return res.json(report);

  } catch (error: any) {
    console.error("🔥 ERROR IN getReport:", error);

    return res.status(500).json({
      message: error?.message || "Failed to fetch report"
    });
  }
};