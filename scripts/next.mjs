#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import process from 'node:process';

const require = createRequire(import.meta.url);
const nextBin = require.resolve('next/dist/bin/next');

const rawArgs = process.argv.slice(2);
const command = rawArgs.find((arg) => !arg.startsWith('-'));

// Detect platform constraints.
// Next.js Turbopack requires native SWC bindings which are unavailable on Android/Termux (only WASM bindings exist).
// On Fedora and standard Linux/macOS/Windows, native bindings are available and Turbopack is the default.
const isAndroid = process.platform === 'android';
const forceWebpack = Boolean(process.env.FORCE_WEBPACK);
const forceTurbopack = Boolean(process.env.FORCE_TURBOPACK);
const hasExplicitBundler = rawArgs.some(
  (arg) => arg === '--webpack' || arg === '--turbopack' || arg === '--turbo'
);

const args = [...rawArgs];

// Automatically fallback to Webpack on platforms lacking Turbopack native bindings (e.g. Android/Termux)
if ((command === 'dev' || command === 'build') && !hasExplicitBundler && !forceTurbopack) {
  if (isAndroid || forceWebpack) {
    // Insert --webpack right after the command verb
    const cmdIndex = args.indexOf(command);
    args.splice(cmdIndex + 1, 0, '--webpack');
  }
}

// Ensure sufficient V8 heap memory when running in memory-constrained default environments like Termux
const env = { ...process.env };
if ((isAndroid || forceWebpack) && !env.NODE_OPTIONS?.includes('--max-old-space-size')) {
  env.NODE_OPTIONS = `${env.NODE_OPTIONS || ''} --max-old-space-size=4096`.trim();
}

const child = spawn(process.execPath, [nextBin, ...args], {
  stdio: 'inherit',
  env,
});

// Let Next.js handle graceful shutdown on SIGINT/SIGTERM; wrapper waits for child exit
process.on('SIGINT', () => {});
process.on('SIGTERM', () => {});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 0);
  }
});
