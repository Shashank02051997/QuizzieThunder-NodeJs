module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "commonjs": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "overrides": [
        {
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {

    }
}
