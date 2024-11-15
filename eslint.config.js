import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import stylistic from "@stylistic/eslint-plugin";
import globals from "globals";

const stylisticConfig = [
  stylistic.configs["recommended-flat"],
  stylistic.configs.customize({
    indent: 2,
    quotes: "double",
    semi: true,
    jsx: true,
    commaDangle: "never",
    spaceBeforeFunctionParen: true
  })
];

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    rules: {
      "react/no-unescaped-entities": "off"
    }
  },
  {
    ignores: ["dist/**/*"]
  },
  ...stylisticConfig
];
