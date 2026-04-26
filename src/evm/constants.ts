export const DEFAULT_RPC_ETHEREUM = 'https://eth.llamarpc.com'
export const DEFAULT_RPC_BASE = 'https://mainnet.base.org'
export const DEFAULT_RPC_ARBITRUM = 'https://arb1.arbitrum.io/rpc'
export const DEFAULT_RPC_OPTIMISM = 'https://mainnet.optimism.io'

export const UNISWAP_V3_QUOTER = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'
export const UNISWAP_V3_ROUTER = '0xE592427A0AEce92De3Edee1F18E0157C05861564'
export const UNISWAP_UNIVERSAL_ROUTER = '0x66a9893cC07D91D95644AEDD05D03f95e1dBA8Af'
export const UNISWAP_API_BASE = 'https://api.uniswap.org/v2'

export const FLASHBOTS_RELAY = 'https://relay.flashbots.net'
export const MEV_BLOCKER_RPC = 'https://rpc.mevblocker.io'

export const NATIVE_ETH_ADDR = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
export const WETH_ADDR = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
export const USDC_ADDR = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
export const USDT_ADDR = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
export const DAI_ADDR = '0x6B175474E89094C44Da98b954EedeAC495271d0F'

export const FEE_TIERS = [100, 500, 3000, 10000] as const

export const ERC20_DECIMALS: Record<string, number> = {
  ETH: 18,
  WETH: 18,
  USDC: 6,
  USDT: 6,
  DAI: 18,
  WBTC: 8,
  PEPE: 18,
  LINK: 18,
}

export const TOKEN_ADDRESS: Record<string, string> = {
  ETH: NATIVE_ETH_ADDR,
  WETH: WETH_ADDR,
  USDC: USDC_ADDR,
  USDT: USDT_ADDR,
  DAI: DAI_ADDR,
}
