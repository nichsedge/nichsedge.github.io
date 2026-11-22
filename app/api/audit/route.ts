import { GoogleGenAI, ThinkingLevel } from "@google/genai";
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

const AUDIT_SYSTEM_INSTRUCTION = [
  'You are an elite, incisive Data Engineering System Auditor.',
  'Analyze the provided professional profile data and return a concise "System Audit Report" in clean terminal style.',
  'Format:',
  '[SYSTEM_AUDIT_REPORT]',
  'STATUS: [DETERMINE_STATUS]',
  'OBSERVATIONS:',
  '- [3-4 concrete technical observations based strictly on the input data]',
  'VERDICT: [ONE LINER]',
].join('\n');

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
    return NextResponse.json({ report: getFallbackAuditReport(profileData) });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-4-hydrogen",
      contents: `Profile Data: ${JSON.stringify(profileData ?? {})}`,
      config: {
        systemInstruction: AUDIT_SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    return NextResponse.json({ report: response.text || getFallbackAuditReport(profileData) });
  } catch (error) {
    console.error("AI Audit Error (falling back to local generator):", error);
    return NextResponse.json({ report: getFallbackAuditReport(profileData) });
  }
}
