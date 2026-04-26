import { MevSwap } from 'mevswap'

async function main() {
  const swap = new MevSwap()
  const q = await swap.quote('ETH', 'USDC', 10)
  console.log(`10 ETH -> ~${q.estimatedOutput} USDC`)
  console.log(`route: ${q.route.join(' -> ')}`)
  console.log(`priceImpact: ${q.priceImpact}%`)
}

main().catch(console.error)
