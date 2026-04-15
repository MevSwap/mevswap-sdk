import { MevSwapMCP } from 'mevswap'

const server = new MevSwapMCP({
  agentId: process.env.AGENT_ID,
})

console.log('exposed tools:')
for (const t of server.tools()) {
  console.log(` - ${t.name}: ${t.description}`)
}

async function main() {
  const result = await server.call('swap', {
    from: 'SOL',
    to: 'USDC',
    amount: 1,
    privacy: 'zk',
  })
  console.log(result)
}

main().catch(console.error)
