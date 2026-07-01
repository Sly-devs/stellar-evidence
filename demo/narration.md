# Stellar SDF reviewer tour — Sly demo tenant

Six beats, ~2:20. Companion to the public evidence repo and the
`STELLAR_EVIDENCE.md` document. Walks a Stellar Development
Foundation reviewer through exactly what the demo tenant at
`app.getsly.ai` looks like when they log in — before they touch it
themselves. Every claim in the video pairs with a chain-side proof.

## Beat 1 — Welcome slate

This is the Sly demo tenant on Stellar testnet. Everything you're
about to see is verifiable against the chain — every transaction
resolves on stellar.expert, every receipt verifies offline with
the standalone verifier in our public repo. Log in as
operator@stellar-demo.sly.dev when you want to explore it
yourself.

**Chips:**

- Sly demo tenant on Stellar testnet
- Every claim → verifiable on chain
- Public repo, sandbox key, offline verifier

## Beat 2 — Transactions list

Thirteen governed Stellar settlements by a single Sly agent under
one tenant. Every row is an x402 flow that ran the full L1 through
L5 governance loop and settled a Soroban USDC transfer on chain.
Rail badge marks stellar testnet. Amount is a hundredth of a
cent. Status is completed. The list is live — click into any row
and you're looking at the same on-chain settle as stellar.expert.

**Chips:**

- 13 governed Stellar settlements
- x402 rail · Soroban USDC · completed
- One click from row to on-chain proof

## Beat 3 — Inside a transfer

Transfer flow. From stellar-demo-buyer — the agent — with its
G-address linked to stellar.expert. To an external wallet, with
the seller's G-address linked to stellar.expert. Initiated by
type: Agent. Not the API key. The agent is the semantic actor;
the API key is honestly surfaced below as the auth credential.
Everything the receipt signs — agent, tier, decision — is right
there under the panel.

**Chips:**

- Actor type: Agent (not API key)
- G-address chips → stellar.expert
- Receipt signs the identity

## Beat 4 — The witness receipt

This is the artifact. Receipt id, receipt hash, signature over the
canonical encoding, algorithm HMAC-SHA256, canonical encoding
json-sort-keys-v1, agent stellar-demo-buyer at KYA T2, decision
approve. Download the JSON, run the standalone verifier from the
public repo, and every field you see here is byte-tamper-proof.
No Sly infrastructure required for the check.

**Chips:**

- HMAC over canonical encoding
- Every field is tamper-evident
- Offline-verifiable, no Sly needed

## Beat 5 — The agent's identity

Back at the agent page. Total transactions thirteen, volume
thirteen cents — the tenant is active. Right-sized limits — a
dollar per call, ten dollars a day, a hundred a month — because
this is a sub-cent agent-micropayment use case, not an
over-provisioned demo. KYA tab. Chain Bindings panel. SEP-10
proven, verified, the G-address that signed every one of those
thirteen settles. Below: On-Chain Identity. Wallet linked to
stellar.expert. Network Stellar testnet. Registry — Soroban
registry, in development. We say what's shipped and what isn't.

**Chips:**

- 13 · $0.13 · sub-cent micropayments
- ✓ SEP-10 PROVEN chain binding
- Honest about what's in development

## Beat 6 — Close slate

Every field you saw ties to an artifact in our public repository
at github.com slash Sly-devs slash stellar-evidence. Log in when
you're ready, or verify from the chain alone. The trust model is
the same.

**Chips:**

- github.com/Sly-devs/stellar-evidence
- app.getsly.ai · sandbox tenant ready
- Trust the chain, not the presentation
