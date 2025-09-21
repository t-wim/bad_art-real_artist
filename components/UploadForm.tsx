"use client";

import React, { useState } from "react";
import { uploadImage } from "@/lib/upload";

type Props = {
  onDone?: (url: string) => void;
};

export default function UploadForm({ onDone }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const form = e.currentTarget;
      const fileInput = form.elements.namedItem("file") as HTMLInputElement;
      const file = fileInput.files?.[0];
      if (!file) throw new Error("No file selected");
      const url = await uploadImage(file);
      onDone?.(url);
    } catch (err: any) {
      setError(err?.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <input name="file" type="file" accept="image/*" className="text-sm md:text-base" />
      <button disabled={busy} className="rounded-xl border px-4 py-2 text-sm md:text-base hover:shadow disabled:opacity-60">
        {busy ? "Uploading…" : "Upload"}
      </button>
      {error && <p className="text-red-600 text-xs md:text-sm">{error}</p>}
    </form>
  );
}
