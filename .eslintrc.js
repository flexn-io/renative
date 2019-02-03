module.exports = {
    "parser": "babel-eslint",
    "extends": [
        "airbnb",
    ],
    "env": {
        "node": true,
        "browser": true,
        "es6": true,
        "jest": true
    },
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true
        }
    },
    "plugins": [
        "jest"
    ],
    "rules": {
        "arrow-body-style": ["warn", "as-needed"],
        "camelcase": "off",
        "class-methods-use-this": "off",
        "indent": ["error", 4],
        "max-statements": ["warn", 20],
        "new-cap": ["error", { "capIsNew": false }],
        "no-duplicate-imports": "off",
        "no-param-reassign": ["error", { "ignorePropertyModificationsFor": ["el", "ref", "event"] }],
        "no-plusplus": "off",
        "no-shadow": ["error", { "builtinGlobals": false, "hoist": "functions", "allow": ["describe"] }],
        "react/jsx-filename-extension": ["error", { "extensions": [".js"] }],
        "react/jsx-indent": ["error", 4],
        "react/jsx-indent-props": ["error", 4],
        "react/require-extension": "off",
        "react/sort-comp": [
            "error",
            {
                "order": [
                    "type-annotations",
                    "static-methods",
                    "lifecycle",
                    "/^on.+$/",
                    "/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/",
                    "everything-else",
                    "/^render.+$/",
                    "render"
                ]
            }
        ],
        "object-curly-newline": ["error", {
            "ObjectExpression": { "minProperties": 6, "multiline": true, "consistent": true },
            "ObjectPattern": { "minProperties": 6, "multiline": true, "consistent": true }
        }],

        "import/prefer-default-export": "off",
        "import/no-extraneous-dependencies": "off",
        "import/no-duplicates": "error",

        "jsx-a11y/no-static-element-interactions": "off"
    }
};
