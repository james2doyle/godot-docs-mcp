import { describe, expect, it } from 'vitest';
import { default as fetchHandler } from '../src/index';

describe('fetch handler', () => {
  it('redirects to GitHub repo for non-mcp paths', async () => {
    const request = new Request('https://example.com/');
    const env = {} as Cloudflare.Env;
    const response = await fetchHandler.fetch(request, env, null);
    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe(
      'https://github.com/james2doyle/godot-docs-mcp',
    );
  });
});
