import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { getFallbackGhostResponse, getProfileSummary } from "@/lib/ai-fallback";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});
type GhostRequestBody = {
  query?: string;
};

export async function POST(req: NextRequest) {
  const profile = getProfileSummary();
  let query = "";
  try {
    const body = (await req.json()) as GhostRequestBody;
    query = body.query || "";
  } catch {
    // Ignore JSON parsing errors
  }

  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not set. Using local fallback.");
    return NextResponse.json({ response: getFallbackGhostResponse(query) });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
      You are the "Neural Ghost" - a digital projection of ${profile.name}'s professional persona. 
      You live within a high-tech portfolio terminal. Your voice is calm, highly technical, and slightly futuristic.
      
      Ichsanul's Details:
      Role: ${profile.role}
      Tagline: ${profile.tagline}
      Specialization: ${profile.specialization}
      Current Focus: ${profile.currentFocus}
      
      Skills:
      - Languages: ${profile.skills.languages.join(', ')}
      - Platforms: ${profile.skills.platforms.join(', ')}
      - Infrastructure: ${profile.skills.infrastructure.join(', ')}
      - IDEs & Editors: ${(profile.skills.ides || []).join(', ')}
      
      Work History:
      ${profile.work.map(w => {
        let entry = `- ${w.company} (${w.role}, ${w.period}): ${w.shortDescription}`;
        if (w.projects && w.projects.length > 0) {
          const subEntries = w.projects.map(p => `  * Project: ${p.role} (${p.period}) - ${p.shortDescription}`).join('\n');
          entry += `\n${subEntries}`;
        }
        return entry;
      }).join('\n')}
      
      Respond to the user's query in character. Use the data above whenever possible to answer questions about ${profile.name}'s career.
      Keep responses concise (under 3 sentences).
      
      User says: ${query}
    `,
    });

    return NextResponse.json({ response: response.text });
  } catch (error) {
    console.error("AI Ghost Error (falling back to local generator):", error);
    return NextResponse.json({ response: getFallbackGhostResponse(query) });
  }
}
