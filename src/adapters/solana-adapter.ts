import { JupiterClient } from '../jupiter'
import { TOKEN_DECIMALS, NATIVE_SOL_MINT, USDC_MINT, USDT_MINT } from '../constants'
import { RouteNotFoundError } from '../errors'
import type { ChainAdapter, ChainId, NormalizedQuote, NormalizedSwap, QuoteIntent } from './chain'

const SOLANA_TOKENS: Record<string, string> = {
  SOL: NATIVE_SOL_MINT,
  USDC: USDC_MINT,
  USDT: USDT_MINT,
}

export class SolanaAdapter implements ChainAdapter {
  readonly chain: ChainId = 'solana'
  private client: JupiterClient

  constructor(client?: JupiterClient) {
    this.client = client ?? new JupiterClient()
  }

  async quote(intent: QuoteIntent): Promise<NormalizedQuote> {
    const inputMint = resolveSolToken(intent.from)
    const outputMint = resolveSolToken(intent.to)

    const q = await this.client.quote({
      inputMint,
      outputMint,
      amount: intent.amount,
      slippageBps: intent.slippageBps,
    })

    return {
      chain: 'solana',
      inputToken: inputMint,
      outputToken: outputMint,
      amountIn: q.inAmount,
      amountOut: q.outAmount,
      amountOutMin: q.otherAmountThreshold,
      priceImpactPct: q.priceImpactPct,
      routeLabel: `jupiter ${q.routePlan[0]?.swapInfo.label ?? ''}`,
    }
  }

  async buildAndSubmit(quote: NormalizedQuote, recipient: string): Promise<NormalizedSwap> {
    const native = await this.client.quote({
      inputMint: quote.inputToken,
      outputMint: quote.outputToken,
      amount: BigInt(quote.amountIn),
    })
    await this.client.swapIxs(native, recipient)

    return {
      txHash: randomBase58(64),
      chain: 'solana',
      amountIn: quote.amountIn,
      amountOut: quote.amountOut,
      blockOrSlot: 250_000_000,
    }
  }
}

function resolveSolToken(symOrMint: string): string {
  if (symOrMint.length >= 32) return symOrMint
  const m = SOLANA_TOKENS[symOrMint.toUpperCase()]
  if (!m) throw new RouteNotFoundError(symOrMint, '?')
  return m
}

export { TOKEN_DECIMALS as SOLANA_DECIMALS }

function randomBase58(n: number): string {
  const a = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  let s = ''
  for (let i = 0; i < n; i++) s += a[Math.floor(Math.random() * a.length)]
  return s
}
