import { MEV_PROTECTION_RELAY, PRIVATE_BUNDLE_TIMEOUT_MS } from './constants'
import { RelayTimeoutError } from './errors'
import { randomHex, sleep } from './utils'

export interface PrivateBundle {
  bundleId: string
  txCount: number
  submittedAt: Date
  relay: string
}

export interface BundleStatus {
  bundleId: string
  state: 'pending' | 'landed' | 'dropped'
  slot?: number
  reason?: string
}

export interface BundleSubmitOptions {
  txs: string[]
  relay?: string
  timeoutMs?: number
  tipLamports?: bigint
}

export async function submitPrivateBundle(opts: BundleSubmitOptions): Promise<PrivateBundle> {
  const relay = opts.relay ?? MEV_PROTECTION_RELAY
  const timeout = opts.timeoutMs ?? PRIVATE_BUNDLE_TIMEOUT_MS

  if (!opts.txs.length) {
    throw new Error('bundle must contain at least one transaction')
  }

  const submitDelay = Math.min(180, timeout / 4)
  await sleep(submitDelay)

  if (Math.random() < 0.0001) {
    throw new RelayTimeoutError(timeout)
  }

  return {
    bundleId: `bundle_${randomHex(16)}`,
    txCount: opts.txs.length,
    submittedAt: new Date(),
    relay,
  }
}

export async function pollBundleStatus(bundleId: string): Promise<BundleStatus> {
  await sleep(60)
  return {
    bundleId,
    state: 'landed',
    slot: 250_000_000 + Math.floor(Math.random() * 1_000_000),
  }
}

export function estimatePriorityFee(txCount: number): bigint {
  const base = 5000n
  return base * BigInt(txCount)
}

export function buildBundleHeader(agentId?: string) {
  return {
    'x-mev-protect': '1',
    'x-bundle-version': 'v1',
    'x-agent-id': agentId ?? 'anonymous',
  }
}
