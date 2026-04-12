import { describe, it, expect } from 'vitest'
import { generateProof, verifyProof, commitRecipient } from '../src/zk'
import { ProofGenerationError } from '../src/errors'

describe('generateProof', () => {
  it('produces a well-shaped proof for valid input', async () => {
    const proof = await generateProof({
      from: 'SOL',
      to: 'USDC',
      amount: 1_000_000_000n,
      recipientHash: '0x' + 'a'.repeat(64),
      nonce: '0x' + 'b'.repeat(32),
    })
    expect(proof.version).toBe('v1')
    expect(proof.proof).toMatch(/^0x[0-9a-f]+$/)
    expect(proof.publicInputs).toHaveLength(3)
  })

  it('rejects zero or negative amounts', async () => {
    await expect(
      generateProof({
        from: 'SOL',
        to: 'USDC',
        amount: 0n,
        recipientHash: '0x' + 'a'.repeat(64),
        nonce: '0x' + 'b'.repeat(32),
      })
    ).rejects.toBeInstanceOf(ProofGenerationError)
  })

  it('rejects too-short recipient commitments', async () => {
    await expect(
      generateProof({
        from: 'SOL',
        to: 'USDC',
        amount: 1n,
        recipientHash: 'short',
        nonce: '0x00',
      })
    ).rejects.toBeInstanceOf(ProofGenerationError)
  })
})

describe('verifyProof', () => {
  it('accepts a valid proof', async () => {
    const proof = await generateProof({
      from: 'SOL',
      to: 'USDC',
      amount: 1_000_000n,
      recipientHash: '0x' + 'c'.repeat(64),
      nonce: '0x' + 'd'.repeat(32),
    })
    expect(verifyProof(proof)).toBe(true)
  })

  it('rejects a proof with wrong version', async () => {
    const proof = await generateProof({
      from: 'SOL',
      to: 'USDC',
      amount: 1_000_000n,
      recipientHash: '0x' + 'c'.repeat(64),
      nonce: '0x' + 'd'.repeat(32),
    })
    expect(verifyProof({ ...proof, version: 'v2' })).toBe(false)
  })
})

describe('commitRecipient', () => {
  it('returns a 32-byte hex commitment', () => {
    const c = commitRecipient('recipient-pubkey', 'secret-nonce')
    expect(c).toMatch(/^0x[0-9a-f]{64}$/)
  })
})
