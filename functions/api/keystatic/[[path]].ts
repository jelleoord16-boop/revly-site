import { makeGenericAPIRouteHandler } from '@keystatic/core/api/generic';
import config from '../../../keystatic.preview.config';
import { previewHost, type KeystaticEnv } from '../../../src/lib/keystatic-preview';

export const onRequest: PagesFunction<KeystaticEnv> = async ({ request, env }) => {
  if (new URL(request.url).hostname !== previewHost) {
    return new Response('Not found', { status: 404 });
  }

  const clientId = env.KEYSTATIC_GITHUB_CLIENT_ID;
  const clientSecret = env.KEYSTATIC_GITHUB_CLIENT_SECRET;
  const secret = env.KEYSTATIC_SECRET;
  if (!clientId || !clientSecret || !secret) {
    return new Response('De GitHub-aanmelding voor Revly is nog niet ingesteld.', {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  const handle = makeGenericAPIRouteHandler({ config, clientId, clientSecret, secret });
  const { body, ...response } = await handle(request);
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'no-store');
  return new Response(body, { ...response, headers });
};
