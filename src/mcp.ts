import { MevSwap } from './client'
import type { MevSwapConfig } from './types'

export class MevSwapMCP {
  private client: MevSwap

  constructor(config: MevSwapConfig = {}) {
    this.client = new MevSwap(config)
  }

  tools() {
    return [
      {
        name: 'swap',
        description: 'Execute an MEV-protected ZK token swap on Solana',
        inputSchema: {
          type: 'object',
          properties: {
            from: { type: 'string', description: 'Input token symbol (e.g. SOL)' },
            to: { type: 'string', description: 'Output token symbol (e.g. USDC)' },
            amount: { type: 'number', description: 'Amount to swap' },
            slippage: { type: 'number', description: 'Max slippage % (default 0.5)' },
            privacy: { type: 'string', enum: ['zk', 'standard'], description: 'Privacy mode' },
          },
          required: ['from', 'to', 'amount'],
        },
      },
      {
        name: 'quote',
        description: 'Get a swap quote without executing',
        inputSchema: {
          type: 'object',
          properties: {
            from: { type: 'string' },
            to: { type: 'string' },
            amount: { type: 'number' },
          },
          required: ['from', 'to', 'amount'],
        },
      },
    ]
  }

  async call(toolName: string, args: Record<string, unknown>) {
    switch (toolName) {
      case 'swap':
        return this.client.swap({
          from: args.from as string,
          to: args.to as string,
          amount: args.amount as number,
          slippage: args.slippage as number | undefined,
          privacy: (args.privacy as 'zk' | 'standard') ?? 'zk',
        })
      case 'quote':
        return this.client.quote(args.from as string, args.to as string, args.amount as number)
      default:
        throw new Error(`Unknown tool: ${toolName}`)
    }
  }
}
