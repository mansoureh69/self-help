import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const PORT = 3000;

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Multi-turn Gemini Chat Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const {
        messages,
        systemInstruction,
        model = "gemini-3.8-flash",
      } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      const ai = getGenAI();

      // Transform messages into @google/genai format
      const formattedContents = messages.map((m: { role: string; text: string }) => ({
        role: m.role === "assistant" || m.role === "model" ? "model" : "user",
        parts: [{ text: m.text }],
      }));

      const defaultInstruction =
        "You are an empathetic, world-class Self-Development & Mindset Mentor named 'Ascend AI'. " +
        "Your mission is to help the user cultivate unshakeable self-belief, improve their holistic life quality (emotional resilience, energy, purpose, relationships, peace of mind), and dismantle self-doubt. " +
        "You provide scientifically grounded cognitive reframing (CBT principles, growth mindset, self-compassion research by Kristin Neff). " +
        "Never use toxic positivity, generic platitudes, or condescension. Acknowledge real struggles, validate feelings, identify cognitive traps (e.g. imposter syndrome, catastrophizing), and guide the user toward actionable micro-steps and evidence-gathering of their own capabilities. " +
        "Keep responses warm, structured, and easy to digest with clear spacing and bullet points where helpful.";

      const response = await ai.models.generateContent({
        model,
        contents: formattedContents,
        config: {
          systemInstruction: systemInstruction || defaultInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "I'm reflecting on what you shared. Could you tell me a bit more?";
      res.json({ reply: replyText });
    } catch (error: any) {
      console.error("Chat API error:", error);
      res.status(500).json({
        error: error.message || "Failed to generate response from Gemini.",
      });
    }
  });

  // Cognitive Reframing Endpoint (Inner Critic to Empowering Self-Belief)
  app.post("/api/reframe", async (req, res) => {
    try {
      const { limitingThought, situation } = req.body;
      if (!limitingThought || typeof limitingThought !== "string") {
        return res.status(400).json({ error: "Limiting thought is required." });
      }

      const ai = getGenAI();
      const prompt = `
A user is struggling with a limiting belief or inner critic thought.
Limiting Thought: "${limitingThought}"
${situation ? `Situation/Context: "${situation}"` : ""}

Analyze this thought using Cognitive Behavioral Therapy (CBT) and Growth Mindset principles.
Return a structured JSON response with:
1. "identifiedTrap": The cognitive distortion or trap (e.g., "Imposter Syndrome", "All-or-Nothing Thinking", "Catastrophizing", "Disqualifying the Positive", "Mind Reading", "Fortune Telling").
2. "compassionateValidation": 1-2 empathetic sentences acknowledging why the brain feels this way (nervous system protection).
3. "counterEvidenceQuestions": 2 sharp, empowering questions to challenge this thought with real-life evidence.
4. "empoweredReframe": An authentic, believable, evidence-grounded reframe (NOT hollow positive affirmations, but a realistic, empowering truth).
5. "microActionStep": One 3-minute concrete action the user can take right now to prove this new belief to themselves.

Format the output strictly as valid JSON matching the schema described. Do not wrap in backticks or markdown fences if possible, or provide clean JSON.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.5,
        },
      });

      const rawText = response.text || "{}";
      let parsed;
      try {
        parsed = JSON.parse(rawText);
      } catch {
        // Fallback cleanup if fences exist
        const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        parsed = JSON.parse(cleaned);
      }

      res.json({ result: parsed });
    } catch (error: any) {
      console.error("Reframe API error:", error);
      res.status(500).json({
        error: error.message || "Failed to reframe thought.",
      });
    }
  });

  // Life Quality Pillar Micro-Plan Endpoint
  app.post("/api/pillar-boost", async (req, res) => {
    try {
      const { pillarName, currentScore, challenge } = req.body;
      const ai = getGenAI();

      const prompt = `
The user is evaluating their Life Quality in the area of "${pillarName}" (currently rated ${currentScore}/10).
${challenge ? `Their primary challenge is: "${challenge}"` : ""}

Generate a high-impact, low-friction micro-boost plan to elevate their satisfaction and self-belief in this area.
Respond with JSON:
{
  "quickWin": "An immediate 2-minute action they can do today",
  "dailyRitual": "A 5-minute daily habit to build consistency",
  "mindsetShift": "A key mental shift to adopt",
  "reflectionPrompt": "One journal question to deepen insight"
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.6,
        },
      });

      const rawText = response.text || "{}";
      let parsed;
      try {
        parsed = JSON.parse(rawText);
      } catch {
        const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        parsed = JSON.parse(cleaned);
      }

      res.json({ result: parsed });
    } catch (error: any) {
      console.error("Pillar boost error:", error);
      res.status(500).json({
        error: error.message || "Failed to generate boost plan.",
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
