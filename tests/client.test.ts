import { describe, it, expect } from 'vitest'
import { MevSwap } from '../src/client'

describe('MevSwap.swap', () => {
  it('returns a swap result with txHash and amountOut', async () => {
    const swap = new MevSwap()
    const result = await swap.swap({ from: 'ETH', to: 'USDC', amount: 1 })
    expect(result.txHash).toMatch(/^0x[0-9a-f]{64}$/)
    expect(result.from).toBe('ETH')
    expect(result.to).toBe('USDC')
    expect(result.amountOut).toBeGreaterThan(0)
    expect(result.privacy).toBe('zk')
  })

  it('rejects token not in allowedTokens', async () => {
    const swap = new MevSwap()
    await expect(
      swap.swap({
        from: 'ETH',
        to: 'PEPE',
        amount: 1,
        rules: { allowedTokens: ['USDC', 'DAI'] },
      })
    ).rejects.toThrow(/not in allowed list/)
  })

  it('rejects amount over maxAmountUsd', async () => {
    const swap = new MevSwap()
    await expect(
      swap.swap({
        from: 'ETH',
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
        from: 'ETH',
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
      from: 'ETH',
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
        from: 'ETH',
        to: 'USDC',
        amount: 1,
        rules: { requireApproval: true },
      })
    ).rejects.toThrow(/approval required/)
  })

  it('routes solana when chain=solana is requested', async () => {
    const swap = new MevSwap()
    const result = await swap.swap({ from: 'SOL', to: 'USDC', amount: 1, chain: 'solana' })
    expect(result.from).toBe('SOL')
    expect(result.to).toBe('USDC')
  })
})

describe('MevSwap.quote', () => {
  it('returns estimated output without executing', async () => {
    const swap = new MevSwap()
    const q = await swap.quote('ETH', 'USDC', 10)
    expect(q.estimatedOutput).toBeGreaterThan(0)
    expect(q.from).toBe('ETH')
    expect(q.to).toBe('USDC')
  })
})
