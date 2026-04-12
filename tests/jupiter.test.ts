import { describe, it, expect } from 'vitest'
import { JupiterClient } from '../src/jupiter'
import { NATIVE_SOL_MINT, USDC_MINT } from '../src/constants'

describe('JupiterClient.quote', () => {
  it('returns a quote with route plan', async () => {
    const c = new JupiterClient()
    const q = await c.quote({
      inputMint: NATIVE_SOL_MINT,
      outputMint: USDC_MINT,
      amount: 1_000_000_000n,
    })
    expect(q.swapMode).toBe('ExactIn')
    expect(q.routePlan.length).toBeGreaterThan(0)
    expect(BigInt(q.outAmount)).toBeLessThanOrEqual(1_000_000_000n)
  })

  it('throws on zero amount', async () => {
    const c = new JupiterClient()
    await expect(
      c.quote({
        inputMint: NATIVE_SOL_MINT,
        outputMint: USDC_MINT,
        amount: 0n,
      })
    ).rejects.toThrow(/no swap route/)
  })

  it('respects custom slippageBps', async () => {
    const c = new JupiterClient()
    const q = await c.quote({
      inputMint: NATIVE_SOL_MINT,
      outputMint: USDC_MINT,
      amount: 1_000_000_000n,
      slippageBps: 200,
    })
    expect(q.slippageBps).toBe(200)
  })
})
