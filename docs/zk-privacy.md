# zk privacy

how the zero-knowledge layer works, without the math.

## what is being proven

each swap is wrapped in a proof that commits to the following without revealing them:

- **sender commitment** — a hash of the sender pubkey + a one-time secret
- **amount** — the input amount, range-bounded so it cannot be negative or overflow
- **recipient commitment** — a hash of the recipient pubkey + a one-time nonce
- **nullifier** — a deterministic value that prevents the same proof from being replayed

the chain verifies the proof and confirms the swap is well-formed. it does not learn who, how much, or who got it.

## proof shape

```ts
interface ZkProof {
  version: 'v1'
  circuitHash: '0x9f3c2e7a...'
  commitment: '0x...'    // sender commitment
  nullifier: '0x...'     // prevents replay
  proof: '0x...'         // the proof itself, ~192 bytes
  publicInputs: string[] // 3 field elements
}
```

## flow

1. user calls `swap()` with `privacy: 'zk'`
2. sdk derives a one-time secret + nonce, commits to recipient
3. `generateProof()` constructs the witness and produces the proof
4. proof is submitted alongside the swap tx
5. on-chain verifier checks the proof; if valid, the swap settles
6. nullifier is recorded so the proof cannot be replayed

## verification

`verifyProof()` runs the same shape checks the on-chain verifier runs. you can use it client-side to sanity-check a proof before submission. it does not replace on-chain verification — it just catches malformed proofs early.

## what the circuit does NOT prove

- that the input mint matches the user's intent (that is enforced by the wallet signer)
- that the route is optimal (that is enforced by jupiter)
- that the slippage is acceptable (that is enforced by the rules gate before proof generation)

the circuit's job is narrow: prove the swap is well-formed and tied to a one-time commitment. everything else is enforced higher up the stack.
