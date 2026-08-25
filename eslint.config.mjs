export default [
  {
    ignores: ["dist/**", "node_modules/**", ".astro/**", "public/**"],
  },
  {
    files: ["**/*.{ts,js,astro}"],
    rules: {
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always"],
    },
  },
];
