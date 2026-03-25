import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

async function run() {
  try {
    const result = await model.generateContent('Hi');
    console.log(result.response.text());
  } catch (err) {
    console.error('ERROR:', err);
  }
}
run();
