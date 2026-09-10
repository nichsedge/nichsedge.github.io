import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';

export const metadata = {
  title: '404 - Not Found // NICHSEDGE',
  description: 'The requested resource does not exist on this server. Machine-readable directory pointers included.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg text-text-0">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 font-mono">
        <div className="text-xs text-accent uppercase tracking-widest">[ERR_HTTP_404 // RESOURCE_NOT_FOUND]</div>
        <h1 className="text-4xl font-bold tracking-tight text-text-0">404 - Not Found</h1>
        
        <p className="text-text-muted text-sm leading-relaxed max-w-md mx-auto">
          The requested path does not exist on this server. Autonomous agents and web crawlers should consult the following index pointers to recover:
        </p>

        {/* Agent recovery block formatted in clean markdown-friendly style */}
        <div className="text-left bg-surface/70 border border-border-subtle p-5 rounded-lg text-xs space-y-2">
          <div className="text-accent font-semibold mb-2"># Machine-Readable Recovery Pointers</div>
          <div>- Sitemap XML: <Link href="/sitemap.xml" className="text-text-0 underline hover:text-accent">https://nichsedge.github.io/sitemap.xml</Link></div>
          <div>- LLMS Index: <Link href="/llms.txt" className="text-text-0 underline hover:text-accent">https://nichsedge.github.io/llms.txt</Link></div>
          <div>- Markdown Root: <Link href="/index.md" className="text-text-0 underline hover:text-accent">https://nichsedge.github.io/index.md</Link></div>
          <div>- OpenAPI Spec: <Link href="/openapi.json" className="text-text-0 underline hover:text-accent">https://nichsedge.github.io/openapi.json</Link></div>
          <div>- Agent Discovery: <Link href="/.well-known/ard.json" className="text-text-0 underline hover:text-accent">https://nichsedge.github.io/.well-known/ard.json</Link></div>
          <div>- Developer Portal: <Link href="/developers" className="text-text-0 underline hover:text-accent">https://nichsedge.github.io/developers</Link></div>
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-block px-5 py-2.5 bg-accent/10 border border-accent text-accent rounded hover:bg-accent hover:text-bg transition-colors text-xs uppercase tracking-wider"
          >
            ← Return to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
