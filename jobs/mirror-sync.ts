import { syncMirrors } from "@/lib/services/mirror";

export async function runMirrorSync() {
  await syncMirrors();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runMirrorSync().catch((error) => {
    console.error("[mirror-sync] failed", error);
    process.exitCode = 1;
  });
}
