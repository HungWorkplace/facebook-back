module.exports = {
  env: { es2020: true, node: true },
  extends: ["eslint:recommended"],
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    requireConfigFile: false,
    allowImportExportEverywhere: true,
  },
  plugins: [],
  rules: {
    // allow "any" type
    "@typescript-eslint/no-explicit-any": "off",

    // @ts-ignore from "error" to "warn"
    "@typescript-eslint/ban-ts-comment": "warn",

    // variable is defined but never used
    "@typescript-eslint/no-unused-vars": "warn",

    // if-else or code block from "error" to "..."
    "no-empty": "off",
  },
};
