import { GoogleGenAI, Type } from "@google/genai";
import { Message, SmartSuggestion, AnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const FAST_MODEL = 'gemini-3-flash-preview';
const REASONING_MODEL = 'gemini-3-pro-preview';
const VISION_MODEL = 'gemini-3-pro-preview'; // Using pro for better vision reasoning

export const generatePersonaResponse = async (
  history: Message[],
  contactName: string,
  systemPrompt: string,
  userMessage: string
): Promise<string> => {
  try {
    const recentHistory = history.slice(-5).map(m => 
      `${m.senderId === 'me' ? 'User' : contactName}: ${m.text}`
    ).join('\n');

    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: `
        System: ${systemPrompt}
        Task: Reply to the user. Stay in character. Keep it under 50 words.
        Conversation History:
        ${recentHistory}
        User: ${userMessage}
      `,
    });
    return response.text || "...";
  } catch (error) {
    console.error("Gemini persona error:", error);
    return "Encrypted channel negotiation failed. Retrying...";
  }
};

export const generateSmartReplies = async (
  lastMessage: string, 
  context: string
): Promise<SmartSuggestion[]> => {
  try {
    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: `
        Analyze this incoming message: "${lastMessage}"
        Context: ${context}
        Generate 3 distinct reply options for a high-ranking official.
        1. Casual/Ack
        2. Professional/Action-oriented
        3. Diplomatic/Careful
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              tone: { type: Type.STRING, enum: ['casual', 'professional', 'diplomatic'] },
              rationale: { type: Type.STRING }
            },
            required: ['text', 'tone']
          }
        }
      }
    });
    
    // Parse JSON safely
    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as SmartSuggestion[];
  } catch (error) {
    console.error("Smart reply error", error);
    return [];
  }
};

export const analyzeConversation = async (messages: Message[]): Promise<AnalysisResult | null> => {
  if (messages.length === 0) return null;

  try {
    const transcript = messages.map(m => `[${m.senderId}]: ${m.text}`).join('\n');
    
    const response = await ai.models.generateContent({
      model: REASONING_MODEL, // Using Pro for deeper reasoning
      contents: `
        Analyze this communication log for Sigmax Command.
        
        Transcript:
        ${transcript}
        
        Provide:
        1. A brief executive summary (max 20 words).
        2. Extracted actionable items.
        3. Overall sentiment.
        4. Threat assessment (LOW/MEDIUM/HIGH).
      `,
      config: {
        thinkingConfig: { thinkingBudget: 1024 }, // Enable thinking for better analysis
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
            sentiment: { type: Type.STRING, enum: ['positive', 'neutral', 'negative', 'hostile', 'urgent'] },
            threatLevel: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH'] }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Analysis error", error);
    return null;
  }
};

export const translateMessage = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: `Translate the following text to Standard English (Universal Sigmax Dialect). Maintain original tone. Text: "${text}"`
    });
    return response.text || text;
  } catch (e) {
    return text;
  }
}

export const verifyUserIdentity = async (imageBase64: string): Promise<{ identified: boolean, name: string | null }> => {
  try {
    // We strip the header if present
    const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

    const response = await ai.models.generateContent({
      model: VISION_MODEL,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64
            }
          },
          {
            text: `
            You are a Biometric Security AI for Sigmax Nexus.
            Analyze the person in this image and determine if they match one of the following high-value targets based on their description:

            1. "SOUMYADEEPTA ROY": Young boy, wearing a red beanie or hat with text on it (like "NY" or similar pattern), looking directly at camera.
            2. "RITANKAR CHAKRABORTY": Young boy, wearing neon green/lime framed glasses, smiling slightly, short dark hair.
            3. "SATYAKI HALDER": Young boy, short hair, looking calm, wearing a purple or dark shirt, neutral expression.
            4. "DIAN DEY": Young boy, wearing dark/black framed glasses, short hair, smiling, possibly wearing a striped shirt.
            5. "IBHAN CHAKRABORTY": Young boy, short dark hair, wearing a bluish/teal shirt, talking on a yellow phone or hand near face.

            If the image strongly matches one of these descriptions, return the EXACT name from the list. 
            If it does not match anyone clearly, return "UNKNOWN".

            Response strictly in JSON format: { "identified": boolean, "name": "NAME_OR_UNKNOWN" }
          `
          }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) return { identified: false, name: null };
    const result = JSON.parse(text);
    return {
      identified: result.identified,
      name: result.name === "UNKNOWN" ? null : result.name
    };

  } catch (error) {
    console.error("Identity verification failed", error);
    return { identified: false, name: null };
  }
};