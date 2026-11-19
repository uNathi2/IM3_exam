export function assetUrl(path: string): string {
  if (!path) return path;
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  const clean = path.replace(/^\/+/, '');
  const base = import.meta.env.BASE_URL || '/';
  return base.endsWith('/') ? `${base}${clean}` : `${base}/${clean}`;
}
