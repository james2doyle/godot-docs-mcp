import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import packageJson from '../package.json';

const supportedVersions = [
  'stable',
  'latest',
  '4.6',
  '4.5',
  '4.4',
  '4.3',
] as const;

const alternativesUrl =
  'https://github.com/search?q=godot+mcp&type=repositories';

const retirementNotice = `This Godot docs MCP server has been retired — it's no longer maintained or hosted, because the running costs became too much to keep covering.

You still have options:

- Self-host it: clone https://github.com/james2doyle/godot-docs-mcp and deploy your own copy to Cloudflare (the README has instructions).
- Run it locally: in that same repo, run \`npm run dev\` to serve the docs on your machine at http://localhost:8787/mcp.
- Try another server: browse other Godot MCP servers at ${alternativesUrl}

Thanks for using it, and sorry for the disruption.`;

const retiredToolDescription =
  '[RETIRED] This server is no longer maintained or hosted — calling this tool returns a shutdown notice with self-hosting options and alternatives.';

function retirementResult(): CallToolResult {
  return {
    content: [{ type: 'text', text: retirementNotice }],
  };
}

function createServer() {
  const server = new McpServer(
    { name: 'Godot Documentation', version: packageJson.version },
    { instructions: retirementNotice },
  );

  const inputSchema = {
    searchTerm: z.string(),
    version: z.enum(supportedVersions).optional().default('stable'),
  };

  server.registerTool(
    'search_docs',
    { description: retiredToolDescription, inputSchema },
    retirementResult,
  );
  server.registerTool(
    'get_docs_page_for_term',
    { description: retiredToolDescription, inputSchema },
    retirementResult,
  );

  return server;
}

async function handleMcpRequest(request: Request) {
  // Stateless mode: no session state or Durable Object is needed to answer.
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  await createServer().connect(transport);

  return transport.handleRequest(request);
}

export default {
  async fetch(request: Request, env: Cloudflare.Env) {
    const url = new URL(request.url);

    if (url.pathname === '/mcp') {
      const accept = request.headers.get('accept') || '';

      if (request.method === 'GET' && !accept.includes('text/event-stream')) {
        return Response.redirect(alternativesUrl, 302);
      }

      const ip = request.headers.get('cf-connecting-ip') || 'unknown';
      const { success } = await env.MCP_RATE_LIMITER.limit({ key: ip });

      if (!success) {
        return new Response('Rate limited', { status: 429 });
      }

      if (request.method === 'GET') {
        // Stateless server: no SSE stream can be offered.
        return new Response('Method Not Allowed', {
          status: 405,
          headers: { Allow: 'POST, DELETE' },
        });
      }

      try {
        return await handleMcpRequest(request);
      } catch (error) {
        console.error('Failed to handle MCP request', error);

        return Response.json(
          {
            jsonrpc: '2.0',
            error: { code: -32603, message: 'Internal server error' },
            id: null,
          },
          { status: 500 },
        );
      }
    }

    return Response.redirect(alternativesUrl, 302);
  },
};
