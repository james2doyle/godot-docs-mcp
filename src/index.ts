import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { McpAgent } from 'agents/mcp';
import { z } from 'zod';
import packageJson from '../package.json';
import { getDocsPageForTerm, searchDocs } from './utils';

const supportedVersions = [
  'stable',
  'latest',
  '4.6',
  '4.5',
  '4.4',
  '4.3',
] as const;

// Define our MCP agent with tools
export class MyMCP extends McpAgent {
  server = new McpServer({
    name: 'Godot Documentation',
    version: packageJson.version,
  });

  async init() {
    this.server.tool(
      'search_docs',
      'Search the Godot documentation by term. Returns URLs to the full documentation for each matching term. The resulting URLs will need to have their page content fetched to see the documentation.',
      {
        searchTerm: z.string(),
        version: z.enum(supportedVersions).optional().default('stable'),
      },
      ({ searchTerm, version }) => searchDocs(searchTerm, version),
    );
    this.server.tool(
      'get_docs_page_for_term',
      'Fetch content from the Godot documentation by term. Will only return a single documentation page for the first matching result.',
      {
        searchTerm: z.string(),
        version: z.enum(supportedVersions).optional().default('stable'),
      },
      ({ searchTerm, version }) => getDocsPageForTerm(searchTerm, version),
    );
  }
}

export default {
  async fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === '/mcp') {
      const ip = request.headers.get('cf-connecting-ip') || 'unknown';
      const { success } = await env.MCP_RATE_LIMITER.limit({ key: ip });

      if (!success) {
        return new Response('Rate limited', { status: 429 });
      }

      return MyMCP.serve('/mcp').fetch(request, env, ctx);
    }

    return Response.redirect(
      'https://github.com/james2doyle/godot-docs-mcp',
      302,
    );
  },
};
