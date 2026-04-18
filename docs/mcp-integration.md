# mcp integration

mevswap ships an mcp (model context protocol) server out of the box. an llm-driven agent — claude, gpt, cursor, anything that speaks mcp — can swap and quote through it the same way it calls any other tool.

## setup

```ts
import { MevSwapMCP } from 'mevswap'

const server = new MevSwapMCP({
  agentId: process.env.AGENT_ID,
  onApprovalRequired: async (req) => {
    // gate to slack / your own ui / etc.
    return true
  },
})
```

## exposed tools

### `swap`

execute an mev-protected zk swap.

| input | type | description |
|---|---|---|
| `from` | string | input token symbol |
| `to` | string | output token symbol |
| `amount` | number | input amount |
| `slippage` | number? | max slippage % (default 0.5) |
| `privacy` | `'zk' \| 'standard'`? | privacy mode (default `zk`) |

required: `from`, `to`, `amount`.

### `quote`

quote a swap without executing.

| input | type |
|---|---|
| `from` | string |
| `to` | string |
| `amount` | number |

returns `{ estimatedOutput, route, priceImpact, slippage }`.

## connecting to claude desktop

add an entry to your `~/.config/claude/mcp.json`:

```json
{
  "mcpServers": {
    "mevswap": {
      "command": "node",
      "args": ["./node_modules/mevswap/dist/mcp-server.mjs"],
      "env": {
        "AGENT_ID": "claude-desktop"
      }
    }
  }
}
```

## a note on rules

every tool call still passes through the spending rules engine. an llm can ask for a `1000 SOL -> WORTHLESS_MEME` swap; if your `maxAmountUsd` says no, the call throws and the model receives the error in its tool result. the model cannot bypass the rules — only the human configuring the server can.
