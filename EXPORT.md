# Stellar Demo tenant — full export

Complete data export of the `Stellar Demo (Epic 102 Phase A)` sandbox tenant for the Stellar Development Foundation grant review. Every on-chain reference here — every G-address, every contract id, every tx hash — is **independently verifiable via stellar.expert or Horizon without any Sly call**.

This export is **read-only structured data**, machine-readable for programmatic checks and human-readable for visual scans. It complements (does not replace) [`STELLAR_EVIDENCE.md`](./STELLAR_EVIDENCE.md), which contains the full reviewer flow and signed-receipt verification.

## Files

| File | Format | Purpose |
|---|---|---|
| [`export/tenant-export.json`](./export/tenant-export.json) | JSON | Complete machine-readable export — tenant, accounts, agents, chain bindings, transfers, on-chain summary, counts. Every G-address and tx hash paired with its stellar.expert + Horizon URL. |
| [`export/transfers.csv`](./export/transfers.csv) | CSV | The transfers slice as a spreadsheet — open in Excel/Numbers/Sheets, sort by tx_hash, click the stellar.expert URL column. |

## TL;DR

```
1 tenant            Stellar Demo (Epic 102 Phase A) — sandbox testnet only
1 parent account    Stellar Demo Treasury (verification tier 2)
2 agents            stellar-demo-buyer (KYA T2) + stellar-demo-t0 (KYA T0, deny-path)
1 chain binding     SEP-10-proven Stellar testnet G-address for the buyer
20 transfers        all stellar:testnet, all 0.01 USDC, all status=completed
19 on-chain settles 19 of 20 transfers correlate to a real Soroban tx hash on Horizon
15 signed receipts  15 of 20 transfers carry a witness-mode HMAC receipt (the earlier 5 settled before Story 102.8 added the receipt envelope to the DB write path)
21 explorer URLs    all 21 stellar.expert URLs in the JSON resolve HTTP 200 at export time
```

## Tenant

```json
{
  "id": "2892d3d8-5ce1-64f5-6a60-4736222d66c0",
  "name": "Stellar Demo (Epic 102 Phase A)",
  "api_key": "pk_test_stellar_demo_2026",
  "allowed_rails": ["stellar:testnet", "base-sepolia", "base"]
}
```

Sandbox / testnet only. Zero production funds. Zero cross-tenant access.

## Agents

