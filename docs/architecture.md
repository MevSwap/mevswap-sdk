# architecture

how a swap actually flows through mevswap, end to end.

```
┌──────────────┐    quote     ┌──────────────┐
│  user / ai   │ ───────────▶ │    client    │
│    agent     │              │  (MevSwap)   │
└──────────────┘              └──────┬───────┘
                                     │
                  ┌──────────────────┼──────────────────┐
                  ▼                  ▼                  ▼
         ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
         │ spending rules │ │ chain adapter  │ │   zk circuit   │
         │     gate       │ │  (uni / jup)   │ │     prover     │
         └────────┬───────┘ └────────┬───────┘ └────────┬───────┘
                  │                  │                  │
                  └──────────────────┼──────────────────┘
                                     ▼
                            ┌────────────────┐
                            │ private bundle │
                            │     relay      │
                            └────────┬───────┘
                                     ▼
                          ethereum / l2 / solana
```

## stages

1. **rules gate** — `client.ts` checks the requested swap against the user's `SwapRules`: token whitelist, max usd amount, max slippage, approval gate. fails fast if the rules don't permit the trade.
2. **quote** — the chain adapter asks the appropriate dex for the best route. on ethereum/l2 that's uniswap v3; on solana it's jupiter v6. returns expected output, price impact, and serialized calldata.
3. **proof** — `zk.ts` builds a zero-knowledge proof over the user's commitment, the swap amount, and the recipient. the proof is verified before any tx hits the wire.
4. **bundle** — `mev.ts` packages the swap tx (and any tip / cleanup txs) into a private bundle and submits it to the protected relay (flashbots on eth, jito-style on sol) so sandwich and frontrun bots cannot see it in the public mempool.
5. **land** — relay forwards the bundle to a builder/leader; the swap settles privately with the wallet identity, amount, and route hidden behind the proof.

## modules

| module | responsibility |
|---|---|
| `client.ts` | top-level api surface for humans and agents |
| `mcp.ts` | mcp server exposing `swap` and `quote` as tools |
| `adapters/` | chain-agnostic interface, evm + solana implementations |
| `evm/uniswap.ts` | uniswap v3 quote + swap calldata builder |
| `jupiter.ts` | jupiter v6 quote + swap-ix client (legacy solana path) |
| `zk.ts` | proof generation and verification |
| `mev.ts` | private bundle submission + status polling |
| `errors.ts` | typed errors agents can branch on |
| `utils.ts` | base unit math, bps math, validation |
| `constants.ts` | rpc urls, addresses, circuit hash, decimals |
| `types.ts` | public type surface |

## why private bundles

a public swap is fully visible in the mempool the moment it broadcasts. mev bots watch the mempool, simulate every pending tx, and place sandwich orders around large swaps to extract value at your expense. private bundles route the tx to a builder directly, skipping the public mempool. the bot never sees the trade until it has already settled.

## why zk on top

private bundles hide the tx until it lands. zero-knowledge proofs hide the *content* of the tx after it lands. together: nothing leaks before, nothing leaks after.
