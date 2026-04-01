import { TOKEN_DECIMALS } from './constants'

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function randomHex(bytes: number): string {
  const chars = '0123456789abcdef'
  let out = ''
  for (let i = 0; i < bytes * 2; i++) {
    out += chars[Math.floor(Math.random() * 16)]
  }
  return out
}

export function toLamports(amount: number, symbol: string): bigint {
  const decimals = TOKEN_DECIMALS[symbol] ?? 6
  return BigInt(Math.round(amount * 10 ** decimals))
}

export function fromLamports(amount: bigint, symbol: string): number {
  const decimals = TOKEN_DECIMALS[symbol] ?? 6
  return Number(amount) / 10 ** decimals
}

export function bpsToPercent(bps: number): number {
  return bps / 100
}

export function percentToBps(pct: number): number {
  return Math.round(pct * 100)
}

export function clampSlippage(pct: number): number {
  if (pct < 0) return 0
  if (pct > 50) return 50
  return pct
}

export function isValidPubkey(s: string): boolean {
  return typeof s === 'string' && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(s)
}

export function shortAddr(addr: string, head = 4, tail = 4): string {
  if (addr.length <= head + tail + 3) return addr
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`
}

export function nowIso(): string {
  return new Date().toISOString()
}
