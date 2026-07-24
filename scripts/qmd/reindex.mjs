#!/usr/bin/env node
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { findRepoRoot } from "../wiki/discover.mjs";

export function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env ?? process.env,
      stdio: options.stdio ?? "inherit",
    });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} failed (${signal ?? `exit ${code}`})`));
    });
  });
}

export async function reindexQmd(root, options = {}) {
  const executable = options.executable ?? process.env.QMD_BIN ?? path.join(root, "node_modules", ".bin", "qmd");
  const runner = options.runner ?? runCommand;
  await runner(executable, ["update"], { cwd: root, env: options.env });
  await runner(executable, ["embed"], { cwd: root, env: options.env });
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
if (invokedPath === fileURLToPath(import.meta.url)) {
  try {
    const rootArg = process.argv.find((arg) => arg.startsWith("--root="));
    const root = await findRepoRoot(rootArg ? rootArg.slice("--root=".length) : process.cwd());
    await reindexQmd(root);
  } catch (error) {
    process.stderr.write(`qmd reindex failed: ${error.message}\n`);
    process.exitCode = 1;
  }
}
