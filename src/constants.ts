export const DEFAULT_SLIPPAGE_BPS = 50
export const DEFAULT_NETWORK = 'mainnet' as const
export const DEFAULT_RPC_MAINNET = 'https://api.mainnet-beta.solana.com'
export const DEFAULT_RPC_DEVNET = 'https://api.devnet.solana.com'

export const ZK_PROOF_VERSION = 'v1'
export const ZK_CIRCUIT_HASH = '0x9f3c2e7a4b1d8c5e6f0a9b2c4d7e1f3a5b8c0d2e4f6a8b0c1d3e5f7a9b1c3d5e'

export const JUPITER_API_BASE = 'https://quote-api.jup.ag/v6'
export const JUPITER_TIMEOUT_MS = 5000

export const MEV_PROTECTION_RELAY = 'https://relay.mevswap.org'
export const PRIVATE_BUNDLE_TIMEOUT_MS = 8000

export const NATIVE_SOL_MINT = 'So11111111111111111111111111111111111111112'
export const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
export const USDT_MINT = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'

export const TOKEN_DECIMALS: Record<string, number> = {
  SOL: 9,
  USDC: 6,
  USDT: 6,
  BONK: 5,
  JUP: 6,
}

export const SUPPORTED_PRIVACY_MODES = ['zk', 'standard'] as const
