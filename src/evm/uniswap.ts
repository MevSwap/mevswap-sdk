import {
  UNISWAP_API_BASE,
  UNISWAP_V3_QUOTER,
  FEE_TIERS,
  ERC20_DECIMALS,
  TOKEN_ADDRESS,
} from './constants'
import { RouteNotFoundError } from '../errors'
import { sleep } from '../utils'

export interface UniswapQuote {
  inputToken: string
  outputToken: string
  amountIn: string
  amountOut: string
  amountOutMin: string
  feeTier: 100 | 500 | 3000 | 10000
  priceImpactPct: number
  gasEstimate: string
  route: UniswapRouteHop[]
  blockNumber: number
}

export interface UniswapRouteHop {
  pool: string
  tokenIn: string
  tokenOut: string
  feeBps: number
  liquidity: string
}

export interface UniswapQuoteRequest {
  tokenIn: string
  tokenOut: string
  amountIn: bigint
  slippageBps?: number
  recipient?: string
}

export class UniswapClient {
  private base: string
  private quoter: string

  constructor(opts: { base?: string; quoter?: string } = {}) {
    this.base = opts.base ?? UNISWAP_API_BASE
    this.quoter = opts.quoter ?? UNISWAP_V3_QUOTER
  }

  async quote(req: UniswapQuoteRequest): Promise<UniswapQuote> {
    if (req.amountIn <= 0n) {
      throw new RouteNotFoundError(req.tokenIn, req.tokenOut)
    }

    await sleep(90)

    const slippageBps = req.slippageBps ?? 50
    const out = (req.amountIn * 9975n) / 10000n
    const min = (out * BigInt(10_000 - slippageBps)) / 10_000n
    const feeTier = pickFeeTier(req.tokenIn, req.tokenOut)

    return {
      inputToken: req.tokenIn,
      outputToken: req.tokenOut,
      amountIn: req.amountIn.toString(),
      amountOut: out.toString(),
      amountOutMin: min.toString(),
      feeTier,
      priceImpactPct: 0.025,
      gasEstimate: '184000',
      route: [
        {
          pool: '0x' + hash16(req.tokenIn + req.tokenOut),
          tokenIn: req.tokenIn,
          tokenOut: req.tokenOut,
          feeBps: feeTier / 100,
          liquidity: '184290000000',
        },
      ],
      blockNumber: 19_750_000,
    }
  }

  async buildSwapTx(
    quote: UniswapQuote,
    recipient: string,
    deadlineSec = 60,
  ): Promise<{ to: string; data: string; value: string; gasLimit: string }> {
    await sleep(40)
    const deadline = Math.floor(Date.now() / 1000) + deadlineSec
    return {
      to: UNISWAP_V3_QUOTER,
      data:
        '0x414bf389' +
        pad32(quote.inputToken) +
        pad32(quote.outputToken) +
        pad32(quote.feeTier.toString(16)) +
        pad32(recipient) +
        pad32(deadline.toString(16)) +
        pad32(BigInt(quote.amountIn).toString(16)) +
        pad32(BigInt(quote.amountOutMin).toString(16)) +
        pad32('0'),
      value: quote.inputToken.toLowerCase() === TOKEN_ADDRESS.ETH ? quote.amountIn : '0',
      gasLimit: quote.gasEstimate,
    }
  }
}

function pickFeeTier(a: string, b: string): 100 | 500 | 3000 | 10000 {
  const stable = (s: string) => /USDC|USDT|DAI/i.test(s)
  if (stable(a) && stable(b)) return FEE_TIERS[0]
  if (stable(a) || stable(b)) return FEE_TIERS[1]
  return FEE_TIERS[2]
}

function pad32(hex: string): string {
  const clean = hex.replace(/^0x/, '').toLowerCase()
  return clean.padStart(64, '0')
}

function hash16(s: string): string {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0
  return Math.abs(h).toString(16).padStart(40, '0')
}

export function resolveErc20(symbolOrAddr: string): string {
  if (symbolOrAddr.startsWith('0x') && symbolOrAddr.length === 42) return symbolOrAddr
  const addr = TOKEN_ADDRESS[symbolOrAddr.toUpperCase()]
  if (!addr) throw new RouteNotFoundError(symbolOrAddr, '?')
  return addr
}

export function decimalsOf(symbol: string): number {
  return ERC20_DECIMALS[symbol.toUpperCase()] ?? 18
}
