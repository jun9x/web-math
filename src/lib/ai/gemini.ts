import { GoogleGenAI } from "@google/genai";
import { env } from "@/lib/env";

export function getGeminiClient() {
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is not configured!");
  }
  return new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
}

export async function generateContentStream(prompt: string, systemInstruction?: string) {
  const ai = getGeminiClient();
  const responseStream = await ai.models.generateContentStream({
    model: env.GEMINI_MODEL || "gemini-2.5-flash",
    contents: [prompt],
    config: systemInstruction ? { systemInstruction } : undefined,
  });

  return responseStream;
}

export async function generateStructuredJson<T>(
  prompt: string,
  systemInstruction?: string
): Promise<T> {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: env.GEMINI_MODEL || "gemini-2.5-flash",
    contents: [prompt],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
    },
  });

  const text = response.text || "{}";
  return JSON.parse(text) as T;
}
