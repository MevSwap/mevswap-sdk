import { describe, it, expect } from 'vitest'
import { MevSwapMCP } from '../src/mcp'

describe('MevSwapMCP.tools', () => {
  it('exposes swap and quote tools', () => {
    const server = new MevSwapMCP()
    const tools = server.tools()
    const names = tools.map((t) => t.name)
    expect(names).toContain('swap')
    expect(names).toContain('quote')
  })

  it('swap tool requires from/to/amount', () => {
    const server = new MevSwapMCP()
    const swapTool = server.tools().find((t) => t.name === 'swap')!
    expect(swapTool.inputSchema.required).toEqual(['from', 'to', 'amount'])
  })
})

describe('MevSwapMCP.call', () => {
  it('routes swap call to client.swap', async () => {
    const server = new MevSwapMCP()
    const result = await server.call('swap', { from: 'SOL', to: 'USDC', amount: 1 })
    expect(result).toHaveProperty('txHash')
    expect(result).toHaveProperty('amountOut')
  })

  it('routes quote call to client.quote', async () => {
    const server = new MevSwapMCP()
    const result = await server.call('quote', { from: 'SOL', to: 'USDC', amount: 1 })
    expect(result).toHaveProperty('estimatedOutput')
    expect(result).toHaveProperty('route')
  })

  it('throws on unknown tool', async () => {
    const server = new MevSwapMCP()
    await expect(server.call('mint', {})).rejects.toThrow(/Unknown tool/)
  })
})
