项目启动：

```bash
pnpm install
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
npx husky add .husky/pre-commit 'pnpm run lint:lint-staged'
```

1. husky
