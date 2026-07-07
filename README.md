# AI Investment Research Agent

A production-quality AI investment research application built with React, TypeScript, Tailwind CSS, Node.js, Express, and Gemini.

## Architecture

- Frontend: React + TypeScript + Tailwind + Recharts
- Backend: Express + TypeScript + Gemini integration
- AI workflow: research company details, analyze business signals, assess external signals, run AI reasoning, generate recommendation

## Folder Structure

- backend/src/controllers
- backend/src/services
- backend/src/agents
- backend/src/tools
- backend/src/routes
- backend/src/prompts
- backend/src/middleware
- backend/src/types
- backend/src/utils
- backend/src/config
- frontend/src/components
- frontend/src/pages
- frontend/src/hooks
- frontend/src/services
- frontend/src/types
- frontend/src/context
- frontend/src/utils

## Local Development

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Set your Gemini key in the backend .env file:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Routes

- POST /api/research
- POST /api/analyze
- GET /api/report/:company

## Deployment

- Frontend: Vercel
- Backend: Render or Railway

## Notes

- The Gemini API key should be stored in environment variables only.
- This implementation uses structured JSON output for the report.
