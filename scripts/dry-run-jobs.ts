process.env.JOB_DRY_RUN = process.env.JOB_DRY_RUN ?? "1";

type JobLoader = () => Promise<() => Promise<void>>;

type Task = {
  name: string;
  loader: JobLoader;
};

const tasks: Task[] = [
  {
    name: "milestone-runner",
    loader: async () => (await import("../jobs/milestone-runner")).runMilestoneCron,
  },
  {
    name: "mirror-sync",
    loader: async () => (await import("../jobs/mirror-sync")).runMirrorSync,
  },
  {
    name: "x-posts",
    loader: async () => (await import("../jobs/x-posts")).runXPostDispatch,
  },
];

function isPrismaMissing(error: unknown): boolean {
  return typeof error === "string"
    ? error.includes("did not initialize yet")
    : error instanceof Error && /did not initialize yet/i.test(error.message);
}

async function main() {
  const failures: Array<{ name: string; error: unknown }> = [];
  for (const task of tasks) {
    try {
      const job = await task.loader();
      await job();
      console.log(`[jobs] ${task.name} completed`);
    } catch (error) {
      if (isPrismaMissing(error)) {
        console.warn(`[jobs] ${task.name} skipped (missing Prisma client)`);
        continue;
      }
      failures.push({ name: task.name, error });
      console.error(`[jobs] ${task.name} failed`, error);
    }
  }

  if (failures.length) {
    process.exitCode = 1;
  }
}

main();
