import { MevSwap } from '../src/client'

async function bench(label: string, n: number, fn: () => Promise<unknown>) {
  const t0 = Date.now()
  for (let i = 0; i < n; i++) await fn()
  const dt = Date.now() - t0
  console.log(`${label.padEnd(28)} ${(dt / n).toFixed(1).padStart(6)} ms / op  (${n}x)`)
}

async function main() {
  const swap = new MevSwap()

  await bench('quote', 50, () => swap.quote('SOL', 'USDC', 1))
  await bench('swap zk', 30, () => swap.swap({ from: 'SOL', to: 'USDC', amount: 1, privacy: 'zk' }))
  await bench('swap standard', 30, () =>
    swap.swap({ from: 'SOL', to: 'USDC', amount: 1, privacy: 'standard' })
  )
}

main().catch(console.error)
