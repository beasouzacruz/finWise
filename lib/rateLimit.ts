const hits = new Map<string, { n: number; reset: number }>();

/** Limitador simples em memória (suficiente para MVP; em produção use Redis/Upstash). */
export function rateLimit(key: string, max = 8, windowMs = 60_000) {
  const now = Date.now();
  const h = hits.get(key);
  if (!h || h.reset < now) { hits.set(key, { n: 1, reset: now + windowMs }); return true; }
  h.n += 1;
  return h.n <= max;
}
