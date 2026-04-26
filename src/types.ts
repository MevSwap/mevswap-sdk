import type { ChainId } from './adapters/chain'

export interface MevSwapConfig {
  agentId?: string
  chain?: ChainId
  network?: 'mainnet' | 'devnet'
  rpcUrl?: string
  apiKey?: string
  onApprovalRequired?: (req: ApprovalRequest) => Promise<boolean>
}

export interface SwapOptions {
  from: string
  to: string
  amount: number
  chain?: ChainId
  slippage?: number
  privacy?: 'zk' | 'standard'
  rules?: SwapRules
}

export interface SwapRules {
  maxSlippage?: number
  requireApproval?: boolean
  allowedTokens?: string[]
  maxAmountUsd?: number
}

export interface ApprovalRequest {
  from: string
  to: string
  amount: number
  estimatedOutput: number
  agentId?: string
  timestamp: Date
}

export interface SwapResult {
  txHash: string
  from: string
  to: string
  amountIn: number
  amountOut: number
  priceImpact: number
  privacy: 'zk' | 'standard'
  executedAt: Date
}
