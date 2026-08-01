import js from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // Zoznam musí kopírovať výstupné adresáre z .gitignore. Všetko sú to
  // zbuildované balíky: `pages-dist` robí scripts/export-github-pages.mjs,
  // `.vercel/output` vzniká pri builde s NITRO_PRESET=vercel.
  //
  // V CI to neprekáža, lebo lint beží skôr než build. Lokálne ale po
  // builde `bun run lint` padal na zminifikovaných balíkoch — naposledy
  // 45 967 chýb, z toho ani jedna v zdrojákoch. Také množstvo šumu
  // spoľahlivo prekryje skutočnú chybu, tak nech sem nelezie.
  { ignores: ["dist", ".output", ".vinxi", "pages-dist", ".vercel", ".wrangler"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "server-only",
              message:
                "TanStack Start does not use the Next.js `server-only` package. Rename the module to `*.server.ts` or mark it with `@tanstack/react-start/server-only`.",
            },
          ],
        },
      ],
      "react-refresh/only-export-components": ["error", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    files: [
      "src/components/ui/**/*.{ts,tsx}",
      "src/components/site/motion-primitives.tsx",
      "src/components/DemoViewer.tsx",
    ],
    rules: {
      // These are intentionally shared primitive modules. They export a component
      // together with its variants, hooks or motion constants by design.
      "react-refresh/only-export-components": "off",
    },
  },
  eslintPluginPrettier,
);
