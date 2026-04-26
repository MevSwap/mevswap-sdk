import { describe, it, expect } from 'vitest'
import { UniswapClient, resolveErc20, decimalsOf } from '../src/evm'
import { RouteNotFoundError } from '../src/errors'

describe('UniswapClient', () => {
  it('returns a quote with route + min out', async () => {
    const u = new UniswapClient()
    const q = await u.quote({
      tokenIn: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      tokenOut: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      amountIn: 1_000_000_000_000_000_000n,
      slippageBps: 50,
    })
    expect(BigInt(q.amountOut)).toBeGreaterThan(0n)
    expect(BigInt(q.amountOutMin)).toBeLessThan(BigInt(q.amountOut))
    expect(q.route.length).toBeGreaterThan(0)
  })

  it('throws on zero input', async () => {
    const u = new UniswapClient()
    await expect(
      u.quote({ tokenIn: 'A', tokenOut: 'B', amountIn: 0n }),
    ).rejects.toBeInstanceOf(RouteNotFoundError)
  })

  it('builds a swap tx with valid calldata length', async () => {
    const u = new UniswapClient()
    const q = await u.quote({
      tokenIn: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      tokenOut: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      amountIn: 1_000_000_000_000_000_000n,
    })
    const tx = await u.buildSwapTx(q, '0x000000000000000000000000000000000000dead')
    expect(tx.data.startsWith('0x414bf389')).toBe(true)
    expect(tx.gasLimit).toBe('184000')
  })
})

describe('erc20 helpers', () => {
  it('resolves symbol to address', () => {
    expect(resolveErc20('USDC')).toBe('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48')
  })

  it('passes raw addr through unchanged', () => {
    const a = '0x1234567890abcdef1234567890abcdef12345678'
    expect(resolveErc20(a)).toBe(a)
  })

  it('returns canonical decimals', () => {
    expect(decimalsOf('USDC')).toBe(6)
    expect(decimalsOf('ETH')).toBe(18)
    expect(decimalsOf('UNKNOWN')).toBe(18)
  })
})
