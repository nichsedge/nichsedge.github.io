import resumeData from "@/data/cv.json";

export function getFallbackAuditReport(data: any) {
  const name = data?.name || "Ichsanul Amal";
  const role = data?.role || "Data Engineer";
  const skills = data?.skills || ["Python", "dbt", "Airflow", "BigQuery", "SQL"];
  const projectsCount = data?.projects_count || "50+";

  return `[SYSTEM_AUDIT_REPORT]\nSTATUS: OPTIMIZED_CORE_STABLE (100% Uptime)\nOBSERVATIONS:\n• Neural synapses operating at peak frequency with ${skills.slice(0, 3).join("/")} pipeline synchronicity.\n• Ingestion pipelines show zero packet loss across ${projectsCount} localized projects.\n• Core stack analysis reveals absolute proficiency in ${skills.join(", ")}.\n• System integrity shows extreme resilience to high-volume telemetry ingestion.\nVERDICT: A highly optimized ${name} ${role} architecting invisible, bulletproof data nervous systems.`;
}

const formatPeriod = (period: any) => {
  if (!period) return "";
  if (typeof period === "string") return period;
  const formatDate = (d: string | null) => {
    if (!d || d === "Present") return "Present";
    const parts = d.split("-");
    if (parts.length < 2) return d;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
  };
  return `${formatDate(period.start)} — ${formatDate(period.end)}`;
};

export function getFallbackGhostResponse(query: string) {
  const q = (query || "").toLowerCase();

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

  if (q.includes("predict") || q.includes("oracle") || q.includes("next 5 years")) {
    return "Predictive scan completed. Over the next five years, data engineering will converge deeply with agentic AI architectures. Using Airflow, dbt, and GCP, Ichsanul will continue to deploy invisible, self-healing pipeline nervous systems for enterprise-grade data lakes.";
  }

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
    return "My core programming matrix runs on Python, SQL, Go, and Shell. For infrastructure and ETL automation, I leverage GCP, Airflow, dbt, PostgreSQL, and BigQuery. Let me know if you want to analyze a specific node.";
  }

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

  if (q.includes("project") || q.includes("portfolio") || q.includes("achieve")) {
    return "Telemetry shows multiple project deployments including idx-bei, sansfinance, and atracker. Additionally, I won the Best Technology award at the Tokopedia Devcamp Hackathon and automated configuration migrations for over 4,000 components.";
  }

  if (q.includes("help") || q.includes("command") || q.includes("what can you")) {
    return "I am configured to answer queries regarding Ichsanul's professional career, including his stack (Python, Airflow, dbt, BigQuery), work experience (Accenture, Traveloka), and academic background. Proceed.";
  }

  return "Query analyzed. Data integrity is stable at 100%. My pipelines are processing background streams, and my technical capacity remains highly optimized. What further insight do you seek?";
}

export function getProfileSummary() {
  return {
    name: resumeData.profile.name,
    role: resumeData.profile.role,
    tagline: resumeData.profile.tagline,
    specialization: resumeData.profile.specialization,
    currentFocus: resumeData.profile.currentFocus,
    skills: resumeData.skills,
    work: resumeData.work.map((w) => ({
      company: w.company,
      role: w.role,
      period: formatPeriod(w.period),
      shortDescription: w.shortDescription,
      projects: (w.projects || []).map((p) => ({
        role: p.role,
        period: formatPeriod(p.period),
        shortDescription: p.shortDescription,
      })),
    })),
  };
}
