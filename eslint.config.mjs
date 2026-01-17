import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Allow CSS custom properties (CSS variables) via style attribute
      // This is necessary for dynamic theming and is the recommended approach
      "react/forbid-component-props": "off",
      "react/forbid-dom-props": "off",
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
];

export default eslintConfig;
