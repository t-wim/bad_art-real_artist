export type Vote = { memeId: string; voter: string; weight: number; ts: number };

const memory: Record<string, number> = Object.create(null);

/** Adds a vote to a meme id. In production replace with DB/chain call. */
export async function voteForMeme(memeId: string, weight = 1) {
  memory[memeId] = (memory[memeId] ?? 0) + weight;
  return { memeId, total: memory[memeId] };
}

/** Returns current totals for a list of ids. */
export async function tally(ids: string[]) {
  return ids.map((id) => ({ memeId: id, total: memory[id] ?? 0 }));
}
