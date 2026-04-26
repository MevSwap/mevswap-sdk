import { MevSwap } from 'mevswap'

const client = new MevSwap({
  agentId: 'trading-agent-01',
  onApprovalRequired: async (req) => {
    console.log(
      `agent wants to swap ${req.amount} ${req.from} -> ${req.to} (est ${req.estimatedOutput})`
    )
    // gate to a human-in-the-loop tool, slack, etc.
    return true
  },
})

async function main() {
  const result = await client.swap({
    from: 'ETH',
    to: 'PEPE',
    amount: 0.05,
    rules: {
      requireApproval: true,
      maxSlippage: 2,
      maxAmountUsd: 250,
      allowedTokens: ['USDC', 'DAI', 'PEPE'],
    },
  })

  console.log('done:', result.txHash)
}

main().catch(console.error)
