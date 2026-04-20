# security

## reporting a vulnerability

email security@mevswap.org. encrypt with the pgp key on the website if the disclosure is sensitive.

do not open a public github issue for security reports.

## scope

we want reports about:

- the sdk leaking sender / recipient / amount data outside the proof
- proof verification accepting malformed proofs
- private bundle submission falling back to public mempool unintentionally
- spending rules being bypassable
- replay of nullifiers

we do not want reports about:

- jupiter route pricing (talk to jupiter)
- solana rpc availability (talk to your rpc provider)
- mcp clients ignoring our schemas (talk to the client)

## response time

- triage within 72 hours
- patch + release within 14 days for critical, 30 days for high, best-effort otherwise
- credit in the changelog if you want it; anonymous if you don't

## supported versions

| version | supported |
|---|---|
| 0.1.x | ✅ |
| 0.0.x | ❌ (pre-release scaffold only) |
