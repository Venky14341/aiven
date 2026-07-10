# 🚀 InvestIQ — AI Investment Research Agent

> A production-grade AI-powered investment research platform that generates comprehensive company analysis reports using Google Gemini, LangChain, and a modern React dashboard.

**Live Demo:** Frontend on Vercel · Backend on Render

---

## 📋 Table of Contents

- [Overview](#-overview)
- [How to Run It](#-how-to-run-it)
- [How It Works — Architecture](#-how-it-works--architecture)
- [Key Decisions & Trade-offs](#-key-decisions--trade-offs)
- [Example Runs](#-example-runs)
- [What I Would Improve with More Time](#-what-i-would-improve-with-more-time)
- [LLM Chat Session Transcript](#-llm-chat-session-transcript-bonus)

---

## 🔍 Overview

**InvestIQ** is a full-stack AI investment research agent. You type a company name — the agent orchestrates a multi-step AI research workflow, then delivers a rich, structured investment report covering:

| Report Section         | What It Contains                                                    |
| :--------------------- | :------------------------------------------------------------------ |
| **Company Overview**   | Origins, scale, core purpose, industry classification               |
| **Strengths**          | Competitive advantages, moats, differentiation                      |
| **Weaknesses**         | Known vulnerabilities, market headwinds                             |
| **Competitors**        | Direct and indirect competitive landscape                           |
| **Financial Analysis** | Revenue growth, profitability, business model, scalability          |
| **Market Sentiment**   | News headlines, investor pulse, bullish/bearish/neutral signal      |
| **Risk Factors**       | Regulatory, operational, market, and geopolitical risks             |
| **Investment Decision**| Buy / Accumulate / Hold / Reduce / Sell — with confidence score     |
| **Reasoning**          | The full investment thesis justifying the recommendation            |

The frontend is a premium, dark-themed dashboard with live market tickers, global exchange clocks, sector performance grids, interactive charts, and a detailed report viewer with sidebar navigation.

---

## 🏗 How to Run It

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **MySQL** (local or hosted — needed for user auth persistence)
- **Google Gemini API Key** — get one free at [Google AI Studio](https://aistudio.google.com/app/apikey)

### 1. Clone the Repository

```bash
git clone https://github.com/Venky14341/aiven.git
cd aiven
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your keys:

```env
PORT=5010
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-flash-latest
JWT_SECRET=your_strong_random_jwt_secret
JWT_EXPIRES_IN=7d
# MySQL Database Configuration
MYSQL_DATABASE=investiq
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_HOST=localhost
MYSQL_PORT=3306
FRONTEND_URL=http://localhost:5173
```

> **The only mandatory key is `GEMINI_API_KEY`.** Without it the backend still starts, but returns graceful "AI service unavailable" fallback reports. MySQL is needed only if you use real registration/login (demo login works without it).

Install dependencies and start:

```bash
npm install
npm run dev
```

The backend starts at `http://localhost:5010`.

### 3. Frontend Setup

Open a **second terminal**:

```bash
cd frontend
npm install
npm run dev
```

The frontend starts at `http://localhost:5173`. The Vite dev server is pre-configured to proxy `/api/*` requests to the backend.

### 4. Use the App

1. Open `http://localhost:5173` in your browser.
2. Click **"Demo Login"** (no credentials needed) or register a new account.
3. Type any company name (e.g. **"Apple"**, **"NVIDIA"**, **"Infosys"**) and press Research.
4. Wait ~8 seconds for the AI agent to generate your report.
5. Navigate the report sections: Overview → Financials → Sentiment → Risks → Recommendation.

---

## 🧠 How It Works — Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React + Vite)                  │
│                                                                  │
│  LoginPage → HomeTab → SearchBar → LoadingState → ReportDashboard│
│  ├── CompanyCard                                                 │
│  ├── Charts (Recharts)                                           │
│  ├── RecommendationCard                                          │
│  ├── RiskCard                                                    │
│  ├── MarketDetailsModal                                          │
│  └── EducationTab                                                │
│                                                                  │
│  Services: api.ts (Axios + JWT interceptor), authService.ts      │
└───────────────────────────┬──────────────────────────────────────┘
                            │  REST API  (POST /api/research, etc.)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Express + TypeScript)               │
│                                                                  │
│  Routes ──► Controllers ──► InvestmentAgent ──► LangChainService │
│                                                                  │
│  ┌──────────────────────────────────────────┐                    │
│  │         AI Research Workflow              │                    │
│  │                                          │                    │
│  │  Step 1: Research company details         │                    │
│  │  Step 2: Analyze business signals         │                    │
│  │  Step 3: Assess external signals          │                    │
│  │  Step 4: Run AI reasoning engine          │                    │
│  │  Step 5: Generate recommendation          │                    │
│  │                                          │                    │
│  │  [Prompt Template] → [LangChain LCEL     │                    │
│  │   Chain] → [Gemini API] → [JSON Parse]   │                    │
│  └──────────────────────────────────────────┘                    │
│                                                                  │
│  Auth: JWT + bcrypt + MySQL (Sequelize)                          │
│  Cache: In-memory Map<company, report>                           │
└─────────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer            | Technology                                              |
| :--------------- | :------------------------------------------------------ |
| **Frontend**     | React 18, TypeScript, Tailwind CSS, Recharts, Vite      |
| **Backend**      | Express 4, TypeScript, ts-node-dev                      |
| **AI Engine**    | Google Gemini (via LangChain `@langchain/google-genai`)  |
| **AI Framework** | LangChain (LCEL chains: PromptTemplate → Model → Parser) |
| **Auth**         | JWT, bcrypt, Sequelize (MySQL)                            |
| **Deployment**   | Vercel (frontend), Render (backend)                      |

### Key Backend Flow

1. **`POST /api/research`** — The user submits a company name.
2. **`researchController`** — Validates input, checks in-memory cache, delegates to `InvestmentAgent`.
3. **`InvestmentAgent.run()`** — Builds a structured prompt via `buildInvestmentPrompt()` and calls `LangChainService.generateResearch()`.
4. **`LangChainService`** — Constructs a LangChain LCEL chain (`PromptTemplate → ChatGoogleGenerativeAI → StringOutputParser`) and invokes it.
5. **Response parsing** — The agent parses the Gemini response (expected as JSON), extracts structured fields (overview, strengths, weaknesses, financials, risks, decision), and gracefully falls back to raw text if JSON parsing fails.
6. **Caching** — Successful reports are cached in-memory so repeat queries for the same company are instant.

### Prompt Engineering

The prompt in `investmentPrompt.ts` instructs Gemini to act as an **expert financial analyst** and return a strict JSON schema covering:
- Company overview, industry, strengths, weaknesses, competitors
- Financial analysis (revenue growth, profitability, business model, market position, scalability)
- Market sentiment (news, sentiment direction, trends, risks)
- Investment decision (Buy/Accumulate/Hold/Reduce/Sell) with confidence score
- A full markdown `reportText` for detailed rendering

This structured-output strategy ensures the frontend can reliably render each section in its dedicated dashboard panel.

---

## ⚖️ Key Decisions & Trade-offs

### What I Chose and Why

| Decision | Rationale |
| :--- | :--- |
| **LangChain over raw API calls** | LangChain's LCEL chain pattern (`PromptTemplate → Model → OutputParser`) is more composable, testable, and future-proof. It also earns bonus points. The raw `GeminiService` (direct `axios` to the REST API) is preserved as an alternative. |
| **Structured JSON prompt** | Instead of free-text responses, the prompt demands a strict JSON schema. This makes frontend rendering deterministic — every section (strengths, risks, financials) maps to a typed interface. |
| **In-memory cache (`Map`)** | For a demo/assignment, a `Map<string, Report>` is simple and fast. Eliminates redundant API calls for repeat queries. Trade-off: cache resets on server restart. |
| **JWT auth with demo bypass** | Full auth flow (register/login) is implemented with bcrypt + JWT + MySQL. But the middleware is currently set to **demo bypass mode** so reviewers can test instantly without MySQL setup. |
| **Custom CORS middleware** | After multiple Vercel → Render CORS issues in deployment (see git history), I replaced the `cors` npm package with a manual `Access-Control-Allow-*` middleware that dynamically reflects the request origin. More reliable for the Vercel proxy setup. |
| **Monorepo (no workspace tools)** | `frontend/` and `backend/` live in one repo with independent `package.json` files. Simple to understand, no workspace tooling overhead. |
| **Vite + Vercel proxy** | `vercel.json` rewrites `/api/*` to the Render backend URL. This avoids CORS entirely in production — the browser only talks to Vercel. |
| **Tailwind CSS for frontend** | Rapid prototyping of the premium dark-mode dashboard with utility classes. Combined with custom CSS variables for the glassmorphism design system. |

### What I Left Out (deliberately)

| Omission | Why |
| :--- | :--- |
| **Real financial data APIs** (Yahoo Finance, Alpha Vantage) | The assignment focuses on AI agent architecture. Gemini's training data provides realistic-enough analysis for the demo. |
| **Database-backed report storage** | In-memory cache is sufficient for demo. A production system would persist to MySQL/PostgreSQL. |
| **Real-time WebSocket updates** | The research call is ~8s; a loading spinner is sufficient. WebSocket streaming would improve UX for longer chains. |
| **Unit / integration tests** | Prioritized building a complete, polished product over test coverage given the assignment scope. |
| **Multi-agent orchestration** (true LangGraph) | The 5-step workflow is currently a single prompt that asks Gemini to perform all steps. A true LangGraph graph with separate nodes per step would be more production-grade. |

---

## 📊 Example Runs

Below are example outputs from the agent for three companies. Each shows the structured JSON the backend produces (truncated for brevity):

### 1. Apple Inc.

```json
{
  "companyName": "apple",
  "overview": "Apple Inc. is a global technology giant headquartered in Cupertino, California. Founded in 1976 by Steve Jobs, Steve Wozniak, and Ronald Wayne, the company designs, manufactures, and markets consumer electronics, software, and services. Apple is one of the most valuable companies in the world...",
  "industry": "Consumer Electronics / Technology",
  "strengths": [
    "Unparalleled brand loyalty and premium pricing power",
    "Massive and growing services ecosystem (App Store, iCloud, Apple Music, Apple TV+)",
    "Vertically integrated hardware-software stack with Apple Silicon",
    "Enormous cash reserves exceeding $160 billion"
  ],
  "weaknesses": [
    "Heavy dependence on iPhone for majority of revenue",
    "Premium pricing limits market share in price-sensitive regions",
    "Growing regulatory scrutiny over App Store policies globally"
  ],
  "competitors": ["Samsung", "Google (Pixel)", "Microsoft", "Huawei"],
  "financialAnalysis": {
    "revenueGrowth": "Revenue has shown resilience with ~2-5% YoY growth, driven by services...",
    "profitability": "Operating margins consistently above 30%, among the highest in tech...",
    "businessModel": "Hardware + services flywheel, recurring revenue from 1B+ active devices...",
    "marketPosition": "#1 in premium smartphones, #2 in global smartphone market share...",
    "scalability": "Services segment scaling rapidly with near-zero marginal cost..."
  },
  "investmentDecision": "Buy",
  "confidenceScore": 88,
  "reasoning": "Apple's vertically integrated ecosystem, massive cash reserves, and growing high-margin services business create a compelling long-term investment thesis..."
}
```

### 2. NVIDIA Corporation

```json
{
  "companyName": "nvidia",
  "overview": "NVIDIA Corporation is the dominant designer of graphics processing units (GPUs) and a leader in AI computing infrastructure...",
  "industry": "Semiconductors / AI Infrastructure",
  "strengths": [
    "Monopolistic position in AI training GPUs (>80% market share)",
    "CUDA software moat creating deep ecosystem lock-in",
    "Revenue growth exceeding 200% YoY driven by data center demand",
    "Strategic positioning at the center of the AI revolution"
  ],
  "weaknesses": [
    "Extreme valuation multiples creating downside risk",
    "Customer concentration risk with hyperscalers",
    "Export restrictions to China limiting total addressable market"
  ],
  "investmentDecision": "Accumulate",
  "confidenceScore": 82,
  "reasoning": "NVIDIA is the undisputed leader in AI compute. While valuation is stretched, the secular AI spending trend supports continued outperformance..."
}
```

### 3. Infosys Limited

```json
{
  "companyName": "infosys",
  "overview": "Infosys Limited is a global leader in next-generation digital services and consulting, headquartered in Bengaluru, India...",
  "industry": "IT Services & Consulting",
  "strengths": [
    "Strong brand and reputation for digital transformation services",
    "Large deal wins driving revenue visibility (TCV $4B+ per quarter)",
    "Industry-leading operating margins among Indian IT peers",
    "Robust cloud and AI service portfolio"
  ],
  "weaknesses": [
    "Exposure to discretionary IT spending cuts in a downturn",
    "Attrition challenges in a competitive talent market",
    "Currency fluctuation risk (USD/INR)"
  ],
  "investmentDecision": "Hold",
  "confidenceScore": 72,
  "reasoning": "Infosys remains a high-quality IT services franchise with stable margins, but near-term growth headwinds from cautious client spending warrant a Hold..."
}
```

> **Note:** Actual Gemini outputs vary per invocation. The above are representative of the quality and structure the agent produces.

---

## 🔮 What I Would Improve with More Time

1. **True LangGraph multi-agent pipeline** — Break the single mega-prompt into 5 discrete LangGraph nodes (Company Research → Business Analysis → External Signals → Reasoning → Recommendation), each with its own prompt template, with state passing between steps. This would produce higher-quality analysis through specialization.

2. **Real financial data integration** — Plug in Yahoo Finance, Alpha Vantage, or SEC EDGAR APIs for real-time price data, quarterly financials, and filing analysis. The AI would then reason over actual numbers, not training data.

3. **Streaming responses** — Use Server-Sent Events (SSE) to stream the AI's analysis step-by-step to the frontend, showing each workflow stage completing in real-time.

4. **Database persistence** — Replace the in-memory `Map` with MySQL tables/relations for reports. Add user history, saved watchlists, and report comparison.

5. **RAG (Retrieval-Augmented Generation)** — Embed recent earnings call transcripts and 10-K filings into a vector store (Pinecone/ChromaDB). Use retrieval to ground the AI's analysis in factual documents rather than parametric knowledge.

6. **Comprehensive test suite** — Unit tests for the agent logic, integration tests for the API endpoints, and Playwright E2E tests for the frontend flows.

7. **Rate limiting & error resilience** — Add API rate limiting, request queuing, circuit-breaker patterns for the Gemini API, and retry logic with exponential backoff.

8. **Multi-model comparison** — Let users compare analyses from Gemini, GPT-4, and Claude side-by-side to see how different models reason about the same company.

---

## 💬 LLM Chat Session Transcript (BONUS)

This entire project was built with the assistance of an AI coding assistant (**Gemini / Claude**). Below is the development conversation log showing my thought process and approach.

### Session 1 — 2026-07-06: Initial Architecture & Backend

**Me:** Build an AI investment research agent with a TypeScript Express backend and React frontend. Use Google Gemini for analysis.

**LLM:** Here's my approach:
1. Create separate frontend/backend services with REST API boundary
2. Backend orchestrates AI workflow: research → analyze → external signals → reasoning → recommendation
3. Use structured JSON prompts to get reliable, parseable output from Gemini
4. Frontend renders a premium dashboard with section-by-section navigation

**Actions taken:**
- Scaffolded Express + TypeScript backend with controllers/services/agents/routes pattern
- Implemented `GeminiService` with direct REST API calls to `generativelanguage.googleapis.com`
- Created `buildInvestmentPrompt()` with strict JSON schema instructions
- Built `InvestmentAgent` with robust JSON parsing and graceful fallback
- Added in-memory caching for repeat queries
- Set up auth routes (register/login/demo) with JWT + bcrypt + MySQL

### Session 2 — 2026-07-07: Frontend Dashboard

**Me:** Build a premium dark-mode dashboard with glassmorphism design. Need search, loading states, and a multi-section report viewer.

**LLM:** I'll create:
- `SearchBar` — company input with research trigger
- `LoadingState` — animated multi-step progress indicator
- `ReportDashboard` — sidebar navigation + section panels (Overview, Financials, Sentiment, Risks, Recommendation)
- `CompanyCard` — header card with company overview and industry badge
- `Charts` — Recharts-powered signal visualization
- `RecommendationCard` — investment decision with confidence meter
- `RiskCard` — risk factor display with severity indicators

**Actions taken:**
- Built 12 React components with Tailwind CSS
- Implemented glassmorphism design system with CSS custom properties
- Added live market ticker, global exchange clocks, sector performance grid
- Created `MarketDetailsModal` with sparkline charts for 40+ market assets
- Built `EducationTab` with investment education content

### Session 3 — 2026-07-08: Deployment & CORS Battles

**Me:** Deploy frontend to Vercel and backend to Render. Getting CORS 405 errors.

**LLM:** The issue is Vercel → Render cross-origin requests. Let's fix it:

**Actions taken (multiple iterations — see git log):**
1. Added `vercel.json` rewrite rules to proxy `/api/*` to Render backend
2. Added explicit CORS origin allowlisting for `*.vercel.app`
3. Replaced `cors` npm middleware with custom CORS handler for full control
4. Set dynamic origin reflection in `Access-Control-Allow-Origin`
5. Implemented demo auto-login on frontend startup to prevent 401s

### Session 4 — 2026-07-09: LangChain Integration

**Me:** Integrate LangChain for the AI pipeline instead of raw API calls.

**LLM:** I'll add `@langchain/google-genai` and `@langchain/core` to build an LCEL chain:

```typescript
const chain = promptTemplate.pipe(model).pipe(outputParser);
const result = await chain.invoke({ input: promptText });
```

**Actions taken:**
- Created `LangChainService` as a drop-in replacement for `GeminiService`
- Used `ChatGoogleGenerativeAI` model with `temperature: 0.2` for factual analysis
- Built LCEL chain: `PromptTemplate → ChatGoogleGenerativeAI → StringOutputParser`
- Preserved `GeminiService` as commented-out fallback in the controller
- Updated `researchController` to use `LangChainService`

### Session 5 — 2026-07-10: UI Polish & Documentation

**Me:** Redesign HomeTab for premium look, add live ticker, status clocks, and 3D card layout. Rename brand to InvestIQ.

**LLM:** Complete redesign with:
- Hero section with AI-generated imagery
- Live stock ticker ribbon with 8 symbols
- 4 global market clocks (NYSE, LSE, TSE, NSE) with open/closed status
- Investment strategy allocation visualizer
- Feature cards with demo launch buttons
- Full brand rename across all files

**Me:** Generate comprehensive README with all required sections including this chat transcript.

**LLM:** *(This document is the result.)*

---

## 📁 Project Structure

```
aivenky/
├── backend/
│   ├── src/
│   │   ├── agents/
│   │   │   └── investmentAgent.ts     # Core AI agent orchestrator
│   │   ├── config/
│   │   │   └── env.ts                 # Environment configuration
│   │   ├── controllers/
│   │   │   ├── authController.ts      # Register, login, demo login
│   │   │   └── researchController.ts  # Research, analyze, get report
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts      # JWT auth (demo bypass mode)
│   │   ├── models/
│   │   │   └── userModel.ts           # Sequelize user schema
│   │   ├── prompts/
│   │   │   └── investmentPrompt.ts    # Structured Gemini prompt template
│   │   ├── routes/
│   │   │   ├── authRoutes.ts          # /api/auth/*
│   │   │   └── researchRoutes.ts      # /api/research, /api/analyze, /api/report
│   │   ├── services/
│   │   │   ├── geminiService.ts       # Direct Gemini REST API client
│   │   │   └── langchainService.ts    # LangChain LCEL chain (active)
│   │   ├── types/
│   │   │   ├── auth.ts                # Auth types
│   │   │   └── index.ts              # Report & request types
│   │   ├── utils/
│   │   │   └── errorHandler.ts        # Custom AppError class
│   │   ├── app.ts                     # Express app setup + CORS
│   │   └── server.ts                  # Server entry + MySQL connect
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Charts.tsx             # Recharts signal visualization
│   │   │   ├── CompanyCard.tsx        # Company header card
│   │   │   ├── EducationTab.tsx       # Investment education content
│   │   │   ├── HomeTab.tsx            # Main landing page (ticker, clocks, features)
│   │   │   ├── LoadingState.tsx       # Animated research progress
│   │   │   ├── LoginPage.tsx          # Auth page (login/register/demo)
│   │   │   ├── LogoutPage.tsx         # Logout confirmation
│   │   │   ├── MarketDetailsModal.tsx # Asset detail modal + sparklines
│   │   │   ├── RecommendationCard.tsx # Investment decision display
│   │   │   ├── ReportDashboard.tsx    # Main report viewer + sidebar nav
│   │   │   ├── RiskCard.tsx           # Risk factor cards
│   │   │   └── SearchBar.tsx          # Company search input
│   │   ├── services/
│   │   │   ├── api.ts                 # Axios instance + JWT interceptor
│   │   │   └── authService.ts         # Auth methods + localStorage
│   │   ├── types/
│   │   │   └── index.ts              # ResearchReport interface
│   │   ├── App.tsx                    # Main app (routing, state, layout)
│   │   ├── index.css                  # Design system (glassmorphism, vars)
│   │   └── main.tsx                   # React entry point
│   ├── vercel.json                    # API proxy rewrites
│   ├── package.json
│   └── vite.config.ts
├── DEPLOYMENT.md
├── GIT_GUIDE.md
├── IMPLEMENTATION_PLAN.md
└── README.md                          # ← You are here
```

---

## 🔗 API Reference

| Method | Endpoint               | Auth     | Description                           |
| :----- | :--------------------- | :------- | :------------------------------------ |
| POST   | `/api/auth/register`   | Public   | Create new account                    |
| POST   | `/api/auth/login`      | Public   | Login with email/password             |
| POST   | `/api/auth/demo`       | Public   | Demo login (no credentials)           |
| POST   | `/api/research`        | JWT      | Generate new AI research report       |
| POST   | `/api/analyze`         | JWT      | Analyze company (with cache fallback) |
| GET    | `/api/report/:company` | JWT      | Retrieve a cached report              |
| GET    | `/health`              | Public   | Health check                          |

---

## 📜 License

Built for the AI Investment Research Agent assessment. MIT License.
