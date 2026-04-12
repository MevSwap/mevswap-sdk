import { describe, it, expect } from 'vitest'
import { MevSwap } from '../src/client'
import { TokenNotAllowedError, AmountExceededError, SlippageExceededError } from '../src/errors'

describe('MevSwap.swap', () => {
  it('returns a swap result with txHash and amountOut', async () => {
    const swap = new MevSwap()
    const result = await swap.swap({ from: 'SOL', to: 'USDC', amount: 1 })
    expect(result.txHash).toMatch(/^[0-9a-f]{64}$/)
    expect(result.from).toBe('SOL')
    expect(result.to).toBe('USDC')
    expect(result.amountOut).toBeCloseTo(0.998, 3)
    expect(result.privacy).toBe('zk')
  })

  it('rejects token not in allowedTokens', async () => {
    const swap = new MevSwap()
    await expect(
      swap.swap({
        from: 'SOL',
        to: 'BONK',
        amount: 1,
        rules: { allowedTokens: ['USDC', 'JUP'] },
      })
    ).rejects.toThrow(/not in allowed list/)
  })

  it('rejects amount over maxAmountUsd', async () => {
    const swap = new MevSwap()
    await expect(
      swap.swap({
        from: 'SOL',
        to: 'USDC',
        amount: 5000,
        rules: { maxAmountUsd: 1000 },
      })
    ).rejects.toThrow(/exceeds maxAmountUsd/)
  })

  it('rejects slippage over maxSlippage', async () => {
    const swap = new MevSwap()
    await expect(
      swap.swap({
        from: 'SOL',
        to: 'USDC',
        amount: 1,
        slippage: 5,
        rules: { maxSlippage: 1 },
      })
    ).rejects.toThrow(/exceeds max/)
  })

  it('calls onApprovalRequired when requireApproval is set', async () => {
    let called = false
    const swap = new MevSwap({
      onApprovalRequired: async () => {
        called = true
        return true
      },
    })
    await swap.swap({
      from: 'SOL',
      to: 'USDC',
      amount: 1,
      rules: { requireApproval: true },
    })
    expect(called).toBe(true)
  })

  it('throws when approval is denied', async () => {
    const swap = new MevSwap({
      onApprovalRequired: async () => false,
    })
    await expect(
      swap.swap({
        from: 'SOL',
        to: 'USDC',
        amount: 1,
        rules: { requireApproval: true },
      })
    ).rejects.toThrow(/approval required/)
  })
})

describe('MevSwap.quote', () => {
  it('returns estimated output without executing', async () => {
    const swap = new MevSwap()
    const q = await swap.quote('SOL', 'USDC', 10)
    expect(q.estimatedOutput).toBeCloseTo(9.98, 2)
    expect(q.route).toEqual(['SOL', 'USDC', 'USDC'])
  })
})
