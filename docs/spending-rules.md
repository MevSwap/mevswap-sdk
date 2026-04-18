# spending rules

agents are not free to do whatever. you set the rails. they swap inside them.

## why rules exist

an autonomous agent that can sign swaps without bounds is a liability. mevswap's rules engine is the layer between an agent's intent and the wallet — every swap is checked against the rules *before* a proof is generated and *before* funds move.

## available rules

```ts
interface SwapRules {
  maxSlippage?: number      // percent, e.g. 1 = 1%
  requireApproval?: boolean // call onApprovalRequired before swapping
  allowedTokens?: string[]  // whitelist of output tokens
  maxAmountUsd?: number     // hard cap on swap size
}
```

### `maxSlippage`

if the requested slippage exceeds this, the swap throws `SlippageExceededError`. defaults to no limit. a typical agent should pin this at 1-2%.

### `requireApproval`

if true, the sdk calls `config.onApprovalRequired(req)` and only proceeds if the callback returns true. use this to route the request through a human-in-the-loop tool, slack, or a separate approval service.

### `allowedTokens`

a whitelist of output token symbols. swaps to anything not in the list throw `TokenNotAllowedError`. use this to keep an agent on a known token universe.

### `maxAmountUsd`

a hard cap on swap size. swaps above the cap throw `AmountExceededError`. the cap is in usd at swap time — the sdk converts via the input quote.

## composing rules

rules are checked top-to-bottom: token whitelist, then amount, then slippage, then approval. the first failure stops the swap. this means a denied approval will not run the slippage check — useful when approval involves a slow callback (slack, etc.).

## errors

each rule violation is its own typed error so an agent can branch on it:

```ts
import {
  TokenNotAllowedError,
  AmountExceededError,
  SlippageExceededError,
  ApprovalDeniedError,
} from 'mevswap'

try {
  await swap.swap({ ... })
} catch (e) {
  if (e instanceof TokenNotAllowedError) { /* try a different mint */ }
  if (e instanceof AmountExceededError)  { /* split into chunks */ }
  if (e instanceof SlippageExceededError){ /* widen tolerance + retry */ }
  if (e instanceof ApprovalDeniedError)  { /* park the trade */ }
}
```
