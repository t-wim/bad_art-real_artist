import { dedupeBy } from "@/lib/collections";
import { getStableKey } from "@/lib/keyPolicy";

export type MergePageOptions = {
  scope?: string;
  cursor?: string;
};

export type MergeableItem = {
  id: string;
  [key: string]: unknown;
};

export function mergePage<T extends MergeableItem>(
  previous: T[],
  incoming: T[],
  options?: MergePageOptions,
): T[] {
  const { scope, cursor } = options ?? {};
  const keyFn = (item: MergeableItem) => getStableKey({ id: item.id, scope, cursor });
  return dedupeBy([...previous, ...incoming], keyFn);
}
