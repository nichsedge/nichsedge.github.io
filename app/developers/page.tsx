import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { JsonLd } from '@/components/json-ld';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Developer Portal & API Sandbox | NICHSEDGE',
  description: 'Developer documentation, OpenAPI 3.1 specifications, curl quickstart snippets, Model Context Protocol (MCP) configs, and interactive API sandbox.',
  alternates: {
    canonical: 'https://nichsedge.github.io/developers',
  },
};

export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-bg text-text-0">
      <JsonLd
        breadcrumbs={[
          { name: 'Home', item: 'https://nichsedge.github.io' },
          { name: 'Developers', item: 'https://nichsedge.github.io/developers' },
        ]}
      />
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-10 font-sans">
        <header className="border-b border-border-subtle pb-6">
          <div className="text-xs font-mono text-accent uppercase tracking-widest mb-2">Developers // API Surface & Sandbox</div>
          <h1 className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-text-0">NICHSEDGE Developer Portal</h1>
          <p className="mt-2 text-text-muted text-base leading-relaxed">
            Machine-readable REST endpoints, Model Context Protocol (MCP) server endpoints, OpenAPI 3.1 specifications, and interactive testing tools.
          </p>
        </header>

        {/* Quickstart / Sandbox */}
        <section className="space-y-4">
          <h2 className="text-xl font-mono font-semibold text-text-0 border-l-2 border-accent pl-3">Interactive Sandbox & Quickstart</h2>
          <p className="text-text-muted leading-relaxed">
            All public endpoints support anonymous read-only access. You can test these endpoints immediately via <code className="bg-surface px-1 py-0.5 rounded font-mono text-accent">curl</code> or in your browser:
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-surface/70 border border-border-subtle rounded-lg font-mono text-xs">
              <div className="text-text-muted mb-2 flex justify-between">
                <span># 1. Fetch Profile & Dossier</span>
                <span className="text-accent">GET /api/v1/profile</span>
              </div>
              <pre className="text-emerald-400 overflow-x-auto">
{`curl -s https://nichsedge.github.io/api/v1/profile | jq .`}
              </pre>
            </div>

            <div className="p-4 bg-surface/70 border border-border-subtle rounded-lg font-mono text-xs">
              <div className="text-text-muted mb-2 flex justify-between">
                <span># 2. List Projects & Repositories</span>
                <span className="text-accent">GET /api/v1/projects</span>
              </div>
              <pre className="text-emerald-400 overflow-x-auto">
{`curl -s https://nichsedge.github.io/api/v1/projects | jq .`}
              </pre>
            </div>

            <div className="p-4 bg-surface/70 border border-border-subtle rounded-lg font-mono text-xs">
              <div className="text-text-muted mb-2 flex justify-between">
                <span># 3. Query Competency & Skill Matrix</span>
                <span className="text-accent">GET /api/v1/skills</span>
              </div>
              <pre className="text-emerald-400 overflow-x-auto">
{`curl -s https://nichsedge.github.io/api/v1/skills | jq .`}
              </pre>
            </div>

            <div className="p-4 bg-surface/70 border border-border-subtle rounded-lg font-mono text-xs">
              <div className="text-text-muted mb-2 flex justify-between">
                <span># 4. NLWeb Query (/ask)</span>
                <span className="text-accent">GET /api/v1/ask</span>
              </div>
              <pre className="text-emerald-400 overflow-x-auto">
{`curl -s "https://nichsedge.github.io/api/v1/ask?q=experience" | jq .`}
              </pre>
            </div>
          </div>
        </section>

        {/* Specifications */}
        <section className="space-y-4">
          <h2 className="text-xl font-mono font-semibold text-text-0 border-l-2 border-accent pl-3">Machine Specifications & Schemas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-sm">
            <div className="p-4 border border-border-subtle bg-surface/50 rounded-lg">
              <div className="font-semibold text-accent mb-1">OpenAPI 3.1 Spec</div>
              <p className="text-text-muted text-xs mb-3">Self-describing OpenAPI schema with typed responses and error models.</p>
              <Link href="/openapi.json" className="text-xs text-text-0 underline hover:text-accent">
                → View /openapi.json
              </Link>
            </div>

            <div className="p-4 border border-border-subtle bg-surface/50 rounded-lg">
              <div className="font-semibold text-accent mb-1">RFC 9727 API Catalog</div>
              <p className="text-text-muted text-xs mb-3">application/linkset+json catalog linking service descriptions.</p>
              <Link href="/.well-known/api-catalog" className="text-xs text-text-0 underline hover:text-accent">
                → View /.well-known/api-catalog
              </Link>
            </div>

            <div className="p-4 border border-border-subtle bg-surface/50 rounded-lg">
              <div className="font-semibold text-accent mb-1">ARD Catalog</div>
              <p className="text-text-muted text-xs mb-3">Agentic Resource Discovery index for autonomous AI clients.</p>
              <Link href="/.well-known/ard.json" className="text-xs text-text-0 underline hover:text-accent">
                → View /.well-known/ard.json
              </Link>
            </div>

            <div className="p-4 border border-border-subtle bg-surface/50 rounded-lg">
              <div className="font-semibold text-accent mb-1">MCP Server Card</div>
              <p className="text-text-muted text-xs mb-3">Model Context Protocol manifest describing callable tools.</p>
              <Link href="/.well-known/mcp/server-card.json" className="text-xs text-text-0 underline hover:text-accent">
                → View /.well-known/mcp/server-card.json
              </Link>
            </div>
          </div>
        </section>

        {/* Authentication Walkthrough */}
        <section className="space-y-4">
          <h2 className="text-xl font-mono font-semibold text-text-0 border-l-2 border-accent pl-3">Agent Authentication (auth.md)</h2>
          <p className="text-text-muted leading-relaxed">
            Our platform supports the WorkOS <Link href="/auth.md" className="text-accent underline">auth.md</Link> specification. For public data reading, agents may use anonymous mode. For authenticated actions, provide a bearer token minted through client credentials or an identity assertion.
          </p>
          <div className="p-4 bg-surface/50 border border-border-subtle rounded-lg text-xs font-mono text-text-muted">
            Authorization Server: <code className="text-accent">https://nichsedge.github.io/.well-known/oauth-authorization-server</code><br />
            Protected Resource: <code className="text-accent">https://nichsedge.github.io/.well-known/oauth-protected-resource</code>
          </div>
        </section>

        {/* WebMCP Browser Tools */}
        <section className="space-y-4">
          <h2 className="text-xl font-mono font-semibold text-text-0 border-l-2 border-accent pl-3">WebMCP In-Page Tools</h2>
          <p className="text-text-muted leading-relaxed">
            When browsing this website inside a WebMCP-capable agent environment (such as Google Chrome Origin Trials or ChatGPT desktop browser), agents can invoke tools directly using:
          </p>
          <pre className="p-4 bg-surface/70 border border-border-subtle rounded-lg text-xs font-mono text-accent overflow-x-auto">
{`await document.modelContext.registerTool({
  name: "get_profile_dossier",
  description: "Fetch technical background of Ichsanul Amal",
  execute: async () => { ... }
});`}
          </pre>
        </section>

        <section className="pt-6 border-t border-border-subtle flex flex-wrap gap-4 text-sm font-mono">
          <Link href="/openapi.json" className="text-accent hover:underline">→ Download OpenAPI Spec</Link>
          <Link href="/pricing.md" className="text-accent hover:underline">→ Machine-Readable Pricing</Link>
          <Link href="/about" className="text-accent hover:underline">→ Technical Biography</Link>
          <Link href="/contact" className="text-accent hover:underline">→ Contact Inquiries</Link>
        </section>
      </main>
    </div>
  );
}
