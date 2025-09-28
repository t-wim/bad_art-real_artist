const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  {
    ignores: [
      ".next/**",
      ".vercel/**",
      "**/*.generated.*",
      "archive/**",
      "build/**",
      "coverage/**",
      "deprecated/**",
      "dist/**",
      "legacy/**",
      "next-env.d.ts",
      "node_modules/**",
      "out/**",
      "public/**/*.min.js",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: [
      "src/components/gallery/GalleryGrid.tsx",
      "src/features/gallery/**/*.ts",
      "src/features/gallery/**/*.tsx",
      "src/lib/keyPolicy.ts",
      "src/lib/collections.ts",
    ],
    rules: {
      "react-hooks/exhaustive-deps": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
];
