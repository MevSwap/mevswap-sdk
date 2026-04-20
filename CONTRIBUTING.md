# contributing

mevswap is a small, focused sdk. contributions are welcome — keep them focused too.

## scope

the sdk does five things:

1. quote swaps via jupiter
2. enforce spending rules
3. generate and verify zk proofs
4. submit private bundles
5. expose an mcp surface for agents

if your change does not touch one of those, open an issue first to talk it through.

## dev loop

```bash
npm install
npm run dev      # tsup watch
npm test         # vitest
npm run build    # tsup build
```

## style

- prettier handles formatting. run `npx prettier --write .` before committing.
- tests live in `tests/`, one file per module.
- public api lives in `src/index.ts`. don't widen it without discussion.
- no comments that just explain what the code does. only comments that explain *why*.

## commits

use conventional prefixes: `feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`. keep them short. the *why* goes in the pr description, not the commit subject.

## opening a pr

- one logical change per pr. don't bundle a refactor with a feature.
- link the issue if there is one.
- if you touched public api, update the relevant doc in `docs/` and the changelog.
- if you touched the zk circuit, additional review is required — flag it in the pr title.
