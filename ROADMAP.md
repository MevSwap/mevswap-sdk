# roadmap

what is shipped, what is next, what is later. dates are intent, not promises.

## shipped

- core swap client with zk privacy mode
- ethereum mainnet — uniswap v3 quote + swap calldata
- chain-agnostic adapter layer (`ChainAdapter`)
- private-bundle relay submission (flashbots, mev-blocker)
- mcp server (`swap`, `quote` tools)
- spending rules engine
- typed errors
- legacy solana adapter (jupiter v6, kept for back-compat)

## q2 2026

- [ ] multi-hop zk routing (currently single-hop privacy boundary)
- [ ] base / arbitrum / optimism native quotes (currently inherits eth uniswap v3)
- [ ] limit orders behind the privacy layer
- [ ] dynamic relay selection based on health + tip economics
- [ ] mcp resource for live pool depth

## q3 2026

- [ ] cross-chain swaps (zk bridge proof)
- [ ] agent portfolio management primitives (rebalance, dca)
- [ ] bundled fail-tolerant swaps (atomic n-leg trades)
- [ ] uniswap v4 hooks support
- [ ] solana adapter sunset

## q4 2026

- [ ] permissioned multi-agent swap pools
- [ ] on-chain spending rules contract (rules enforced by program, not by sdk)
- [ ] zk audit trail export (selective disclosure for compliance)

## not on the roadmap

- general dex aggregator features beyond what uniswap exposes
- mempool monitoring tools — out of scope
