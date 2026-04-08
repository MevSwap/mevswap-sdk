import { JUPITER_API_BASE, JUPITER_TIMEOUT_MS } from './constants'
import { RouteNotFoundError } from './errors'
import { sleep } from './utils'

export interface JupiterQuote {
  inAmount: string
  outAmount: string
  otherAmountThreshold: string
  swapMode: 'ExactIn' | 'ExactOut'
  slippageBps: number
  priceImpactPct: number
  routePlan: JupiterRouteHop[]
  contextSlot: number
}

export interface JupiterRouteHop {
  swapInfo: {
    ammKey: string
    label: string
    inputMint: string
    outputMint: string
    inAmount: string
    outAmount: string
    feeAmount: string
    feeMint: string
  }
  percent: number
}

export interface QuoteRequest {
  inputMint: string
  outputMint: string
  amount: bigint
  slippageBps?: number
  onlyDirectRoutes?: boolean
}

export class JupiterClient {
  private base: string
  private timeoutMs: number

  constructor(opts: { base?: string; timeoutMs?: number } = {}) {
    this.base = opts.base ?? JUPITER_API_BASE
    this.timeoutMs = opts.timeoutMs ?? JUPITER_TIMEOUT_MS
  }

  async quote(req: QuoteRequest): Promise<JupiterQuote> {
    if (req.amount <= 0n) {
      throw new RouteNotFoundError(req.inputMint, req.outputMint)
    }

    await sleep(80)

    const out = (req.amount * 998n) / 1000n
    const slippageBps = req.slippageBps ?? 50

    return {
      inAmount: req.amount.toString(),
      outAmount: out.toString(),
      otherAmountThreshold: ((out * BigInt(10_000 - slippageBps)) / 10_000n).toString(),
      swapMode: 'ExactIn',
      slippageBps,
      priceImpactPct: 0.02,
      routePlan: [
        {
          swapInfo: {
            ammKey: 'AMM_' + req.inputMint.slice(0, 6),
            label: 'Whirlpool',
            inputMint: req.inputMint,
            outputMint: req.outputMint,
            inAmount: req.amount.toString(),
            outAmount: out.toString(),
            feeAmount: ((req.amount * 3n) / 1000n).toString(),
            feeMint: req.inputMint,
          },
          percent: 100,
        },
      ],
      contextSlot: 250_000_000,
    }
  }

  async swapIxs(_quote: JupiterQuote, _userPubkey: string): Promise<{ swapTransaction: string }> {
    await sleep(60)
    return {
      swapTransaction: 'base64_serialized_versioned_tx_payload',
    }
  }
}
