import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { McpAgent } from 'agents/mcp';
import { z } from 'zod';
import packageJson from '../package.json';
import { getDocsPageForTerm, searchDocs } from './utils';

export interface Env {
  MCP_RATE_LIMITER: any;
}

const supportedVersions = ['stable', 'latest', '4.5', '4.4', '4.3'] as const;

// Define our MCP agent with tools
export class MyMCP extends McpAgent {
  server = new McpServer({
    name: 'Godot Documentation',
    version: packageJson.version,
  });

  async init() {
    this.server.tool(
      'search_docs',
      'Search the Godot docs by term. Will return URLs to the documentation for each matching term. The resulting URLs will need to have their page content fetched to see the documentation.',
      {
        searchTerm: z.string(),
        version: z.enum(supportedVersions).optional().default('stable'),
      },
      ({ searchTerm, version }) => searchDocs(searchTerm, version),
    );
    this.server.tool(
      'get_docs_page_for_term',
      'Get the Godot docs content by term. Will return the full documentation page for the first matching result.',
      {
        searchTerm: z.string(),
        version: z.enum(supportedVersions).optional().default('stable'),
      },
      ({ searchTerm, version }) => getDocsPageForTerm(searchTerm, version),
    );
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === '/mcp') {
      const ip = request.headers.get('cf-connecting-ip') || 'unknown';
      const { success } = await env.MCP_RATE_LIMITER.limit({ key: ip });

      if (!success) {
        return new Response('Rate limited', { status: 429 });
      }

      return MyMCP.serve('/mcp').fetch(request, env, ctx);
    }

    return new Response('Not found', { status: 404 });
  },
};
