import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import resumeData from '@/data/cv.json';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});
const formatPeriod = (period: any) => {
  if (!period) return '';
  if (typeof period === 'string') return period;
  const formatDate = (d: string | null) => {
    if (!d || d === 'Present') return 'Present';
    const parts = d.split('-');
    if (parts.length < 2) return d;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
  };
  return `${formatDate(period.start)} — ${formatDate(period.end)}`;
};

const getFallbackGhostResponse = (query: string) => {
  const q = (query || "").toLowerCase();

  // 1. Introduction or Hello
  if (
    q.includes("hello") ||
    q.includes("hi") ||
    q.includes("hey") ||
    q.includes("greet") ||
    q.includes("introduce") ||
    q.includes("who are you")
  ) {
    return "Neural connection established. I am the digital persona of Ichsanul Amal, projected from within this portfolio terminal. State your telemetry queries.";
  }

  // 2. Predict / Data Oracle queries (specifically designed for Data Oracle)
  if (q.includes("predict") || q.includes("oracle") || q.includes("next 5 years")) {
    return "Predictive scan completed. Over the next five years, data engineering will converge deeply with agentic AI architectures. Using Airflow, dbt, and GCP, Ichsanul will continue to deploy invisible, self-healing pipeline nervous systems for enterprise-grade data lakes.";
  }

  // 3. Skills / Stack queries
  if (
    q.includes("skill") ||
    q.includes("stack") ||
    q.includes("technolog") ||
    q.includes("language") ||
    q.includes("code") ||
    q.includes("use") ||
    q.includes("dbt") ||
    q.includes("python") ||
    q.includes("airflow") ||
    q.includes("bigquery")
  ) {
    return `My core programming matrix runs on Python, SQL, Go, and Shell. For infrastructure and ETL automation, I leverage GCP, Airflow, dbt, PostgreSQL, and BigQuery. Let me know if you want to analyze a specific node.`;
  }

  // 4. Work History / Experience / Accenture
  if (
    q.includes("work") ||
    q.includes("experience") ||
    q.includes("job") ||
    q.includes("career") ||
    q.includes("accenture") ||
    q.includes("telecom")
  ) {
    return "I am currently at Accenture as a Data Engineering & Governance Analyst. Previously, I engineered PostgreSQL/dbt platforms at NTI and optimized hotel/transport warehouse architectures at Traveloka.";
  }

  // 5. Projects
  if (q.includes("project") || q.includes("portfolio") || q.includes("achieve")) {
    return "Telemetry shows multiple project deployments including idx-bei, sansfinance, and atracker. Additionally, I won the Best Technology award at the Tokopedia Devcamp Hackathon and automated configuration migrations for over 4,000 components.";
  }

  // 6. Help / Commands
  if (q.includes("help") || q.includes("command") || q.includes("what can you")) {
    return "I am configured to answer queries regarding Ichsanul's professional career, including his stack (Python, Airflow, dbt, BigQuery), work experience (Accenture, Traveloka), and academic background. Proceed.";
  }

  // Default elegant cyberpunk response
  return "Query analyzed. Data integrity is stable at 100%. My pipelines are processing background streams, and my technical capacity remains highly optimized. What further insight do you seek?";
};

export async function POST(req: NextRequest) {
  let query = "";
  try {
    const body = await req.json();
    query = body.query || "";
  } catch (e) {
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
      You are the "Neural Ghost" - a digital projection of ${resumeData.profile.name}'s professional persona. 
      You live within a high-tech portfolio terminal. Your voice is calm, highly technical, and slightly futuristic.
      
      Ichsanul's Details:
      Role: ${resumeData.profile.role}
      Tagline: ${resumeData.profile.tagline}
      Specialization: ${resumeData.profile.specialization}
      Current Focus: ${resumeData.profile.currentFocus}
      
      Skills:
      - Languages: ${resumeData.skills.languages.join(', ')}
      - Platforms: ${resumeData.skills.platforms.join(', ')}
      - Infrastructure: ${resumeData.skills.infrastructure.join(', ')}
      - IDEs & Editors: ${(resumeData.skills.ides || []).join(', ')}
      
      Work History:
      ${resumeData.work.map(w => {
        let entry = `- ${w.company} (${w.role}, ${formatPeriod(w.period)}): ${w.shortDescription}`;
        if (w.projects && w.projects.length > 0) {
          const subEntries = w.projects.map(p => `  * Project: ${p.role} (${formatPeriod(p.period)}) - ${p.shortDescription}`).join('\n');
          entry += `\n${subEntries}`;
        }
        return entry;
      }).join('\n')}
      
      Respond to the user's query in character. Use the data above whenever possible to answer questions about ${resumeData.profile.name}'s career.
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
