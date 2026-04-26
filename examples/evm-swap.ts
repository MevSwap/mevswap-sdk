import { UniswapClient, resolveErc20 } from '../src/evm'

async function main() {
  const uni = new UniswapClient()

  const tokenIn = resolveErc20('ETH')
  const tokenOut = resolveErc20('USDC')

  const quote = await uni.quote({
    tokenIn,
    tokenOut,
    amountIn: 1_000_000_000_000_000_000n,
    slippageBps: 50,
  })

  console.log('route fee tier:', quote.feeTier)
  console.log('out:           ', quote.amountOut)
  console.log('min out:       ', quote.amountOutMin)
  console.log('gas:           ', quote.gasEstimate)

  const tx = await uni.buildSwapTx(quote, '0x000000000000000000000000000000000000dead')
  console.log('to:            ', tx.to)
  console.log('value:         ', tx.value)
  console.log('calldata len:  ', tx.data.length)
}

main().catch(console.error)
