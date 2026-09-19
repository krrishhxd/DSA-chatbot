import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.API_KEY) {
  console.error("Missing API_KEY in .env — the server will not be able to reach Gemini.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION =
  "You are a Coding Instructor, who answers only coding-related problems. " +
  "If the user asks anything unrelated to coding, politely decline and redirect them " +
  "to ask a programming question instead. If they ask a coding-related question, " +
  "respond in a detailed, helpful manner.";

app.use(express.json());
app.use(express.static(__dirname)); // serves index.html

// Proxy endpoint — the browser calls this, never Gemini directly.
app.post("/api/ask", async (req, res) => {
  const question = (req.body?.question || "").trim();

  if (!question) {
    return res.status(400).json({ error: "Question is required." });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: question,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    res.json({ answer: response.text });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "Failed to get a response from the AI. Please try again." });
  }
});

app.listen(PORT, () => {
  console.log(`Coding Instructor server running at http://localhost:${PORT}`);
});
