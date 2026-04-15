import { submitPrivateBundle, pollBundleStatus } from 'mevswap'

async function main() {
  const bundle = await submitPrivateBundle({
    txs: ['base64_serialized_tx_1', 'base64_serialized_tx_2'],
  })
  console.log('submitted:', bundle.bundleId)

  const status = await pollBundleStatus(bundle.bundleId)
  console.log('status:', status.state, 'slot:', status.slot)
}

main().catch(console.error)
