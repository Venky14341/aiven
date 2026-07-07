const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const dotenv = require('dotenv');

dotenv.config();

(async () => {
  const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-2.0-flash',
  });

  const prompt = 'Return only JSON with {"companyName":"Test","overview":"Test overview","industry":"Technology","strengths":[],"weaknesses":[],"competitors":[],"financialAnalysis":{"revenueGrowth":"Test"},"marketSentiment":{"sentiment":"Neutral"},"risks":[],"investmentDecision":"PASS","confidenceScore":50,"reasoning":"Test","summary":"Test"}';

  const result = await model.invoke(prompt);
  console.log(JSON.stringify(result, null, 2));
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
