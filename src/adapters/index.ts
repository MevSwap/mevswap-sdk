export type { ChainAdapter, ChainId, QuoteIntent, NormalizedQuote, NormalizedSwap } from './chain'
export { isEvm, EVM_CHAINS } from './chain'
export { EvmAdapter } from './evm-adapter'
export { SolanaAdapter } from './solana-adapter'

import type { ChainAdapter, ChainId } from './chain'
import { EvmAdapter } from './evm-adapter'
import { SolanaAdapter } from './solana-adapter'
import { isEvm } from './chain'

export function adapterFor(chain: ChainId): ChainAdapter {
  if (isEvm(chain)) return new EvmAdapter(chain)
  return new SolanaAdapter()
}
