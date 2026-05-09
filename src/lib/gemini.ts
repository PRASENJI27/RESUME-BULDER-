import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const resumeSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    profession: { type: Type.STRING },
    contact: {
      type: Type.OBJECT,
      properties: {
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        linkedin: { type: Type.STRING },
        website: { type: Type.STRING },
        location: { type: Type.STRING },
      },
      required: ["email", "phone", "linkedin"],
    },
    summary: { type: Type.STRING },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          company: { type: Type.STRING },
          duration: { type: Type.STRING },
          location: { type: Type.STRING },
          bullets: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["title", "company", "duration", "bullets"],
      },
    },
    skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          degree: { type: Type.STRING },
          institution: { type: Type.STRING },
          year: { type: Type.STRING },
        },
        required: ["degree", "institution", "year"],
      },
    },
  },
  required: ["name", "profession", "contact", "summary", "experience", "skills", "education"],
};

export async function generateResume(rawText: string): Promise<ResumeData> {
  const prompt = `
    You are an expert Resume Architect and Career Consultant. 
    Your goal is to take the following messy, raw user input and transform it into a high-impact, ATS-optimized resume.

    Instructions:
    1. Extract all relevant information.
    2. If sections like "Professional Summary" or "Job Responsibilities" are weak or missing, generate high-quality, industry-specific content using strong action verbs (e.g., "Spearheaded," "Optimized," "Executed").
    3. Ensure keywords related to the specific job profile are naturally integrated.
    4. The tone should be professional and result-oriented.
    5. Ensure the experience bullets focus on achievements and quantifiable results.

    User Input:
    """
    ${rawText}
    """
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: resumeSchema,
      },
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(response.text.trim()) as ResumeData;
  } catch (error) {
    console.error("Error generating resume:", error);
    throw error;
  }
}