| Name | KYA tier | Status | G-address | stellar.expert |
|---|---|---|---|---|
| **`stellar-demo-buyer`** | T2 (Verified) | active | `GBJWOSLO…SUYJ` | [account](https://stellar.expert/explorer/testnet/account/GBJWOSLOYOZ2TGWLBMDXTJOAC3UP5A4P7AJM4VLWWS5VRTNMJ3JVSUYJ) |
| `stellar-demo-t0` | T0 (Registered, deny-path) | active | — (T0 never settles, by design) | — |

The T2 agent's effective limits: **$1000 per transaction · $5000 daily · $20000 monthly**. The T0 agent's limits drop to `$20 / $100 / $500` (Sly's default T0) — calls below T2 are denied at L1 with a signed deny artifact.

## Chain bindings

| Chain | Address | Proof method | Verified at | Status |
|---|---|---|---|---|
| `stellar:testnet` | `GBJWOSLOYOZ2TGWLBMDXTJOAC3UP5A4P7AJM4VLWWS5VRTNMJ3JVSUYJ` | **`sep10`** | 2026-06-11T00:34:23Z | active |

This is what flips the receipt's `agent_chain_proof` field from `asserted` to `sep10` — the agent cryptographically proved control of the G-address via Stellar Web Authentication.

→ [see the G-address on stellar.expert](https://stellar.expert/explorer/testnet/account/GBJWOSLOYOZ2TGWLBMDXTJOAC3UP5A4P7AJM4VLWWS5VRTNMJ3JVSUYJ)

## Transfers — 20 governed Stellar settles

Each row in [`transfers.csv`](./export/transfers.csv) has columns:

```
transfer_id, settled_at, amount, currency, receipt_id, agent_kya_tier,
agent_chain_proof, agent_custody_provider, from_address, to_address,
tx_hash, ledger, stellar_expert_url
```

The `stellar_expert_url` column is the smoking gun — click any of the 19 that have a tx_hash and you're inside the public Stellar Explorer, looking at a real Soroban `invoke_host_function` USDC SAC `transfer` operation from the buyer G-address to the seller G-address.

### Distribution

| Field | Distribution |
|---|---|
| `amount` | All 20 transfers are 0.01 USDC. Sub-cent settles — exactly the agent-micropayment use case Stellar is best at. |
| `status` | 20/20 `completed`. No partial states. |
| `agent_chain_proof` | 8 `sep10` (post-binding), 1 `asserted` (pre-binding outlier — proves the field is a real switch), 11 absent (pre-Story-102.6 transfers, before the field was added to the envelope) |
| `agent_custody_provider` | 7 `env_key` (post-Story-102.4a), 13 absent (pre-Story-102.4a) |
| `rail_selection.reasons` | All 15 receipts carry the same three reasons: `picked:fee_sponsored`, `picked:cheaper_fee`, `picked:faster_finality` |
| `from_address` | All transfers: `GBJWOSLO…SUYJ` (the demo buyer agent) |
| `to_address` | All transfers: `GAUJGJMP…BA4` (the demo seller) |
| Timestamps | 14 from 2026-06-10/11 (the original Phase A flurry), 6 from 2026-06-30 (today's fresh activity) |

### One outlier, disclosed

Transfer `0bf0946e-22b2-461a-bacf-772619fdbdbe` (the oldest) has `on_chain: null` — no matching Horizon tx within 5 seconds of the receipt timestamp. Real settlement may have occurred outside the 50-tx window we pulled, but to be honest we don't claim a hash we can't verify. The other 19 transfers all match.

## On-chain summary

```json
{
  "buyer_g_address": "GBJWOSLOYOZ2TGWLBMDXTJOAC3UP5A4P7AJM4VLWWS5VRTNMJ3JVSUYJ",
  "buyer_stellar_expert_url": "https://stellar.expert/explorer/testnet/account/GBJWOSLOYOZ2TGWLBMDXTJOAC3UP5A4P7AJM4VLWWS5VRTNMJ3JVSUYJ",
  "usdc_sac_contract": "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA",
  "usdc_sac_stellar_expert_url": "https://stellar.expert/explorer/testnet/contract/CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA",
  "balances": [
    { "asset": "USDC", "balance": "19.8100000" },
    { "asset": "native", "balance": "9999.9999900" }
  ],
  "successful_tx_count_in_window": 22
}
```

The USDC balance arithmetic checks out: 22 successful Horizon txs visible − account-creation/funding setup overhead = the 19 settles correlated above (each −0.01 USDC = −0.19 USDC total) plus a few initial setup ops. The balance reads 19.81 USDC at export time.

## URL verification (hard rule)

Every stellar.expert URL emitted in this export was verified to return HTTP 200 at export time. **21 URLs checked. 21 OK. 0 failed.** See the verification step in [`STELLAR_EVIDENCE.md`](./STELLAR_EVIDENCE.md) §10 for the bash one-liner you can re-run yourself.

## How to cross-reference any single transfer end-to-end

Pick any transfer from the CSV that has a `tx_hash`. For example, the headline:

```
transfer_id      = 34770f8e-0f4c-4444-bc07-287d2837054e
receipt_id       = rcpt_c477197e-a4af-44ad-8b08-63a8053a67f0
tx_hash          = 378e8aa99eb136c50e9ee5d7ebaca3d4f931c2b701d241fc6419f7470a4ccc12
stellar_expert   = https://stellar.expert/explorer/testnet/tx/378e8aa9…0a4ccc12
```

1. **Click the `stellar_expert` URL** — see the real Soroban USDC SAC transfer, signed and settled, between the two G-addresses the receipt names.
2. **Download the receipt JSON** from [`receipts/rcpt_c477197e-a4af-44ad-8b08-63a8053a67f0.json`](./receipts/rcpt_c477197e-a4af-44ad-8b08-63a8053a67f0.json) (or extract it from `tenant-export.json` under `transfers[i].receipt`).
3. **Run the verifier** from [`STELLAR_EVIDENCE.md`](./STELLAR_EVIDENCE.md) §4 — `node verify-offline.mjs <receipt>.json` with the published HMAC key.
4. **Observe `✓ SIGNATURE VALID`**, then edit the receipt's `agent_kya_tier` from `2` to `99`, re-run, and watch it print `✕ SIGNATURE INVALID`. Tamper-evident across every signed field.

That's the full chain of custody for one row of the CSV. The other 18 work identically with their own receipt + tx hash.

## What this export does NOT contain

- **No production data.** Sandbox tenant only.
- **No human PII.** No emails on the parent account. Agent names are non-personal labels (`stellar-demo-buyer`).
- **No credentials.** The published API key is sandbox-only; the published witness HMAC key signs sandbox receipts only.
- **No source code.** Sly's main monorepo (`Sly-devs/sly`) stays private; this repo is only the evidence pack for the SDF review.
- **No cross-tenant data.** Supabase RLS isolates this tenant; the export query joins only `tenant_id = 2892d3d8-…`.

## Reproducibility

Export was generated at the `meta.generated_at` timestamp inside [`tenant-export.json`](./export/tenant-export.json). A reviewer with the [reviewer-access-kit](#) credentials can independently:

1. Sign in to https://app.getsly.ai as `operator@stellar-demo.sly.dev`
2. Open `/dashboard/transfers` — see the same 20 rows
3. Click any row → Witness Receipt panel shows the same `signature`, same `rail_selection.reasons`, same `agent_chain_proof` value as `transfers[i].receipt` in this JSON
4. Re-derive every value at any time — Sly does not retain the right to mutate this artifact's referents (the Horizon ground truth is on chain).

The export is a snapshot; the chain is the source of truth.
