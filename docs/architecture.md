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
         │ spending rules │ │  jupiter quote │ │   zk circuit   │
         │     gate       │ │   (best price) │ │     prover     │
         └────────┬───────┘ └────────┬───────┘ └────────┬───────┘
                  │                  │                  │
                  └──────────────────┼──────────────────┘
                                     ▼
                            ┌────────────────┐
                            │ private bundle │
                            │     relay      │
                            └────────┬───────┘
                                     ▼
                              solana mainnet
```

## stages

1. **rules gate** — `client.ts` checks the requested swap against the user's `SwapRules`: token whitelist, max usd amount, max slippage, approval gate. fails fast if the rules don't permit the trade.
2. **quote** — `jupiter.ts` asks Jupiter for the best multi-hop route. returns expected output, price impact, and serialized swap instructions.
3. **proof** — `zk.ts` builds a zero-knowledge proof over the user's commitment, the swap amount, and the recipient. the proof is verified before any tx hits the wire.
4. **bundle** — `mev.ts` packages the swap tx (and any tip / cleanup txs) into a private bundle and submits it to the protected relay so sandwich and frontrun bots cannot see it in the public mempool.
5. **land** — relay forwards the bundle to a leader; the swap settles privately with the wallet identity, amount, and route hidden behind the proof.

## modules

| module | responsibility |
|---|---|
| `client.ts` | top-level api surface for humans and agents |
| `mcp.ts` | mcp server exposing `swap` and `quote` as tools |
| `jupiter.ts` | jupiter v6 quote + swap-ix client |
| `zk.ts` | proof generation and verification |
| `mev.ts` | private bundle submission + status polling |
| `errors.ts` | typed errors agents can branch on |
| `utils.ts` | lamport math, bps math, validation |
| `constants.ts` | rpc urls, mints, circuit hash, decimals |
| `types.ts` | public type surface |

## why private bundles

a public swap on solana is fully visible in the mempool the moment it lands. mev bots watch the mempool, simulate every pending tx, and place sandwich orders around large swaps to extract value at your expense. private bundles route the tx to a leader directly, skipping the public mempool. the bot never sees the trade until it has already settled.

## why zk on top

private bundles hide the tx until it lands. zero-knowledge proofs hide the *content* of the tx after it lands. together: nothing leaks before, nothing leaks after.
