// module.exports = {
//     env: {
//         browser: true,
//         es2021: true,
//     },
//     globals: {
//         process: "readonly",
//     },
//     extends: [
//         "eslint:recommended",
//         "plugin:react/recommended",
//         "plugin:react/jsx-runtime",
//     ],
//     overrides: [
//         {
//             env: {
//                 node: true,
//             },
//             files: [".eslintrc.{js,cjs}", "webpack.config.js"],
//             parserOptions: {
//                 sourceType: "script",
//             },
//         },
//     ],
//     parserOptions: {
//         ecmaVersion: "latest",
//         sourceType: "module",
//     },
//     plugins: ["react"],
//     rules: {
//         "react/jsx-uses-react": "off",
//         "react/react-in-jsx-scope": "off",
//         "no-unused-vars": "warn",
//         "react/jsx-key": "warn",
//         indent: "off",
//     },
// };

module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    globals: {
        process: "readonly",
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    overrides: [
        {
            env: {
                node: true,
            },
            files: [".eslintrc.{js,cjs}", "webpack.config.js"],
            parserOptions: {
                sourceType: "script",
            },
        },
    ],
    parser: "@typescript-eslint/parser",
    root: true,
    ignorePatterns: [".eslintrc.js"],
    parserOptions: {
        ecmaVersion: "latest",
        project: "tsconfig.json",
        tsconfigRootDir: __dirname,
        sourceType: "module",
    },
    plugins: ["react", "@typescript-eslint/eslint-plugin"],
    rules: {
        indent: "off",
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",
        "no-unused-vars": "off",
        "react/jsx-key": "warn",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-unused-expressions": "off",
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-unused-vars": [
            "off",
            // { argsIgnorePattern: "^_" },
        ],
        "prefer-const": "off",
        "no-empty": "off",
        "no-empty-function": "off",
        "react/prop-types": "off",
    },
};
