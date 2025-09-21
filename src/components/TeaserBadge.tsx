// ==============================
// file: src/components/TeaserBadge.tsx (unchanged)
// ==============================
type TeaserBadgeProps = { label: "SOON" | "SECRET"; variant?: "pink" | "purple" };
export default function TeaserBadge({ label, variant = "pink" }: TeaserBadgeProps) {
  const base = "inline-block px-2 py-1 text-xs font-comic rounded shadow-sm select-none";
  const styles = variant === "purple" ? "bg-bart-purple/90 text-bart-white" : "bg-bart-pink/90 text-bart-black";
  return <span className={`${base} ${styles}`} aria-hidden>{label}</span>;
}
