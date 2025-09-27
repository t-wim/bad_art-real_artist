export type KeyParts = {
  id: string;
  scope?: string;
  cursor?: string;
};

/**
 * Build a stable, globally unique key using the intrinsic id plus optional scoping information.
 *
 * - `scope` groups ids that are only unique within a logical bucket (e.g. category).
 * - `cursor` keeps pagination-specific ids distinct when no scope is provided.
 */
export function getStableKey({ id, scope, cursor }: KeyParts): string {
  if (scope) return `${scope}:${id}`;
  return cursor ? `${id}@${cursor}` : id;
}
