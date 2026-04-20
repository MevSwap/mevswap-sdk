# changelog

all notable changes to mevswap.

## [0.1.1] — 2026-03-24

- docs: full README rewrite + mev-protection framing
- bump deps

## [0.1.0] — 2026-03-20

- core swap client
- zk proof generation + verification
- jupiter v6 quote + swap-ix client
- private-bundle relay submission with status polling
- mcp server exposing `swap` and `quote`
- spending rules: `maxSlippage`, `requireApproval`, `allowedTokens`, `maxAmountUsd`
- typed errors: `MevSwapError` + 7 subclasses
- examples: basic swap, agent-with-rules, mcp-server, private-bundle, quote
- docs: architecture, mev-protection, zk-privacy, spending-rules, mcp-integration
- vitest test suite

## [0.0.1] — 2026-01-15

- repository scaffold
