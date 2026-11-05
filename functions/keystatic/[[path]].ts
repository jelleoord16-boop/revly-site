import { previewBranch, previewHost, type KeystaticEnv } from '../../src/lib/keystatic-preview';

export const onRequestGet: PagesFunction<KeystaticEnv> = async ({ request, env }) => {
  const url = new URL(request.url);
  if (url.hostname !== previewHost) return new Response('Not found', { status: 404 });

  if (url.pathname === '/keystatic' || url.pathname === '/keystatic/') {
    url.pathname = '/keystatic/branch/' + encodeURIComponent(previewBranch);
    return Response.redirect(url, 302);
  }

  url.pathname = '/_keystatic-shell/';
  url.search = '';
  const shell = await env.ASSETS.fetch(new Request(url, request));
  return new Response(shell.body, {
    status: shell.status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
};
