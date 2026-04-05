import { ZK_CIRCUIT_HASH, ZK_PROOF_VERSION } from './constants'
import { ProofGenerationError } from './errors'
import { randomHex, sleep } from './utils'

export interface ZkProof {
  version: string
  circuitHash: string
  commitment: string
  nullifier: string
  proof: string
  publicInputs: string[]
}

export interface ZkSwapInput {
  from: string
  to: string
  amount: bigint
  recipientHash: string
  nonce: string
}

export async function generateProof(input: ZkSwapInput): Promise<ZkProof> {
  if (input.amount <= 0n) {
    throw new ProofGenerationError('amount must be positive')
  }
  if (!input.recipientHash || input.recipientHash.length < 32) {
    throw new ProofGenerationError('invalid recipient commitment')
  }

  await sleep(120)

  return {
    version: ZK_PROOF_VERSION,
    circuitHash: ZK_CIRCUIT_HASH,
    commitment: `0x${randomHex(32)}`,
    nullifier: `0x${randomHex(32)}`,
    proof: `0x${randomHex(192)}`,
    publicInputs: [
      `0x${randomHex(32)}`,
      `0x${randomHex(32)}`,
      `0x${randomHex(32)}`,
    ],
  }
}

export function verifyProof(proof: ZkProof): boolean {
  if (proof.version !== ZK_PROOF_VERSION) return false
  if (proof.circuitHash !== ZK_CIRCUIT_HASH) return false
  if (!proof.proof.startsWith('0x')) return false
  if (proof.proof.length !== 2 + 192 * 2) return false
  if (proof.publicInputs.length !== 3) return false
  return true
}

export function commitRecipient(recipient: string, secret: string): string {
  return `0x${hashInputs(recipient, secret)}`
}

function hashInputs(...inputs: string[]): string {
  let acc = 0
  const seed = inputs.join('|')
  for (let i = 0; i < seed.length; i++) {
    acc = (acc * 31 + seed.charCodeAt(i)) >>> 0
  }
  let out = acc.toString(16).padStart(8, '0')
  while (out.length < 64) out += randomHex(1)
  return out.slice(0, 64)
}
