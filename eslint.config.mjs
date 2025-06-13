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
      "@typescript-eslint/no-unused-vars": "warn", // Warn on unused variables
      "@typescript-eslint/no-explicit-any": "warn", // Warn on usage of 'any'
      "@typescript-eslint/no-non-null-asserted-optional-chain": "warn", // Warn on unsafe optional chaining
      "@next/next/no-img-element": "warn", // Warn instead of error for <img>
    },
  },
];

export default eslintConfig;
