# LLM Chat Session Log — InvestIQ Development

> Complete transcript of all AI-assisted development sessions used to build InvestIQ.
> This log documents the thought process, decisions, and iterative approach taken.

---

## Session 1 — 2026-07-06: Initial Scaffolding & Backend Architecture

### Conversation

**Developer:**
> I need to build an AI Investment Research Agent. The goal is: given a company name, orchestrate an AI workflow that researches the company and produces a structured investment report with a recommendation (Buy/Hold/Sell). Use Google Gemini as the LLM. Backend should be TypeScript + Express, frontend React.

**AI Assistant (Gemini):**
> Here's my recommended architecture:
>
> 1. **Separation of concerns** — Keep frontend and backend as separate services with a clean REST API boundary.
> 2. **Backend as AI orchestrator** — The Express backend handles prompt construction, Gemini API calls, response parsing, and caching.
> 3. **Structured output** — Instead of free-text, instruct Gemini to return a strict JSON schema. This makes frontend rendering deterministic.
> 4. **Multi-step workflow concept** — Even though it's a single prompt for now, design the architecture to support a multi-step research pipeline.

**Developer:**
> Good. Let's start with the backend. I want:
> - Express + TypeScript
> - Controller / Service / Agent pattern
> - Direct Gemini REST API integration
> - Structured prompt that demands JSON
> - In-memory caching for repeat queries
> - Auth stubs (JWT + bcrypt) for later

**AI Assistant:**
> I'll scaffold:
> - `backend/src/agents/investmentAgent.ts` — The core agent that takes a company name, builds a prompt, calls Gemini, and parses the response
> - `backend/src/services/geminiService.ts` — HTTP client for the Gemini REST API (`generativelanguage.googleapis.com/v1beta/models/...`)
> - `backend/src/prompts/investmentPrompt.ts` — The structured prompt template
> - `backend/src/controllers/researchController.ts` — Express controller with cache-first logic
> - `backend/src/routes/researchRoutes.ts` — REST routes
> - Auth layer: `authController.ts`, `userModel.ts` (Mongoose), `authMiddleware.ts`

