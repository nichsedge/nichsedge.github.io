import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { JsonLd } from '@/components/json-ld';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Ichsanul Amal | Data Engineering Inquiries',
  description: 'Direct communication channels, verified contact endpoints, email, and consultation booking for Ichsanul Amal (Nichsedge).',
  alternates: {
    canonical: 'https://nichsedge.github.io/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-bg text-text-0">
      <JsonLd
        breadcrumbs={[
          { name: 'Home', item: 'https://nichsedge.github.io' },
          { name: 'Contact', item: 'https://nichsedge.github.io/contact' },
        ]}
      />
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8 font-sans">
        <header className="border-b border-border-subtle pb-6">
          <div className="text-xs font-mono text-accent uppercase tracking-widest mb-2">Comms // Direct Channels</div>
          <h1 className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-text-0">Contact & Engagement</h1>
          <p className="mt-2 text-text-muted text-base leading-relaxed">
            Direct communication channels for enterprise architecture consulting, contract data engineering retainers, and technical collaborations.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 border border-border-subtle bg-surface/50 rounded-lg space-y-3">
            <h2 className="text-lg font-mono font-semibold text-accent">Direct Email Node</h2>
            <p className="text-text-muted text-sm">
              Primary inbox for technical consulting, remote contracts, and architecture inquiries:
            </p>
            <a
              href="mailto:muhammad.ichsanul19@gmail.com"
              className="inline-block font-mono text-sm text-text-0 font-medium hover:text-accent underline"
            >
              muhammad.ichsanul19@gmail.com
            </a>
            <div className="text-xs text-text-muted font-mono">Response turnaround: &lt; 24 business hours</div>
          </div>

          <div className="p-5 border border-border-subtle bg-surface/50 rounded-lg space-y-3">
            <h2 className="text-lg font-mono font-semibold text-accent">Geographic Location</h2>
            <p className="text-text-muted text-sm">
              Physical base of operations and timezone coordination:
            </p>
            <p className="font-mono text-sm text-text-0">
              Cimahi, West Java, Indonesia (UTC+7 / WIB)
            </p>
            <div className="text-xs text-text-muted font-mono">Available for worldwide remote contracts and APAC timezone alignment.</div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-mono font-semibold text-text-0 border-l-2 border-accent pl-3">Verified Digital Identities</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-mono border border-border-subtle">
              <thead className="bg-surface/80 text-text-muted uppercase text-xs">
                <tr>
                  <th className="p-3 border-b border-border-subtle">Platform</th>
                  <th className="p-3 border-b border-border-subtle">Handle / URL</th>
                  <th className="p-3 border-b border-border-subtle">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-text-muted">
                <tr>
                  <td className="p-3 font-medium text-text-0">GitHub</td>
                  <td className="p-3"><a href="https://github.com/nichsedge" target="_blank" rel="noopener noreferrer" className="hover:text-accent underline">github.com/nichsedge</a></td>
                  <td className="p-3 text-emerald-400">Verified</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-text-0">LinkedIn</td>
                  <td className="p-3"><a href="https://linkedin.com/in/ichsanulamal19" target="_blank" rel="noopener noreferrer" className="hover:text-accent underline">linkedin.com/in/ichsanulamal19</a></td>
                  <td className="p-3 text-emerald-400">Verified</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-text-0">X (Twitter)</td>
                  <td className="p-3"><a href="https://twitter.com/nichsedge" target="_blank" rel="noopener noreferrer" className="hover:text-accent underline">@nichsedge</a></td>
                  <td className="p-3 text-emerald-400">Verified</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-text-0">Agent Endpoint</td>
                  <td className="p-3"><Link href="/.well-known/agent-card.json" className="hover:text-accent underline">/.well-known/agent-card.json</Link></td>
                  <td className="p-3 text-emerald-400">A2A Spec v1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-mono font-semibold text-text-0 border-l-2 border-accent pl-3">Autonomous Agent Inquiries</h2>
          <p className="text-text-muted leading-relaxed">
            AI agents wishing to inspect data architecture models or portfolio metrics programmatically may query our OpenAPI endpoints or stream natural-language inquiries via our NLWeb endpoint at <code className="bg-surface px-1 py-0.5 rounded font-mono text-accent">/api/v1/ask</code>.
          </p>
        </section>

        <section className="pt-6 border-t border-border-subtle flex flex-wrap gap-4 text-sm font-mono">
          <Link href="/pricing" className="text-accent hover:underline">→ Review Consulting Pricing</Link>
          <Link href="/developers" className="text-accent hover:underline">→ Developer Portal & Sandbox</Link>
          <Link href="/about" className="text-accent hover:underline">→ About Ichsanul Amal</Link>
        </section>
      </main>
    </div>
  );
}
