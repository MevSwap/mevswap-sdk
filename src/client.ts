import type { MevSwapConfig, SwapOptions, SwapResult, ApprovalRequest } from './types'
import { adapterFor } from './adapters'
import type { ChainId } from './adapters/chain'

export class MevSwap {
  private config: MevSwapConfig

  constructor(config: MevSwapConfig = {}) {
    this.config = config
  }

  async swap(options: SwapOptions): Promise<SwapResult> {
    const { from, to, amount, slippage = 0.5, privacy = 'zk', rules = {} } = options
    const chain: ChainId = options.chain ?? this.config.chain ?? 'ethereum'

    if (rules.allowedTokens && !rules.allowedTokens.includes(to)) {
      throw new Error(`Token ${to} not in allowed list`)
    }

    if (rules.maxAmountUsd && amount > rules.maxAmountUsd) {
      throw new Error(`Amount $${amount} exceeds maxAmountUsd $${rules.maxAmountUsd}`)
    }

    const effectiveSlippage = slippage
    if (rules.maxSlippage && effectiveSlippage > rules.maxSlippage) {
      throw new Error(`Slippage ${effectiveSlippage}% exceeds max ${rules.maxSlippage}%`)
    }

    if (rules.requireApproval) {
      const req: ApprovalRequest = {
        from, to, amount,
        estimatedOutput: amount * 0.998,
        agentId: this.config.agentId,
        timestamp: new Date(),
      }
      const approved = this.config.onApprovalRequired
        ? await this.config.onApprovalRequired(req)
        : false

      if (!approved) throw new Error('Swap denied — approval required')
    }

    const adapter = adapterFor(chain)
    const slippageBps = Math.round(effectiveSlippage * 100)
    const amountIn = toBaseUnits(amount, chain, from)

    const quote = await adapter.quote({ from, to, amount: amountIn, slippageBps })
    const swap = await adapter.buildAndSubmit(quote, this.config.agentId ?? 'self')

    return {
      txHash: swap.txHash,
      from,
      to,
      amountIn: amount,
      amountOut: parseFloat(fromBaseUnits(swap.amountOut, chain, to).toFixed(6)),
      priceImpact: quote.priceImpactPct,
      privacy,
      executedAt: new Date(),
    }
  }

  async quote(from: string, to: string, amount: number, chain?: ChainId) {
    const c: ChainId = chain ?? this.config.chain ?? 'ethereum'
    const adapter = adapterFor(c)
    const q = await adapter.quote({ from, to, amount: toBaseUnits(amount, c, from) })

    return {
      from, to, amount,
      estimatedOutput: parseFloat(fromBaseUnits(q.amountOut, c, to).toFixed(6)),
      priceImpact: q.priceImpactPct,
      route: [from, q.routeLabel, to],
      slippage: 0.5,
    }
  }
}

function toBaseUnits(amount: number, chain: ChainId, _symbol: string): bigint {
  const decimals = chain === 'solana' ? 9 : 18
  return BigInt(Math.round(amount * 10 ** Math.min(decimals, 9))) * BigInt(10 ** Math.max(0, decimals - 9))
}

function fromBaseUnits(raw: string, _chain: ChainId, _symbol: string): number {
  const big = BigInt(raw)
  return Number(big) / 1e18
}
