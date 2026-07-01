# Narrated tour of the Sly demo tenant on Stellar

**A 2:24 walkthrough of the demo tenant at `app.getsly.ai` — what the Stellar Development Foundation reviewer sees when they log in, before they log in.**

## Watch

Directly in the browser: [`stellar-sdf-tour-narrated.mp4`](./stellar-sdf-tour-narrated.mp4)

Or clone and open locally:
```bash
git clone https://github.com/Sly-devs/stellar-evidence.git
open stellar-evidence/demo/stellar-sdf-tour-narrated.mp4
```

## The six beats

Full narration script: [`narration.md`](./narration.md).

| # | Beat | What's on screen | On-chain / off-chain proof pair |
|---|---|---|---|
| 1 | Welcome slate | "The demo, before you log in." | Sets the trust model: chain-side verifiable, offline-verifiable |
| 2 | Transactions list | 13 governed Stellar settlements, `🌟 stellar testnet` badges | Every row corresponds to a real Horizon tx (see [`STELLAR_EVIDENCE.md`](../STELLAR_EVIDENCE.md)) |
| 3 | Transfer detail — flow + actor | `stellar-demo-buyer` → `External wallet`, both G-addresses linked to stellar.expert. Actor Type: **Agent** (not API key) | The semantic identity in the receipt matches the G-addresses moving USDC on chain |
| 4 | Transfer detail — witness receipt | Receipt id, hash, signature, algorithm, canonical encoding, KYA tier, decision — with Download JSON + Copy verify command buttons | Every field is under the HMAC in [`receipts/rcpt_c477197e-…json`](../receipts/rcpt_c477197e-a4af-44ad-8b08-63a8053a67f0.json) — verify with [`verify-offline.mjs`](../verify-offline.mjs) |
| 5 | Agent detail — identity | Total transactions 13, right-sized $1/$10/$100 micropayment limits, `✓ SEP-10 PROVEN` chain binding, "Soroban registry — in development" honest framing | On-chain: [G-address](https://stellar.expert/explorer/testnet/account/GBJWOSLOYOZ2TGWLBMDXTJOAC3UP5A4P7AJM4VLWWS5VRTNMJ3JVSUYJ) actually holds USDC and shows the same 20+ txs |
| 6 | Close slate | "Trust the chain, not the presentation." · pointers to this repo + the live dashboard | — |

## Where the demo sits in the evidence pack

- Video walkthrough → **this file**
- Written verification kit → [`STELLAR_EVIDENCE.md`](../STELLAR_EVIDENCE.md) (30-second reviewer flow)
- Machine-readable tenant export → [`export/tenant-export.json`](../export/tenant-export.json)
- Demo re-recording spec → [`DEMO_ADDENDUM.md`](../DEMO_ADDENDUM.md)
- Signed receipts → [`receipts/`](../receipts/)
- Standalone verifier → [`verify-offline.mjs`](../verify-offline.mjs)

## Recorded from

- Dashboard on `localhost:3000` (identical UI code + Supabase database as production `app.getsly.ai`)
- Live sandbox tenant `Stellar Demo (Epic 102 Phase A)` at time of recording
- 1600×1000 viewport, Jessica narration via ElevenLabs
- Recorder script + narration pipeline: `apps/demo/_shots/gen-stellar-sdf-tour.mjs` and `apps/demo/_shots/narrate-lib.mjs` in the (private) main Sly monorepo
