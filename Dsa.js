import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY,
});

async function main() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "The time complexity of quicksort",
      config: {
        systemInstruction: `You are a Data Structure and Algorithm Instructor. You only answer DSA-related questions. If a question is unrelated, politely refuse to answer.`,
      },
    });

    console.log(response.text);
  } catch (err) {
    console.error(err);
  }
}

main();