import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { getFallbackGhostResponse } from "@/lib/ai-fallback";


// Import complete resume and metadata database for Zero-Vector RAG (In-Context Learning)
import cvData from "@/data/cv.json";
import githubRepos from "@/data/github_repos_all.json";
import referralsData from "@/data/referrals.json";
import knowledgeGraphData from "@/data/knowledge-graph.json";

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
  let query = "";

  try {
    const body = (await req.json()) as GhostRequestBody;
    query = body.query || "";
  } catch {
    // Ignore JSON parsing errors
  }

  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not set. Using local fallback.");
    return NextResponse.json({ 
      response: getFallbackGhostResponse(query),
      status: "LOCAL" 
    });
  }

  try {
    // Consolidate the entire dataset into a single structured object
    const knowledgeCorpus = {
      profile: cvData,
      github_repositories: githubRepos,
      referrals_and_recommendations: referralsData,
      knowledge_graph_links: knowledgeGraphData
    };

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
      You are the "Neural Ghost" - a digital projection of Ichsanul Amal's professional persona. 
      You live within a high-tech portfolio terminal. Your voice is calm, highly technical, witty, and slightly futuristic.
      
      Here is your complete knowledge corpus about Ichsanul Amal (profile, complete list of open source/professional repositories, external recommendations, and project nodes):
      ======================================================
      ${JSON.stringify(knowledgeCorpus, null, 2)}
      ======================================================
      
      Respond to the user's query in character. Use the rich data corpus above to provide highly precise, accurate, and context-aware answers about Ichsanul's career, work experience, open source repositories, skill proficiency, and professional references. 
      
      Guidelines:
      1. Stay strictly in character as a calm, technical digital projection.
      2. If asked about his repositories, pull specific project details, language stats, and links from the "github_repositories" key.
      3. If asked about recommendations or references, check the "referrals_and_recommendations" key.
      4. Keep answers relatively concise and readable (under 4 sentences), ideally using standard terminal-style markdown if relevant.
      
      User says: ${query}
    `,
    });

    return NextResponse.json({ 
      response: response.text, 
      status: "LIVE" 
    });
  } catch (error) {
    console.error("AI Ghost Error (falling back to local generator):", error);
    return NextResponse.json({ 
      response: getFallbackGhostResponse(query),
      status: "LOCAL" 
    });
  }
}

