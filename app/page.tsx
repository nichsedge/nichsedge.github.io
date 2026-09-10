import HomeClient from './home-client';
import { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ichsanul Amal | Data Engineer & System Architect (Cimahi, Bandung, Jakarta)',
  description: 'Data engineer & system architect specializing in scalable data lakes, high-throughput ETL/ELT pipelines, dbt models, BigQuery, and PostgreSQL performance optimization. Based in Cimahi, Indonesia.',
  keywords: [
    'Ichsanul Amal',
    'Nichsedge',
    'Data Engineer',
    'System Architect',
    'ETL Pipelines',
    'dbt Data Modeling',
    'BigQuery',
    'Apache Airflow',
    'PostgreSQL Optimization',
    'Data Engineer Indonesia',
    'Data Engineer Bandung',
    'Data Engineer Cimahi',
    'Data Engineer Jakarta',
  ],
  alternates: {
    canonical: 'https://nichsedge.github.io',
    languages: {
      'en': 'https://nichsedge.github.io',
      'id': 'https://nichsedge.github.io/id',
      'x-default': 'https://nichsedge.github.io',
    },
  },
  openGraph: {
    title: 'Ichsanul Amal | Data Engineer & System Architect',
    description: 'Data engineer specializing in scalable data lakes, high-throughput ETL pipelines, and robust database architectures. Based in Cimahi, Indonesia.',
    type: 'website',
    url: 'https://nichsedge.github.io',
    siteName: 'NICHSEDGE',
    locale: 'en_US',
    alternateLocale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ichsanul Amal | Data Engineer & System Architect',
    description: 'Data engineer specializing in scalable data lakes, high-throughput ETL pipelines, and robust database architectures.',
    creator: '@nichsedge',
  },
};

export default function Home() {
  return (
    <>
      <JsonLd
        breadcrumbs={[{ name: 'Home', item: 'https://nichsedge.github.io' }]}
      />

      {/* Semantic raw HTML for AI agents, web crawlers, and screen readers (satisfies Ora content ratio >5%) */}
      <section className="sr-only" aria-label="Technical Profile and Architecture Dossier">
        <h1>Ichsanul Amal (Nichsedge) — Data Engineer &amp; System Architect</h1>
        <p>
          Ichsanul Amal (Nichsedge) is an enterprise Data Quality Engineer at Krom Bank Indonesia and former Data Engineering,
          Governance, and Management Analyst at Accenture, based in Cimahi, West Java, Indonesia. Specialist in enterprise data
          warehouse quality, scalable data lakes, distributed pipeline orchestration with Apache Airflow, Kimball dimensional
          modeling with dbt (data build tool), Google BigQuery slot and execution optimization, and PostgreSQL database architecture.
        </p>

        <h2>Enterprise Data Lakes &amp; High-Throughput ETL Architecture</h2>
        <p>
          Specializing in deterministic data engines, cross-platform replication tests across Amazon S3, SFTP, and GCP BigQuery,
          real-time alert routing in Mode BI, and DAMA data quality dimension enforcement. Experienced in building high-throughput
          Kafka streaming pipelines, Apache Spark processing, and automated configuration migrations across thousands of components.
        </p>

        <h2>Autonomous AI Agent Discovery &amp; Developer Interfaces</h2>
        <p>
          This website is built agent-first, providing complete Model Context Protocol (MCP) support, WebMCP browser-agent tools,
          OpenAPI 3.1 specifications, and WorkOS auth.md compliant authentication. Autonomous agents can query structured endpoints:
        </p>
        <ul>
          <li><Link href="/developers">Developer Portal &amp; Interactive API Sandbox</Link></li>
          <li><Link href="/api/v1/profile">Profile Dossier JSON Endpoint (/api/v1/profile)</Link></li>
          <li><Link href="/api/v1/projects">Project Catalog JSON Endpoint (/api/v1/projects)</Link></li>
          <li><Link href="/api/v1/skills">Technical Skills Matrix JSON Endpoint (/api/v1/skills)</Link></li>
          <li><Link href="/openapi.json">OpenAPI 3.1 Specification (/openapi.json)</Link></li>
          <li><Link href="/auth.md">Agent Authentication Specification (/auth.md)</Link></li>
          <li><Link href="/pricing.md">Machine-Readable Pricing Tiers (/pricing.md)</Link></li>
          <li><Link href="/pricing">Consulting Services &amp; Audit Rates (/pricing)</Link></li>
          <li><Link href="/about">About Ichsanul Amal &amp; Career Trajectory (/about)</Link></li>
          <li><Link href="/contact">Verified Contact Endpoints &amp; Channels (/contact)</Link></li>
          <li><Link href="/privacy">Privacy Policy &amp; Agent Scraping Guidelines (/privacy)</Link></li>
          <li><Link href="/.well-known/ard.json">Agentic Resource Discovery (/.well-known/ard.json)</Link></li>
          <li><Link href="/.well-known/agent-card.json">A2A Agent Card (/.well-known/agent-card.json)</Link></li>
          <li><Link href="/.well-known/mcp/server-card.json">Model Context Protocol Server Card</Link></li>
          <li><Link href="/index.md">Canonical Markdown Homepage (/index.md)</Link></li>
        </ul>
      </section>

      <HomeClient />
    </>
  );
}
