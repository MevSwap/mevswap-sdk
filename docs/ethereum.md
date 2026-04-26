# ethereum

mevswap's primary execution path. ethereum mainnet plus base, arbitrum, optimism — all routed through the same `EvmAdapter`.

## what's wired

| piece | impl |
|---|---|
| quote | uniswap v3 quoter (`0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6`) |
| swap | uniswap v3 router (`0xE592427A0AEce92De3Edee1F18E0157C05861564`) or universal router |
| relay | flashbots (`relay.flashbots.net`), mev-blocker (`rpc.mevblocker.io`) |
| nonce strategy | latest pending, replaced if relay drops |
| gas | priority fee inferred from base + 2 gwei tip |

## fee tier selection

the adapter picks a uniswap fee tier based on token type:

- stable ↔ stable → `100` (0.01%)
- stable ↔ volatile → `500` (0.05%)
- volatile ↔ volatile → `3000` (0.3%)

custom routing through a specific tier is possible via the lower-level `UniswapClient.quote()`.

## supported tokens

```ts
ETH    NATIVE
WETH   0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
USDC   0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
USDT   0xdAC17F958D2ee523a2206206994597C13D831ec7
DAI    0x6B175474E89094C44Da98b954EedeAC495271d0F
```

any other erc20 address can be passed directly — the adapter will not try to resolve a symbol if the input is already a 0x address.

## l2s

passing `chain: 'base' | 'arbitrum' | 'optimism'` routes to the same uniswap v3 deployment on that l2. private bundle relays default to flashbots-protect-style endpoints; on rollups without a relay the bundle falls back to a direct `eth_sendRawTransaction`.

## why uniswap v3

- liquidity. v3 still has the deepest pools across the eth ecosystem.
- predictable calldata. the swap path is deterministic from the quote, which keeps the proof witness small.
- no permit2 dance unless you want it. signed approvals are optional.

v4 hooks support is on the roadmap.
