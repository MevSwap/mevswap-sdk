<p align="center">
  <img src="assets/banner.png" alt="mevswap" width="100%" />
</p>

<h3 align="center">private swaps. without the sandwich.</h3>

<p align="center">
  <b>routes every trade through a zk privacy layer so mev bots cannot see what you are doing.</b>
</p>

<p align="center">
mev-protected swap sdk for solana. hides wallet identity, amounts, and routing paths from frontrunners and sandwich bots. built for humans who want privacy. built for ai agents that need to swap autonomously.
</p>

<p align="center">
  <a href="https://mevswap.org"><img src="https://img.shields.io/badge/site-mevswap.org-1E90FF?style=flat-square&labelColor=1a1a1a" /></a>
  <a href="https://x.com/SwapMEV"><img src="https://img.shields.io/badge/twitter-@SwapMEV-1E90FF?style=flat-square&labelColor=1a1a1a&logo=x&logoColor=white" /></a>
  <a href="https://www.npmjs.com/package/mevswap"><img src="https://img.shields.io/npm/v/mevswap?style=flat-square&labelColor=1a1a1a&color=1E90FF" /></a>
  <a href="https://www.npmjs.com/package/mevswap"><img src="https://img.shields.io/npm/dm/mevswap?style=flat-square&labelColor=1a1a1a&color=00B8FF&label=downloads" /></a>
  <img src="https://img.shields.io/badge/license-MIT-1E90FF?style=flat-square&labelColor=1a1a1a" />
  <img src="https://img.shields.io/badge/typescript-5.9-3178C6?style=flat-square&labelColor=1a1a1a" />
  <img src="https://img.shields.io/badge/node-%E2%89%A518-43853D?style=flat-square&labelColor=1a1a1a" />
</p>

---

## what it does

every swap is validated through zero-knowledge proofs. the chain sees that a valid trade happened. it does not see who, how much, or through which route. mev bots cannot frontrun what they cannot read.

```ts
import { MevSwap } from 'mevswap'

const swap = new MevSwap({ agentId: 'my-agent' })

const result = await swap.swap({
  from: 'SOL',
  to: 'USDC',
  amount: 10,
  privacy: 'zk',
  rules: {
    maxSlippage: 1,
    requireApproval: false,
  }
})
// swapped privately in 280ms. no sandwich. no trace.
```

---

## install

```bash
npm install mevswap
```

---

## why

| | |
|---|---|
| **mev protection** | zk-routed orders are invisible to sandwich and frontrun bots |
| **zk privacy** | wallet identity, amount, and route never hit the public mempool |
| **agent native** | built for autonomous ai agents via mcp integration |
| **spending rules** | `maxSlippage`, `requireApproval`, token whitelist, `maxAmountUsd` |
| **jupiter routing** | best price across every solana dex, settled privately |
| **mcp server** | native tool for claude, gpt, cursor |

---

## usage

### basic swap

```ts
import { MevSwap } from 'mevswap'

const client = new MevSwap()

const result = await client.swap({
  from: 'SOL',
  to: 'USDC',
  amount: 5,
  privacy: 'zk',
})

console.log(result.txHash)
console.log(result.amountOut)
```

### with approval gate

```ts
const client = new MevSwap({
  agentId: 'trading-agent-01',
  onApprovalRequired: async (req) => {
    console.log(`agent wants to swap ${req.amount} ${req.from} to ${req.to}`)
    return true
  }
})

const result = await client.swap({
  from: 'SOL',
  to: 'BONK',
  amount: 1,
  rules: {
    requireApproval: true,
    maxSlippage: 2,
    allowedTokens: ['USDC', 'BONK', 'JUP'],
  }
})
```

### mcp integration

```ts
import { MevSwapMCP } from 'mevswap'

const server = new MevSwapMCP({ agentId: process.env.AGENT_ID })
const tools = server.tools()
const result = await server.call('swap', { from: 'SOL', to: 'USDC', amount: 5 })
```

---

## spending rules

```ts
rules: {
  requireApproval: true,
  maxSlippage: 1,
  maxAmountUsd: 500,
  allowedTokens: ['USDC', 'SOL', 'JUP'],
}
```

agents are not free to do whatever. you set the rails. they swap inside them.

---

## roadmap

- [x] core swap sdk
- [x] zk privacy layer
- [x] mev-protected order routing
- [x] mcp integration
- [x] spending rules engine
- [ ] multi-hop zk routing (q2 2026)
- [ ] cross-chain swaps (q3 2026)
- [ ] agent portfolio management (q3 2026)

---

## links

- site → [mevswap.org](https://mevswap.org)
- twitter → [@SwapMEV](https://x.com/SwapMEV)
- npm → [mevswap](https://www.npmjs.com/package/mevswap)

---

## license

MIT
