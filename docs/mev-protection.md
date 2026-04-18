# mev protection

what we hide, from whom, and how.

## the threats

| threat | who does it | what they need | how mevswap blocks it |
|---|---|---|---|
| sandwich | searcher bots | see your tx in the public mempool, simulate impact | private bundle skips the mempool |
| frontrun | searcher bots | observe pending tx, race to place trade ahead | bundle is atomic — searcher cannot insert ahead |
| backrun | searcher bots | observe a state change, place a trade after it | proof + private settlement hide the state change |
| route inference | passive observers | watch tx graph + dex calls to infer routing | zk proof commits to inputs without revealing the path |
| address linking | chain analysts | link sender wallet → recipient → other activity | recipient commitment instead of plain pubkey |

## relay topology

every swap that opts into `privacy: 'zk'` is wrapped in a bundle and forwarded to one of the configured private relays. the relay does not see the contents of the bundle beyond what the leader needs to include it. the public mempool is bypassed entirely.

current relay: `https://relay.mevswap.org`. additional relays may be added by passing `relay` to `submitPrivateBundle`.

## what is still visible

we do not lie about what privacy buys you. on-chain, after the bundle lands, the following are still visible to anyone:

- that *some* swap happened in the AMM pool
- the aggregate change in pool reserves
- the slot the swap landed in

what is **not** visible:

- which wallet initiated the trade
- the exact input amount
- the recipient
- the intermediate hops in the route

if the threat model includes correlating pool reserve deltas to a specific wallet over time, additional mixing on top of mevswap is required.

## status polling

bundles return a `bundleId` immediately. use `pollBundleStatus(bundleId)` to check whether it landed, was dropped, or is still pending. dropped bundles are safe — no tx hit the wire, no funds moved.