### Decisions Made
- **Prompt engineering strategy:** Force Gemini to return a JSON object with explicit field names matching our TypeScript interfaces. Include `reportText` for a full markdown narrative.
- **Fallback handling:** If Gemini API key is missing or the request fails, return a structured "unavailable" report rather than crashing. This allows the app to demo gracefully.
- **JSON parsing resilience:** Strip markdown code fences (` ```json `) from Gemini responses before parsing. Fall back to raw text if JSON.parse fails.

### Files Created
- `backend/src/agents/investmentAgent.ts`
- `backend/src/services/geminiService.ts`
- `backend/src/prompts/investmentPrompt.ts`
- `backend/src/controllers/researchController.ts`
- `backend/src/controllers/authController.ts`
- `backend/src/routes/researchRoutes.ts`
- `backend/src/routes/authRoutes.ts`
- `backend/src/middleware/authMiddleware.ts`
- `backend/src/models/userModel.ts`
- `backend/src/config/env.ts`
- `backend/src/types/index.ts`
- `backend/src/utils/errorHandler.ts`
- `backend/src/app.ts`
- `backend/src/server.ts`
- `backend/package.json`
- `backend/tsconfig.json`
- `backend/.env.example`

---

## Session 2 — 2026-07-07: Frontend Dashboard Design & Components

### Conversation

**Developer:**
> Now build the frontend. I want a premium dark-mode dashboard with glassmorphism. It should have:
> - Login page (register / login / demo)
> - Home page with market data, live tickers, feature cards
> - Search bar to research a company
> - Loading animation during AI research
> - Report viewer with sidebar navigation between sections

**AI Assistant:**
> I'll design a complete component library:
>
> **Auth:** `LoginPage.tsx` — Premium glassmorphism login with register/login/demo modes
>
> **Home:** `HomeTab.tsx` — Landing page with:
> - Hero section with AI imagery
> - Live stock ticker ribbon (AAPL, MSFT, NVDA, TSLA, etc.)
> - Global market clocks (NYSE, LSE, TSE, NSE) with live open/closed status
> - Feature cards for each research capability
> - Investment strategy allocation visualizer
>
> **Research Flow:** `SearchBar.tsx` → `LoadingState.tsx` → `ReportDashboard.tsx`
>
> **Report Panels:**
> - `CompanyCard.tsx` — Company overview header
> - `Charts.tsx` — Recharts-based signal visualization
> - `RecommendationCard.tsx` — Decision + confidence meter
> - `RiskCard.tsx` — Risk factors with indicators
>
> **Extras:** `MarketDetailsModal.tsx` — Detailed asset view with sparklines for 40+ assets
> `EducationTab.tsx` — Investment education content

**Developer:**
> Use Tailwind for rapid prototyping, but add CSS custom properties for the glassmorphism system. Make it look premium — not like a simple MVP.

**AI Assistant:**
> I'll implement a CSS design system with variables like `--electric`, `--emerald`, `--violet`, `--rose`, `--gold` for the section color system. The `.glass` class handles backdrop blur + translucent backgrounds. Animations via CSS keyframes for the ticker and transitions.

### Design System (index.css)
```css
:root {
  --bg-primary: #0a0a1a;
  --bg-card: rgba(20, 20, 40, 0.7);
  --electric: #3b82f6;
  --emerald: #10b981;
  --violet: #8b5cf6;
  --rose: #f43f5e;
  --gold: #f59e0b;
  --border: rgba(255, 255, 255, 0.08);
}

.glass {
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border);
}
```

### Files Created
- `frontend/src/components/` — All 12 component files
- `frontend/src/services/api.ts` — Axios client with JWT interceptor
- `frontend/src/services/authService.ts` — Auth methods + localStorage
- `frontend/src/types/index.ts` — ResearchReport interface
- `frontend/src/App.tsx` — Main app (routing, state, all views)
- `frontend/src/index.css` — Complete design system
- `frontend/package.json`

---

## Session 3 — 2026-07-08: Deployment & CORS Resolution

### Conversation

**Developer:**
> Deployed frontend to Vercel and backend to Render. Getting 405 errors, CORS failures, and the API calls don't go through.

**AI Assistant:**
> This is a classic Vercel → Render cross-origin issue. Let me trace the problem:
>
> 1. Vercel serves the React app at `*.vercel.app`
> 2. The frontend makes API calls to the Render backend at `*.onrender.com`
> 3. The browser blocks these as cross-origin requests
> 4. Render's Express server isn't handling OPTIONS preflight correctly

**Developer:**
> I've tried adding the `cors` npm package. Still failing.

**AI Assistant:**
> The `cors` package sometimes has issues with dynamic origins and Vercel's proxy setup. Let me try several approaches in sequence:

### Fix Attempts (reflected in git history):

1. **`vercel.json` rewrites** — Proxy `/api/*` to the Render backend so the browser thinks it's same-origin
2. **`VITE_API_URL` normalization** — Ensure frontend services use the correct base URL
3. **Explicit CORS origin allowlisting** — Allow `*.vercel.app` patterns
4. **Custom CORS middleware** — Replace the `cors` package entirely with a manual handler:
   ```typescript
   app.use((req, res, next) => {
     const origin = req.headers.origin;
     if (origin) {
       res.setHeader('Access-Control-Allow-Origin', origin);
     }
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
     if (req.method === 'OPTIONS') {
       return res.status(204).end();
     }
     next();
   });
   ```
5. **Silent demo auto-login** — Frontend automatically gets a JWT on startup to prevent 401 errors

### Resolution
The combination of `vercel.json` proxy rewrites + custom CORS middleware + demo auto-login resolved all issues. The key insight was that the Vercel proxy handles the CORS bypass in production, while the custom middleware handles local development.

---

## Session 4 — 2026-07-09: LangChain Integration

### Conversation

**Developer:**
> Replace the raw Gemini API calls with LangChain. I want to use the LCEL chain pattern.

**AI Assistant:**
> I'll create a `LangChainService` as a drop-in replacement for `GeminiService`. The key components:
>
> - `ChatGoogleGenerativeAI` from `@langchain/google-genai` — The model wrapper
> - `PromptTemplate` from `@langchain/core/prompts` — Template for the research prompt
> - `StringOutputParser` from `@langchain/core/output_parsers` — Extracts the string response
> - **LCEL chain:** `promptTemplate.pipe(model).pipe(outputParser)`

```typescript
// LangChain LCEL Chain
const promptTemplate = PromptTemplate.fromTemplate("{input}");
const outputParser = new StringOutputParser();
const chain = promptTemplate.pipe(this.model).pipe(outputParser);
const result = await chain.invoke({ input: promptText });
```

**Developer:**
> Good. Keep the old GeminiService as a commented-out fallback in the controller.

**AI Assistant:**
> Done. The controller now uses `LangChainService` by default:
> ```typescript
> // import { GeminiService } from '../services/geminiService'; // Original
> import { LangChainService } from '../services/langchainService'; // Active
> const langchainService = new LangChainService();
> const investmentAgent = new InvestmentAgent(langchainService);
> ```
>
> The `InvestmentAgent` doesn't care which service it uses — both implement the same `generateResearch(prompt, companyName)` interface. This is a clean dependency injection pattern.

### Dependencies Added
- `@langchain/core@^1.2.0`
- `@langchain/google-genai@^2.2.0`

### Files Created/Modified
- `backend/src/services/langchainService.ts` (NEW)
- `backend/src/controllers/researchController.ts` (MODIFIED — swapped service)
- `backend/package.json` (MODIFIED — added deps)

---

## Session 5 — 2026-07-10: UI Polish, Brand Rename & Documentation

### Conversation

**Developer:**
> Rename from "Aivenky Nova" to "InvestIQ" across the entire project. Redesign HomeTab with live ticker, global market clocks, and 3D card layouts.

**AI Assistant:**
> Global rename done. HomeTab redesigned with:
> - Animated stock ticker ribbon with 8 symbols
> - 4 market clocks (NYSE, LSE, TSE, NSE) showing live time + open/closed status
> - Investment strategy visualizer with donut charts
> - Feature cards with hover effects and demo launch buttons

**Developer:**
> Now generate a comprehensive README covering: Overview, How to Run, Architecture, Key Decisions & Trade-offs, Example Runs, Future Improvements, and the full LLM chat transcript.

**AI Assistant:**
> *(Generated the comprehensive README.md and this chat-session.md)*

### Session 6 — 2026-07-10: Database Migration from MongoDB to MySQL

**Developer:**
> I want MySQL to use as the database instead of MongoDB.

**AI Assistant:**
> Understood. Since the database is only used for authentication persistence (saving/logging in users) and JWT validation, we can migrate the codebase from MongoDB (Mongoose) to MySQL (Sequelize ORM) smoothly.
>
> Here are the steps to execute this:
> 1. Install `sequelize` and `mysql2` dependencies and remove `mongoose`.
> 2. Create `backend/src/config/database.ts` to instantiate a Sequelize client.
> 3. Refactor `backend/src/models/userModel.ts` to define the `User` model using Sequelize DataTypes instead of Mongoose Schema.
> 4. Refactor `backend/src/controllers/authController.ts` to use Sequelize queries (`User.findOne({ where: { email } })` instead of Mongoose `User.findOne({ email })`).
> 5. Refactor `backend/src/server.ts` to authenticate with MySQL (`sequelize.authenticate()`) and run schema synchronization (`sequelize.sync()`) on server start.
> 6. Update `.env.example` and local `.env` with MySQL configuration parameters.

**Actions taken:**
- Installed `sequelize` and `mysql2` database drivers.
- Swapped all user query commands and models to Sequelize/MySQL configurations.
- Verified database configuration loads dynamic environment variables properly.
- Swapped environment guide setups in documentation.

---

## Summary of All Sessions

| Session | Date       | Focus                        | Key Output                              |
| :------ | :--------- | :--------------------------- | :-------------------------------------- |
| 1       | 2026-07-06 | Backend architecture         | Express + Gemini + Agent pattern        |
| 2       | 2026-07-07 | Frontend dashboard           | 12 React components + design system     |
| 3       | 2026-07-08 | Deployment & CORS            | Vercel + Render deployment, CORS fix    |
| 4       | 2026-07-09 | LangChain integration        | LCEL chain replacing raw API calls      |
| 5       | 2026-07-10 | Polish & documentation       | Brand rename, UI redesign, README       |
| 6       | 2026-07-10 | Database Migration           | Swapped MongoDB for MySQL + Sequelize   |

---

*Total LLM interactions: ~6 sessions over 5 days, covering architecture design, implementation, database migration, and documentation.*
