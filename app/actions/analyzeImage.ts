"use server"; // CRITICAL: This guarantees this code NEVER runs in the user's browser

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function analyzeImage(base64Image: string) {
  try {
    // 1. Open the vault securely
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing API Key");

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // We use gemini-1.5-flash because it is built for lightning-fast multimodal processing
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 2. The Strict System Prompt
    const prompt = `
      You are an expert lost-and-found sorting assistant for a university campus. 
      Look at this image and return ONLY a valid JSON object. Do not include markdown formatting or conversational text.
      The JSON must have exactly these three keys:
      - "title": A short, 2-4 word name of the main item.
      - "description": A concise, 1-sentence physical description (e.g., color, brand, distinct marks).
      - "category": You MUST choose strictly from this exact array: ["id", "electronics", "clothing", "other"].
    `;

    // 3. Clean the image string to satisfy the API
    const base64Data = base64Image.split(',')[1]; 

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: "image/jpeg"
      }
    };

    // 4. Execute the AI call
    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();
    
    // 5. Clean up any accidental markdown the AI tries to add (e.g., ```json ... ```)
    const cleanJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Return the clean JavaScript object back to the frontend form
    return JSON.parse(cleanJsonString);

  } catch (error) {
    console.error("AI Analysis Failed:", error);
    return null; // Fail gracefully so the app doesn't crash
  }
}