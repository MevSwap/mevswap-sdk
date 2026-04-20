# roadmap

what is shipped, what is next, what is later. dates are intent, not promises.

## shipped

- core swap client with zk privacy mode
- jupiter v6 quote + swap-ix integration
- private-bundle relay submission
- mcp server (`swap`, `quote` tools)
- spending rules engine
- typed errors

## q2 2026

- [ ] multi-hop zk routing (currently single-hop privacy boundary)
- [ ] limit orders behind the privacy layer
- [ ] dynamic relay selection based on health + tip economics
- [ ] mcp resource for live pool depth

## q3 2026

- [ ] cross-chain swaps (wormhole + zk bridge proof)
- [ ] agent portfolio management primitives (rebalance, dca)
- [ ] bundled fail-tolerant swaps (atomic n-leg trades)

## q4 2026

- [ ] permissioned multi-agent swap pools
- [ ] on-chain spending rules contract (rules enforced by program, not by sdk)
- [ ] zk audit trail export (selective disclosure for compliance)

## not on the roadmap

- evm / non-solana chains beyond cross-chain bridging — out of scope
- mempool monitoring tools — out of scope
- general dex aggregator features — that is jupiter's job
