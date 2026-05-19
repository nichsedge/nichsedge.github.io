import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { getFallbackAuditReport } from "@/lib/ai-fallback";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

type AuditRequestBody = {
  profileData?: {
    name?: string;
    role?: string;
    skills?: string[];
    projects_count?: string;
  };
};

export async function POST(req: NextRequest) {
  let profileData: AuditRequestBody["profileData"] | null = null;
  try {
    const body = (await req.json()) as AuditRequestBody;
    profileData = body.profileData;
  } catch {
    // Ignore JSON parsing errors
  }

  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not set. Using local fallback.");
    return NextResponse.json({ report: getFallbackAuditReport(profileData) });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
      You are an elite, slightly cynical but highly impressed Data Engineering System Auditor.
      Analyze this professional profile data and provide a "System Audit Report" in a technical, 
      cyberpunk, terminal style. Keep it concise, punchy, and include some mock "technical metrics".
      
      User Data: ${JSON.stringify(profileData)}
      
      Format:
      [SYSTEM_AUDIT_REPORT]
      STATUS: [DETERMINE_STATUS]
      OBSERVATIONS: [3-4 BULLTED POINTS]
      VERDICT: [ONE LINER]
    `,
    });

    return NextResponse.json({ report: response.text });
  } catch (error) {
    console.error("AI Audit Error (falling back to local generator):", error);
    return NextResponse.json({ report: getFallbackAuditReport(profileData) });
  }
}
