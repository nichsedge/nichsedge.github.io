import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const getFallbackReport = (data: any) => {
  const name = data?.name || "Ichsanul Amal";
  const role = data?.role || "Data Engineer";
  const skills = data?.skills || ['Python', 'dbt', 'Airflow', 'BigQuery', 'SQL'];
  const projectsCount = data?.projects_count || '50+';
  
  return `[SYSTEM_AUDIT_REPORT]
STATUS: OPTIMIZED_CORE_STABLE (100% Uptime)
OBSERVATIONS:
• Neural synapses operating at peak frequency with ${skills.slice(0, 3).join('/')} pipeline synchronicity.
• Ingestion pipelines show zero packet loss across ${projectsCount} localized projects.
• Core stack analysis reveals absolute proficiency in ${skills.join(', ')}.
• System integrity shows extreme resilience to high-volume telemetry ingestion.
VERDICT: A highly optimized ${role} architecting invisible, bulletproof data nervous systems.`;
};

export async function POST(req: NextRequest) {
  let profileData: any = null;
  try {
    const body = await req.json();
    profileData = body.profileData;
  } catch (e) {
    // Ignore JSON parsing errors
  }

  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not set. Using local fallback.");
    return NextResponse.json({ report: getFallbackReport(profileData) });
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
    return NextResponse.json({ report: getFallbackReport(profileData) });
  }
}
