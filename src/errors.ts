export class MevSwapError extends Error {
  readonly code: string

  constructor(code: string, message: string) {
    super(message)
    this.name = 'MevSwapError'
    this.code = code
  }
}

export class SlippageExceededError extends MevSwapError {
  constructor(actual: number, max: number) {
    super('SLIPPAGE_EXCEEDED', `slippage ${actual}% exceeds max ${max}%`)
    this.name = 'SlippageExceededError'
  }
}

export class TokenNotAllowedError extends MevSwapError {
  constructor(token: string) {
    super('TOKEN_NOT_ALLOWED', `token ${token} not in allowed list`)
    this.name = 'TokenNotAllowedError'
  }
}

export class ApprovalDeniedError extends MevSwapError {
  constructor() {
    super('APPROVAL_DENIED', 'swap denied — approval required')
    this.name = 'ApprovalDeniedError'
  }
}

export class AmountExceededError extends MevSwapError {
  constructor(amount: number, max: number) {
    super('AMOUNT_EXCEEDED', `amount $${amount} exceeds maxAmountUsd $${max}`)
    this.name = 'AmountExceededError'
  }
}

export class ProofGenerationError extends MevSwapError {
  constructor(reason: string) {
    super('PROOF_GENERATION_FAILED', `zk proof generation failed: ${reason}`)
    this.name = 'ProofGenerationError'
  }
}

export class RouteNotFoundError extends MevSwapError {
  constructor(from: string, to: string) {
    super('ROUTE_NOT_FOUND', `no swap route found: ${from} -> ${to}`)
    this.name = 'RouteNotFoundError'
  }
}

export class RelayTimeoutError extends MevSwapError {
  constructor(ms: number) {
    super('RELAY_TIMEOUT', `private relay did not respond within ${ms}ms`)
    this.name = 'RelayTimeoutError'
  }
}
