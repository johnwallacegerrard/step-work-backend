const globals = require("globals");
const js = require("@eslint/js");

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-underscore-dangle": "off",
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "next",
        },
      ],
    },
  },
];
