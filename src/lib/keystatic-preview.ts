export const previewHost = 'codex-revly-preview.revly-private-preview.pages.dev';
export const previewBranch = 'codex/revly-preview';

export interface KeystaticEnv {
  ASSETS: Fetcher;
  KEYSTATIC_GITHUB_CLIENT_ID?: string;
  KEYSTATIC_GITHUB_CLIENT_SECRET?: string;
  KEYSTATIC_SECRET?: string;
}
