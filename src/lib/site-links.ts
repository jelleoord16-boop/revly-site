export function isSiteLink(url: string) {
  return /^(?:\/(?![\/\\])|https?:\/\/)/i.test(url) && !/[\u0000-\u0020\\]/.test(url);
}
