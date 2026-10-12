import { describe, expect, it } from 'vitest';
import { default as fetchHandler } from '../src/index';

const searchUrl = 'https://github.com/search?q=godot+mcp&type=repositories';

const env = {
  MCP_RATE_LIMITER: { limit: async () => ({ success: true }) },
} as unknown as Cloudflare.Env;

function mcpRequest(body: unknown) {
  return new Request('https://example.com/mcp', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json, text/event-stream',
    },
    body: JSON.stringify(body),
  });
}

describe('fetch handler', () => {
  it('redirects non-mcp paths to the alternatives search', async () => {
    const request = new Request('https://example.com/');
    const response = await fetchHandler.fetch(request, env, null);
    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe(searchUrl);
  });

  it('redirects browser visits to /mcp to the alternatives search', async () => {
    const request = new Request('https://example.com/mcp', {
      headers: { accept: 'text/html' },
    });
    const response = await fetchHandler.fetch(request, env, null);
    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe(searchUrl);
  });

  it('returns 405 for SSE stream GETs in stateless mode', async () => {
    const request = new Request('https://example.com/mcp', {
      headers: { accept: 'application/json, text/event-stream' },
    });
    const response = await fetchHandler.fetch(request, env, null);
    expect(response.status).toBe(405);
  });

  it('answers initialize with the retirement notice', async () => {
    const response = await fetchHandler.fetch(
      mcpRequest({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2025-06-18',
          capabilities: {},
          clientInfo: { name: 'test', version: '1.0.0' },
        },
      }),
      env,
      null,
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(JSON.stringify(body)).toContain('no longer maintained or hosted');
  });

  it('returns the retirement notice from tool calls', async () => {
    const response = await fetchHandler.fetch(
      mcpRequest({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: { name: 'search_docs', arguments: { searchTerm: 'node3d' } },
      }),
      env,
      null,
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(JSON.stringify(body)).toContain(searchUrl);
  });
});
