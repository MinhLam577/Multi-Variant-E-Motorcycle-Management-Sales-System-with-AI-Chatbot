// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default tseslint.config(
    { ignores: ["dist", "node_modules"] },
    {
        languageOptions: {
            ecmaVersion: 2025,
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.es2021,
                process: "readonly",
            },
            parserOptions: {
                project: "./tsconfig.json",
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            react,
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        settings: { react: { version: "detect" } },
        rules: {
            ...js.configs.recommended.rules,
            ...tseslint.configs.recommended.rules,

            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/no-empty-object-type": "off",
            "no-empty": "off",
            "prefer-const": "off",
            "react/prop-types": "off",
            "react/jsx-uses-react": "off",
            "react/react-in-jsx-scope": "off",
            "react/jsx-key": "warn",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],
        },
    }
);
