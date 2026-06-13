# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An n8n **community node** package that exposes a single "HTML to PDF" node, wrapping the `wkhtmltopdf` binary. It is published to the npm registry and loaded by n8n at runtime — it is a library, not a runnable app.

## Commands

This repo uses **pnpm** as its only package manager (`pnpm-lock.yaml` is the lockfile; there is no `package-lock.json`).

- `pnpm build` — compile TypeScript to `dist/` then copy `.svg`/`.png` icons via gulp (`gulp build:icons`). Icons are NOT handled by `tsc`, so a plain `tsc` will produce a node with a missing icon.
- `pnpm dev` — `tsc --watch` (no icon copying).
- `pnpm lint` / `pnpm lintfix` — eslint over `nodes/**/*.ts` and `package.json`.
- `pnpm format` — prettier over `nodes` and `credentials`.

There is no test suite. To verify changes, build and load the compiled node into a local n8n instance (symlink/mount the repo into `~/.n8n/custom/`, then restart n8n).

## Architecture

The entire node lives in `nodes/HtmlToPdf/HtmlToPdf.node.ts` (`index.js` is empty; n8n discovers the node via the `n8n.nodes` array in `package.json`, which points at `dist/nodes/HtmlToPdf/HtmlToPdf.node.js`). Three files travel together per node: `.node.ts` (logic + UI schema), `.node.json` (codex metadata: categories, docs links, aliases), and the `.svg` icon.

Key things to know when editing the node:

- **Binary path resolution.** At module load the `wkhtmltopdf.command` is set per-platform (win32 / linux / darwin defaults). It is then overridden at execution time by the `wkhtmltopdfBinaryPath` node parameter, whose *default* is that platform value. The `wkhtmltopdf` system binary must exist on the host/container — this package only shells out to it.
- **Options object** passed to `wkhtmltopdf` is assembled from individual UI parameters (page size, orientation, four margins, javascript). `enableLocalFileAccess: true` is always set.
- **Custom Options** is a free-text field of space-separated CLI flags, parsed manually: `--flag` becomes `{flag: true}`, `key=value` becomes `{key: value}`. Note this strips the `--` for `key=value`-style flags only by the `--` branch, so `--key=value` won't parse as expected — keep this parsing quirk in mind.
- **Output formats** (`outputFormat` param): `binary` (n8n binary property, recommended), `base64` (JSON string), `filepath` (writes to `os.tmpdir()` and returns the path).
- **Per-item loop** with `continueOnFail()` support: on error, if continue-on-fail is set, an `{error}` JSON item is pushed; otherwise the error throws. Input item fields are spread into the output (`...items[i]`).
- Conversion is promisified around the `wkhtmltopdf(input, options, cb)` stream callback; the same stream-collecting logic is duplicated for the URL vs. raw-HTML branches.

## Conventions

- TypeScript config is intentionally loose (`strict: false`, `noImplicitAny: false`, etc.). The code uses `any` liberally for the untyped `wkhtmltopdf` module.
- Indentation is tabs (see existing `.node.ts`).
- ESLint uses `eslint:recommended` only — n8n-specific rules (`no-console`, `no-unused-vars`, `no-undef`) are turned off. The `eslint-plugin-n8n-nodes-base` dependency is present but not wired into `.eslintrc.js`.

## Publishing

`prepublishOnly` runs build + lint. A single GitHub Actions workflow, `.github/workflows/one-shot-npm-publish.yml`, handles releases: it bumps the version, commits and tags, then runs `pnpm publish --no-git-checks` to the npm registry. The `files` whitelist in `package.json` ships only `dist/`.
