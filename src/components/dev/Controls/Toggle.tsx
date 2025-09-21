// Toggle.tsx
"use client";
export default function Toggle({
  label, value, onChange,
}: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 text-sm">
      <span className="font-comic">{label}</span>
      <input
        type="checkbox"
        checked={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.checked)}
      />
    </label>
  );
}
