import { describe, it, expect } from 'vitest'
import {
  toLamports,
  fromLamports,
  bpsToPercent,
  percentToBps,
  clampSlippage,
  isValidPubkey,
  shortAddr,
} from '../src/utils'

describe('lamport conversion', () => {
  it('converts SOL to lamports', () => {
    expect(toLamports(1, 'SOL')).toBe(1_000_000_000n)
  })
  it('converts USDC to lamports (6 decimals)', () => {
    expect(toLamports(2, 'USDC')).toBe(2_000_000n)
  })
  it('round-trips through fromLamports', () => {
    expect(fromLamports(toLamports(1.5, 'SOL'), 'SOL')).toBeCloseTo(1.5, 9)
  })
})

describe('bps <-> percent', () => {
  it('converts bps to percent', () => {
    expect(bpsToPercent(50)).toBe(0.5)
    expect(bpsToPercent(100)).toBe(1)
  })
  it('converts percent to bps', () => {
    expect(percentToBps(0.5)).toBe(50)
    expect(percentToBps(1)).toBe(100)
  })
})

describe('clampSlippage', () => {
  it('clamps negatives to zero', () => {
    expect(clampSlippage(-1)).toBe(0)
  })
  it('clamps >50 to 50', () => {
    expect(clampSlippage(99)).toBe(50)
  })
  it('passes through valid values', () => {
    expect(clampSlippage(2.5)).toBe(2.5)
  })
})

describe('isValidPubkey', () => {
  it('accepts a 44-char base58 string', () => {
    expect(isValidPubkey('So11111111111111111111111111111111111111112')).toBe(true)
  })
  it('rejects invalid characters', () => {
    expect(isValidPubkey('0OIl' + 'A'.repeat(40))).toBe(false)
  })
})

describe('shortAddr', () => {
  it('shortens long addresses', () => {
    const a = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    expect(shortAddr(a)).toBe('EPjF…Dt1v')
  })
})
