# Sly — Stellar testnet evidence pack

**Hello Stellar Development Foundation review team.** This repo answers your specific review note: *"The demo at getsly.ai/demo shows a functional dashboard but transactions cannot be independently verified on chain."*

Everything you need to independently verify Sly's shipped Stellar work is here in this repo. No data-room access, no contact request, no Sly login required.

## 2-minute narrated tour of the demo tenant

Prefer to watch first? [`demo/stellar-sdf-tour-narrated.mp4`](./demo/stellar-sdf-tour-narrated.mp4) is a 2:24 walkthrough of exactly what the demo tenant at `app.getsly.ai` looks like when you log in — every claim in the video pairs with a chain-side or offline verifier check documented below. See [`demo/README.md`](./demo/) for the beat-by-beat map from video timestamps to the evidence files.

## 30-second verification

```bash
# 1. Get the verifier (57 lines, only Node built-ins)
curl -fsSL -o verify-offline.mjs \
  https://raw.githubusercontent.com/Sly-devs/stellar-evidence/main/verify-offline.mjs

# 2. Get the headline signed receipt
curl -fsSL -o headline-receipt.json \
  https://raw.githubusercontent.com/Sly-devs/stellar-evidence/main/receipts/rcpt_c477197e-a4af-44ad-8b08-63a8053a67f0.json

# 3. Use the demo tenant's sandbox-only HMAC key (published in STELLAR_EVIDENCE.md §4)
export SLY_WITNESS_HMAC_KEY=00f99d03a83840fe97a6df78d46750ff44e7e7894746f7e002cad3901d823c91

# 4. Verify the signature offline (no Sly infra, no network access required)
node verify-offline.mjs headline-receipt.json
# → ✓ SIGNATURE VALID — receipt is verifiable offline.

# 5. Confirm the underlying Stellar testnet settle is real
open https://stellar.expert/explorer/testnet/tx/378e8aa99eb136c50e9ee5d7ebaca3d4f931c2b701d241fc6419f7470a4ccc12
```

## What's in this repo

| File | Purpose |
|---|---|
| [`STELLAR_EVIDENCE.md`](./STELLAR_EVIDENCE.md) | **Primary deliverable.** Headline tx + 12 additional verified Stellar testnet settlements, every link resolvable today. Full receipt JSON for offline verification. Honest disclosure of what's wired-but-latent. Verification log appendix recording every check performed. |
| [`DEMO_ADDENDUM.md`](./DEMO_ADDENDUM.md) | Per-beat specification of dashboard views paired with their matching Stellar Explorer URLs — converts the dashboard from a presentation surface into a verification surface. |
| [`receipts/`](./receipts/) | The three signed witness receipts cited in the evidence pack. Each verifies offline with the standalone verifier + the demo tenant's witness key. |
| [`verify-offline.mjs`](./verify-offline.mjs) | Standalone HMAC verifier — 57 lines, only Node built-ins, no dependencies. Re-derives the signature against the canonical encoding and byte-compares. |
| [`demo/stellar-sdf-tour-narrated.mp4`](./demo/stellar-sdf-tour-narrated.mp4) | 2:24 narrated tour of the live demo tenant on Stellar testnet. What the reviewer sees at `app.getsly.ai` before logging in themselves. |
| [`export/tenant-export.json`](./export/tenant-export.json) | Machine-readable export of the full demo tenant — every G-address, tx hash, and receipt with stellar.expert URLs. |
| [`export/transfers.csv`](./export/transfers.csv) | Spreadsheet-friendly slice of the transfers with paired Stellar Explorer URLs. |
| [`EXPORT.md`](./EXPORT.md) | Human-readable summary of the export with a worked cross-reference example. |

## What the headline settlement proves

A single governed Sly call settled 0.01 USDC on `stellar:testnet` via the public `x402.org` facilitator. The signed witness receipt carries — and HMACs over — every governance fact about the call:

| Claim on the dashboard | Receipt field | Verifiable in this repo |
|---|---|---|
| KYA tier 2 | `agent_kya_tier: 2` | Frozen in the canonical encoding under the signature |
| Agent cryptographically controls its G-address | `agent_chain_proof: "sep10"` | Signed inside the HMAC |
| Custody is `env_key` (honest sandbox disclosure) | `agent_custody_provider: "env_key"` | Signed inside the HMAC |
| Stellar was picked over Base because fees are sponsored | `rail_selection.reasons: ["picked:fee_sponsored", "picked:cheaper_fee", "picked:faster_finality"]` | Signed inside the HMAC |
| Sly approved this call under policy | `policy_decision.decision: "approve"` | Signed inside the HMAC |
| The settle actually happened on chain | n/a (cross-link) | [stellar.expert tx](https://stellar.expert/explorer/testnet/tx/378e8aa99eb136c50e9ee5d7ebaca3d4f931c2b701d241fc6419f7470a4ccc12) returns HTTP 200, USDC SAC `transfer` op, both G-addresses match the receipt |

Tampering with **any** highlighted field — agent name, KYA tier, proof method, custody provider, rail-selection reason, decision — invalidates the signature. The reviewer can test this themselves by editing the receipt JSON, re-running the verifier, and observing `✕ SIGNATURE INVALID`.

## What this repo is NOT

- **Not Sly's full source.** This is a focused evidence pack. Sly's main monorepo (`Sly-devs/sly`) remains private. If a partial open-source carve-out beyond evidence is useful to the partnership, that's a separate decision.
- **Not a proposal.** Per-tranche definition-of-done for funded work (SEP-10 agents, SDP disbursements, Allbridge receipts) lives in the revised proposal, not here.
- **Not credentials at risk.** The `SLY_WITNESS_HMAC_KEY` in [`STELLAR_EVIDENCE.md`](./STELLAR_EVIDENCE.md) signs sandbox testnet receipts for one demo tenant only. It has no commercial value and is published intentionally to honor the reviewer's "verifiable without repo access" requirement.

## How to reach the team

Email **hello@getsly.ai** with subject "Stellar SDF review — `<your topic>`". Include this repo's URL if you'd like us to update the evidence pack with additional artifacts.

---

*Generated as part of the Sly response to the Stellar SDF grant review revisions. Last evidence verification: 2026-06-30.*
