'use client';

import React, { useEffect } from 'react';

declare module 'react' {
  interface FormHTMLAttributes<T> extends React.HTMLAttributes<T> {
    toolname?: string;
    tooldescription?: string;
  }
}

declare global {
  interface Document {
    modelContext?: {
      registerTool: (tool: {
        name: string;
        description: string;
        inputSchema?: Record<string, unknown>;
        execute: (args: Record<string, unknown>) => Promise<{ content: Array<{ type: string; text: string }> }>;
      }) => Promise<void> | void;
    };
  }
  interface Navigator {
    modelContext?: {
      registerTool: (tool: {
        name: string;
        description: string;
        inputSchema?: Record<string, unknown>;
        execute: (args: Record<string, unknown>) => Promise<{ content: Array<{ type: string; text: string }> }>;
      }) => Promise<void> | void;
    };
  }
}

export function WebMCPProvider() {
  useEffect(() => {
    const registerTools = async () => {
      const mc = document.modelContext || (typeof navigator !== 'undefined' ? navigator.modelContext : undefined);
      if (!mc || typeof mc.registerTool !== 'function') return;

      try {
        await mc.registerTool({
          name: 'get_profile_dossier',
          description: 'Fetch technical biography, education, current role, and contact points of Ichsanul Amal (Nichsedge).',
          inputSchema: {
            type: 'object',
            properties: {
              section: {
                type: 'string',
                enum: ['all', 'experience', 'education', 'contact'],
                description: 'Section of dossier to retrieve',
              },
            },
          },
          execute: async (args) => {
            const res = await fetch('/api/v1/profile');
            const data = await res.json();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(args?.section ? data?.data?.[args.section as string] || data : data),
                },
              ],
            };
          },
        });

        await mc.registerTool({
          name: 'search_projects',
          description: 'Search data engineering projects, 3D simulations, and architecture frameworks.',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Keyword to filter projects',
              },
            },
          },
          execute: async () => {
            const res = await fetch('/api/v1/projects');
            const data = await res.json();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(data),
                },
              ],
            };
          },
        });

        await mc.registerTool({
          name: 'get_contact_info',
          description: 'Retrieve verified email and communication channels for contract or hiring inquiries.',
          inputSchema: {
            type: 'object',
            properties: {},
          },
          execute: async () => {
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({
                    name: 'Ichsanul Amal',
                    email: 'muhammad.ichsanul19@gmail.com',
                    website: 'https://nichsedge.github.io',
                    github: 'https://github.com/nichsedge',
                    location: 'Cimahi, West Java, Indonesia',
                  }),
                },
              ],
            };
          },
        });
      } catch (err) {
        console.debug('WebMCP registration notice:', err);
      }
    };

    registerTools();
  }, []);

  return (
    <aside className="sr-only" aria-hidden="true">
      {/* Declarative WebMCP tools for SSR agent crawlers */}
      <form
        toolname="get_profile_dossier"
        tooldescription="Fetch technical biography, education, current role, and contact points of Ichsanul Amal (Nichsedge)."
        action="/api/v1/profile"
        method="GET"
      >
        <input type="text" name="section" placeholder="all, experience, education, contact" />
        <button type="submit">Execute</button>
      </form>

      <form
        toolname="search_projects"
        tooldescription="Search data engineering projects, 3D simulations, and architecture frameworks."
        action="/api/v1/projects"
        method="GET"
      >
        <input type="text" name="query" placeholder="Search projects" />
        <button type="submit">Execute</button>
      </form>

      <form
        toolname="get_contact_info"
        tooldescription="Retrieve verified email and communication channels for contract or hiring inquiries."
        action="/contact"
        method="GET"
      >
        <button type="submit">Execute</button>
      </form>
    </aside>
  );
}
