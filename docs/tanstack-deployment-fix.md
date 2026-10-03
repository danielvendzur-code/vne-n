# TanStack deployment repair

The Vercel deployment of merge `a438523` failed while downloading the locked
TanStack packages. Update the coordinated Start dependency graph rather than
disabling Vercel's security checks:

- `@tanstack/react-start`: 1.168.26 → 1.168.60
- `@tanstack/react-router`: 1.170.16 → 1.170.41
- `@tanstack/router-plugin`: 1.168.18 → 1.168.42
- Transitive `@tanstack/start-server-core`: 1.169.15 → 1.169.39

Both Bun and npm lockfiles are regenerated. The existing Vercel installer still
checks locked SHA-512 integrity values. Node 22, Bun 1.4.2, Vite 8 and Nitro stay
on the existing compatible configuration.

Also update the existing `js-yaml` override to 4.3.2 and resolve
`brace-expansion` to patched 1.1.21 / 5.0.12 versions.

## Verification

- Empty dependency directory and empty Bun cache: the exact Vercel frozen
  installer downloads and installs successfully, without HTTP 403.
- Source security audit, lint and all 48 tests pass.
- Vercel output and Node server production builds pass.
- `npm audit --omit=dev --audit-level=high`: no vulnerabilities reported.

The full Bun audit still reports GHSA-vfj7-8cjw-p6xm in `braces@3.0.3`, used by
build tooling. The advisory has no published patched version. No advisory is
ignored and no deployment security check is disabled.
