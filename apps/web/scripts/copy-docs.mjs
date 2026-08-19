// Copies the static docs pages (apps/docs) into the web app's public/ folder so
// they ship with the Next.js deployment and are reachable at /docs/*.
//
// apps/docs stays the single source of truth — this is a build step, not a fork.
// Run explicitly from the dev/build scripts: pnpm does not run pre* lifecycle
// hooks by default.
import { cpSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "..", "..", "docs");
const target = join(here, "..", "public", "docs");

rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });

for (const file of readdirSync(source)) {
  if (!file.endsWith(".html")) continue;
  cpSync(join(source, file), join(target, file));
}

console.log(`copied docs -> public/docs`);
