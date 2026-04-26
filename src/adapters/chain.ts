export type ChainId = 'ethereum' | 'base' | 'arbitrum' | 'optimism' | 'solana'

export interface NormalizedQuote {
  chain: ChainId
  inputToken: string
  outputToken: string
  amountIn: string
  amountOut: string
  amountOutMin: string
  priceImpactPct: number
  routeLabel: string
}

export interface NormalizedSwap {
  txHash: string
  chain: ChainId
  amountIn: string
  amountOut: string
  blockOrSlot: number
}

export interface QuoteIntent {
  from: string
  to: string
  amount: bigint
  slippageBps?: number
  recipient?: string
}

export interface ChainAdapter {
  readonly chain: ChainId
  quote(intent: QuoteIntent): Promise<NormalizedQuote>
  buildAndSubmit(quote: NormalizedQuote, recipient: string): Promise<NormalizedSwap>
}

export const EVM_CHAINS: ChainId[] = ['ethereum', 'base', 'arbitrum', 'optimism']

export function isEvm(chain: ChainId): boolean {
  return EVM_CHAINS.includes(chain)
}
