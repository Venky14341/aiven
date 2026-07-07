# Implementation Plan

## 1. Architecture Design

- Separate frontend and backend services with a REST API boundary.
- Use the backend as the AI orchestration layer and the frontend as a report presentation layer.

## 2. Folder Structure

- Backend hosts controller, service, agent, prompt, route, config, and type modules.
- Frontend hosts components, services, and dashboard views.

## 3. Step-by-Step Implementation Plan

1. Scaffold backend Express and TypeScript project.
2. Implement Gemini-based service layer and prompt builder.
3. Create research routes and controller logic.
4. Scaffold React frontend with Tailwind and Recharts.
5. Build dashboard components and API integration.
6. Verify backend and frontend builds.

## 4. LangGraph Workflow

- Step 1: research company details.
- Step 2: analyze business signals.
- Step 3: research external signals.
- Step 4: run AI reasoning.
- Step 5: generate final recommendation.

## 5. API Implementation

- POST /api/research accepts a company name and returns a report.
- POST /api/analyze reuses cached results when available.
- GET /api/report/:company returns a previously generated report.

## 6. React Component Plan

- SearchBar for input and submission.
- LoadingState for async feedback.
- CompanyCard for summary.
- ReportDashboard for overall presentation.
- RecommendationCard for final decision.
- RiskCard for risk analysis.
- Charts for signal overview.

## 7. Prompt Design Strategy

- Use a structured prompt that asks for JSON output.
- Emphasize investment criteria, strengths, weaknesses, risks, sentiment, and a clear recommendation.

## 8. Error Handling

- Validate missing company names.
- Return explicit API errors.
- Surface UI errors in the dashboard.

## 9. Deployment Guide

- Deploy backend to Render or Railway with the GEMINI_API_KEY environment variable.
- Deploy frontend to Vercel with the backend URL configured in the environment.

## 10. Trade-Offs

- The current implementation uses a simple in-memory store instead of a database for speed and simplicity.
- The AI output depends on the quality of the Gemini prompt and API access.

## 11. Future Improvements

- Add real financial APIs and news ingestion.
- Persist results in a database.
- Add authentication and user history.
- Add richer charts and comparison views.

## 12. Sample Output

Example response includes company overview, industry, competitors, strengths, weaknesses, financial analysis, risks, market sentiment, and an investment decision.
