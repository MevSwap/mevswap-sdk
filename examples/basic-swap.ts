import { MevSwap } from 'mevswap'

async function main() {
  const swap = new MevSwap()

  const result = await swap.swap({
    from: 'SOL',
    to: 'USDC',
    amount: 1,
    privacy: 'zk',
  })

  console.log('tx:', result.txHash)
  console.log('out:', result.amountOut, result.to)
  console.log('priceImpact:', result.priceImpact, '%')
}

main().catch(console.error)
