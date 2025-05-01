import { FlatCompat } from "@eslint/eslintrc";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import filenameExport from "eslint-plugin-filename-export";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import vitestPlugin from "eslint-plugin-vitest";

// Create a compatibility layer to convert "extends" entries into flat-config
const compat = new FlatCompat({ baseDirectory: import.meta.url });

export default [
  // Extend recommended configs
  ...compat.extends("next/core-web-vitals"),
  ...compat.extends("next/typescript"),
  ...compat.extends("plugin:@typescript-eslint/recommended"),
  ...compat.extends("plugin:react/recommended"),
  ...compat.extends("plugin:react-hooks/recommended"),
  ...compat.extends("plugin:react/jsx-runtime"),
  ...compat.extends("airbnb"),
  ...compat.extends("airbnb-typescript"),
  ...compat.extends("prettier"),

  // Main configuration block
  {
    ignores: ["**/*.js", "**/__snapshots__/*"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooks,
      import: importPlugin,
      "filename-export": filenameExport,
      prettier: prettierPlugin,
      vitest: vitestPlugin,
    },
    rules: {
      // React rules
      "react/prop-types": "off",
      "react/jsx-props-no-spreading": "off",
      "react/require-default-props": "off",
      "react/react-in-jsx-scope": "off",

      // Import/export rules
      "import/prefer-default-export": "off",
      "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
      "import/order": [
        "error",
        {
          groups: [["builtin", "external"], "internal", ["parent", "sibling", "index"]],
          pathGroups: [{ pattern: "@/**", group: "internal", position: "before" }],
          pathGroupsExcludedImportTypes: ["internal"],
          alphabetize: { order: "asc", caseInsensitive: true },
          "newlines-between": "always",
        },
      ],

      // Filename export enforcement
      "filename-export/match-default-export": "off",

      // Vitest rules
      "vitest/vitest-in-dependencies": "off",

      // Prettier integration
      "prettier/prettier": ["error"],

      // Other custom rules
      "max-len": ["error", { code: 120 }],
      "@typescript-eslint/no-non-null-assertion": "error",
      "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
      camelcase: ["error", { properties: "always" }],
      "no-trailing-spaces": ["error", { skipBlankLines: false }],
      "react/function-component-definition": "off",
    },
    settings: {
      react: { version: "detect" },
    },
  },

  // File-specific overrides
  {
    files: ["**/app/**/page.tsx", "**/app/**/layout.tsx", "stories/**", "stores/**"],
    rules: {
      "filename-export/match-default-export": "off",
    },
  },
];
