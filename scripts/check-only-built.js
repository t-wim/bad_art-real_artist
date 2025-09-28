const fs = require("fs");
const path = require("path");

const pkgPath = path.join(process.cwd(), "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const list = pkg?.pnpm?.onlyBuiltDependencies ?? [];

if (process.env.CI === "true" && (!Array.isArray(list) || list.length === 0)) {
  // eslint-disable-next-line no-console
  console.warn(
    "[CI] Hinweis: 'pnpm.onlyBuiltDependencies' ist leer. Lokal 'pnpm approve-builds' ausführen, um CI-Prompts zu vermeiden."
  );
}
