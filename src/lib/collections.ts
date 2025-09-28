export function dedupeBy<T>(arr: T[], keyFn: (item: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];

  for (const item of arr) {
    const key = keyFn(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }

  return out;
}

export function assertUniqueKeys<T>(arr: T[], keyFn: (item: T) => string, label = "list"): void {
  if (process.env.NODE_ENV === "production") return;

  const counts = new Map<string, number>();
  for (const item of arr) {
    const key = keyFn(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const duplicates = [...counts.entries()].filter(([, count]) => count > 1);
  if (duplicates.length === 0) return;

  // eslint-disable-next-line no-console
  console.warn(`[${label}] Duplicate keys detected:`, duplicates.map(([key, count]) => `${key}×${count}`));
}
