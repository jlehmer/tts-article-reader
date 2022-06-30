module.exports = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": { 
    "project": "./tsconfig.json"
  },
  "plugins": ["import", "@typescript-eslint"],
  "extends": [
    "airbnb-base",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "arrow-body-style": ["error", "always"],
    "arrow-parens": ["error", "as-needed"],
    "class-methods-use-this": 0,
    "func-names": ["warn", "as-needed"],
    "import/extensions": ["error", {
      "ts": "never"
    }],
    "import/prefer-default-export": "off",
    "lines-between-class-members": 0,
    "padding-line-between-statements": [
      "error",
      {blankLine: "always", prev: ["const", "let", "var"], next: "*"},
      {blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"]},
      {blankLine: "always", prev: "*", next: "return"},
    ],
    "no-unused-expressions": ["warn", {
      "allowShortCircuit": true,
      "allowTernary": true
    }],
    "no-use-before-define": ["error", {
      "functions": false,
      "classes": false,
      "variables": false
    }],

    "@typescript-eslint/prefer-interfaces": "off",
    "@typescript-eslint/explicit-function-return-type": 2,
    "@typescript-eslint/no-var-requires": 2,
    
    "no-plusplus": ["error", {"allowForLoopAfterthoughts": true}],
    "no-bitwise": 2,
    "no-restricted-syntax": 2,
  },
  "env": {
    "node": true,
    "jest": true
  }
};