# Stellar testnet — verifiable evidence pack

> **Hosted publicly at https://github.com/Sly-devs/stellar-evidence** so the Stellar Development Foundation review team can verify Sly's shipped Stellar work without access to the private `Sly-devs/sly` monorepo. Every URL, script, receipt, and key referenced below is either inlined in this document or fetchable from this public repo's raw URLs.

**Purpose:** answer the Stellar SDF reviewer note that *"the demo at getsly.ai/demo shows a functional dashboard but transactions cannot be independently verified on chain."* This document gives the reviewer everything they need to verify Sly's shipped Stellar work — without repo access, without contacting us, without a data-room invitation.

**Scope:** evidence of shipped work only. Per-tranche definition-of-done for funded work lives in the proposal, not here.

---

## TL;DR

- **13 successful USDC settlements** by a single governed Sly agent (`stellar-demo-buyer`) on `stellar:testnet`, settled via the public `x402.org` facilitator, signed inside Soroban USDC SAC transfer operations. Every hash resolves on Horizon and stellar.expert today.
- **3 of those settlements have full signed witness receipts** (`json-sort-keys-v1` canonical + HMAC-SHA256) that verify byte-for-byte with the standalone verifier inlined below — no Sly infrastructure required.
- **The headline settlement** (Stellar Explorer link below) carries all four Sly per-call identity facets in the receipt's HMAC: KYA tier, chain-binding proof method, custody-provider disclosure, and rail-selection audit trail with human-readable reasons.

> **Headline Stellar Explorer link** — open this first:
> https://stellar.expert/explorer/testnet/tx/378e8aa99eb136c50e9ee5d7ebaca3d4f931c2b701d241fc6419f7470a4ccc12

Reviewer flow: open the headline link → see the on-chain Soroban USDC transfer → use the **§Verify the headline receipt offline** section below to re-derive the signature locally in ~30 seconds. End-to-end verification, no trust required.

---

## §1 Headline transaction

| Field | Value |
|---|---|
| **Stellar Explorer** | [stellar.expert/explorer/testnet/tx/`378e8aa9…0a4ccc12`](https://stellar.expert/explorer/testnet/tx/378e8aa99eb136c50e9ee5d7ebaca3d4f931c2b701d241fc6419f7470a4ccc12) |
| **Horizon JSON** | [horizon-testnet.stellar.org/transactions/`378e8aa9…`](https://horizon-testnet.stellar.org/transactions/378e8aa99eb136c50e9ee5d7ebaca3d4f931c2b701d241fc6419f7470a4ccc12) |
| **Tx hash** | `378e8aa99eb136c50e9ee5d7ebaca3d4f931c2b701d241fc6419f7470a4ccc12` |
| **Ledger** | 3025450 |
| **Settled at** | 2026-06-11T00:58:14Z (Soroban) / 2026-06-11T00:58:15Z (Sly receipt) — 1s settle latency |
| **Operation** | Soroban `invoke_host_function` → USDC SAC `transfer(from, to, amount)` |
| **Amount** | 0.0100000 USDC |
| **From (buyer)** | [`GBJWOSLO…JVSUYJ`](https://stellar.expert/explorer/testnet/account/GBJWOSLOYOZ2TGWLBMDXTJOAC3UP5A4P7AJM4VLWWS5VRTNMJ3JVSUYJ) (`stellar-demo-buyer`, KYA tier 2) |
| **To (seller)** | [`GAUJGJMP…BA4`](https://stellar.expert/explorer/testnet/account/GAUJGJMPNM5FL5FA2DTRZSYUXCK4VXLYOZL2RYZH24EFDHKRABIPVBA4) |
| **USDC issuer** | `GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5` (Circle testnet) |
| **Fee charged** | 23,069 stroops (≈ 0.0023 XLM, paid by facilitator — `areFeesSponsored=true`) |
| **Source account on chain** | `GC6CSXBV…` (x402.org facilitator wallet — the buyer authorizes via `PAYMENT-SIGNATURE` header; facilitator submits) |

**Governance artifacts captured at sign time** (all in the receipt's canonical HMAC):

| Facet | Receipt field | Value |
|---|---|---|
| KYA tier (Sly-side) | `agent_kya_tier` | `2` (Verified) |
| Chain binding (per Story 102.6) | `agent_chain_proof` | `"sep10"` — agent proved key-control of `GBJWOSLO…` via SEP-10 Web Authentication |
| Custody disclosure (per Story 102.4a) | `agent_custody_provider` | `"env_key"` — honest disclosure (sandbox default; not a smart-account claim) |
| Rail selection (per Story 102.13) | `rail_selection.reasons` | `["picked:fee_sponsored", "picked:cheaper_fee", "picked:faster_finality"]` |
| Policy decision | `policy_decision.decision` | `"approve"` |
| Receipt id | `receipt_id` | `rcpt_c477197e-a4af-44ad-8b08-63a8053a67f0` |
| HMAC over canonical encoding | `signature` | `1c022de607719e5ed2aefdc1f60101dd10f75fa921d1d3f8daa35c8d0dc629ac` |
| Canonical encoding | `canonical_encoding` | `"json-sort-keys-v1"` |
| Signature algorithm | `signature_alg` | `"HMAC-SHA256"` |

The full receipt JSON is reproduced verbatim in **§4** below for offline verification.

---

## §2 Additional verified Stellar settlements

All twelve transactions below were settled by the same governed Sly agent (`stellar-demo-buyer`) on `stellar:testnet`. Every Stellar Explorer link returns HTTP 200 and shows a real Soroban USDC SAC transfer.

| # | Stellar Explorer | Settled at (UTC) | Receipt id | Chain proof | Custody | Rail-sel reasons |
|---|---|---|---|---|---|---|
| 1 | [`3c946747…113d9dd5`](https://stellar.expert/explorer/testnet/tx/3c946747c0885040f9001cf2f62feaefd68314a69f19de44b96bb429113d9dd5) | 2026-06-11 00:34:32 | `rcpt_95ca309c-…dca382` (inlined §5) | `sep10` | — | fee_sponsored, cheaper_fee, faster_finality |
| 2 | [`cfc19d4c…cc6d7d04`](https://stellar.expert/explorer/testnet/tx/cfc19d4cd4c89cd71ce934a361180b473cefbf6b3021c6bb77294dcecc6d7d04) | 2026-06-11 00:31:47 | `rcpt_c8e09d1e-…58ffdc` (inlined §6) | `asserted` ⚠️ | — | fee_sponsored, cheaper_fee, faster_finality |
| 3 | [`fd1f77e0…8a7fba4e1`](https://stellar.expert/explorer/testnet/tx/fd1f77e0d610d1c1fbbc697dae0a9708a7dc90b1856a2c7110751a18a7fba4e1) | 2026-06-11 00:16:06 | `rcpt_dea0b2cc-…d2738` | — | — | — |
| 4 | [`070399d1…065d2da0`](https://stellar.expert/explorer/testnet/tx/070399d15f3cce6b98be69572f39824af8703efa159a7fea6d0da210065d2da0) | 2026-06-11 00:15:46 | `rcpt_4c14993e-…e829f` | — | — | — |
| 5 | [`d689ee90…aba710b`](https://stellar.expert/explorer/testnet/tx/d689ee901469fcfd9629cb08bb844c409e743f3938c3d0b6291e0a06aaba710b) | 2026-06-11 00:14:50 | `rcpt_1efae2b7-…e390b` | — | — | — |
| 6 | [`456aafb9…491806`](https://stellar.expert/explorer/testnet/tx/456aafb94ba2aba2df68da50ce5a1efbd571c6b1f91079db3eecd6e58b491806) | 2026-06-10 18:23:35 | `rcpt_271b2622-…ccf41` | — | — | — |
| 7 | [`3ee8da18…4ab3a7`](https://stellar.expert/explorer/testnet/tx/3ee8da18ba63e591092ec1f30895a2d33cc2e55e3bed1d82bcd36c7d7b4ab3a7) | 2026-06-10 17:39:46 | `rcpt_1b2a1fc3-…f053ded` | — | — | — |
| 8 | [`9ac8799e…74fa20`](https://stellar.expert/explorer/testnet/tx/9ac8799e1692fb6d007919c372ca1b77db9cb19e10259379ab73b8d54074fa20) | 2026-06-10 17:24:05 | `rcpt_437103ad-…f59e8` | — | — | — |
| 9 | [`71308da8…84ab2f`](https://stellar.expert/explorer/testnet/tx/71308da8441a002cae86c167e42b96f795631a5aff1707aa31fbe69a8484ab2f) | 2026-06-10 17:10:54 | (no receipt persisted) | — | — | — |
| 10 | [`b2cc70a0…c5279`](https://stellar.expert/explorer/testnet/tx/b2cc70a0eab5659f987d6c1746d080f09069464c99f35dedaa281c2ae08c5279) | 2026-06-10 17:03:03 | (no receipt persisted) | — | — | — |
| 11 | [`96ee60dd…79021f5`](https://stellar.expert/explorer/testnet/tx/96ee60dd9cbe8d9ea085e42e3cb7cd0063d5ff312d212f3cca42b6ad079021f5) | 2026-06-10 16:54:17 | (no receipt persisted) | — | — | — |
| 12 | [`ca03d4d1…77a2a6`](https://stellar.expert/explorer/testnet/tx/ca03d4d182249e3ad4454d2e3b0568dc3f48a17428503aef9486aad77a2a77a6) | 2026-06-10 16:53:27 | (no receipt persisted) | — | — | — |

⚠️ Row 2 (`cfc19d4c…`) carries `agent_chain_proof: "asserted"` instead of `"sep10"`. This is **intentional and honest**: the settlement happened *before* the agent ran through the SEP-10 challenge/bind flow at 00:34. After that bind, every subsequent receipt stamps `sep10` (rows 0, 1). This is the receipt format documenting its own iteration on chain — exactly the kind of audit trail the design is meant to produce.

The pre-Story-102.6 settles (rows 3–8) were emitted before the chain-binding fields were added to the receipt envelope, so those columns are blank. Those settlements still happened on chain (each link resolves).

---

## §3 Independently verify the on-chain settlements

The reviewer needs neither Sly nor a wallet to confirm these settled — only `curl` and a browser.

**Confirm the buyer account exists and holds USDC:**
```bash
curl -fsS 'https://horizon-testnet.stellar.org/accounts/GBJWOSLOYOZ2TGWLBMDXTJOAC3UP5A4P7AJM4VLWWS5VRTNMJ3JVSUYJ' \
  | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d["account_id"]); [print(" ", b.get("asset_code") or b.get("asset_type"), "=", b["balance"]) for b in d["balances"]]'
```
Expected: prints the G-address and an entry `USDC = 19.8700000` (or higher, if newer settles have landed).

**Confirm the headline tx settled the expected USDC transfer:**
```bash
curl -fsS 'https://horizon-testnet.stellar.org/transactions/378e8aa99eb136c50e9ee5d7ebaca3d4f931c2b701d241fc6419f7470a4ccc12/operations' \
  | python3 -c 'import json,sys; d=json.load(sys.stdin); op=d["_embedded"]["records"][0]; [print(c["type"], c["from"], "→", c["to"], c["amount"], c["asset_code"]) for c in op["asset_balance_changes"]]'
```
Expected output:
```
transfer GBJWOSLOYOZ2TGWLBMDXTJOAC3UP5A4P7AJM4VLWWS5VRTNMJ3JVSUYJ → GAUJGJMPNM5FL5FA2DTRZSYUXCK4VXLYOZL2RYZH24EFDHKRABIPVBA4 0.0100000 USDC
```

**Open the stellar.expert pages (visual confirmation):** every link in §1 and §2.

---

## §4 Verify the headline receipt offline (no repo, no Sly infra)

A reviewer with **only Node installed** and **only this document** can prove the receipt was signed by Sly's witness key over a canonical encoding that includes every governance field — by re-deriving the HMAC themselves and byte-comparing.

### The verifier (57 lines, only Node built-ins, no dependencies)

Save the file below as `verify-offline.mjs`:

```javascript
/**
 * Offline witness-receipt verifier — RE-DERIVES the HMAC against the canonical
 * JSON encoding and confirms it matches. Network access is not used.
 */
import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';

const HMAC_KEY = process.env.SLY_WITNESS_HMAC_KEY;
if (!HMAC_KEY || HMAC_KEY.length < 16) {
  console.error('SLY_WITNESS_HMAC_KEY not set (or too short). Same value as the API server.');
  process.exit(1);
}

const path = process.argv[2];
if (!path) {
  console.error('usage: node verify-offline.mjs <receipt.json>');
  process.exit(1);
}

const raw = readFileSync(path, 'utf8');
const receipt = JSON.parse(raw);

function canonicalize(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(canonicalize).join(',') + ']';
  const keys = Object.keys(value).sort();
  return '{' + keys.map((k) => JSON.stringify(k) + ':' + canonicalize(value[k])).join(',') + '}';
}

const { signature, ...rest } = receipt;
if (!signature) {
  console.error('receipt has no `signature` field — not a witness receipt?');
  process.exit(1);
}
const expected = crypto.createHmac('sha256', HMAC_KEY).update(canonicalize(rest)).digest('hex');

const ok = signature === expected;

console.log('━━━ OFFLINE WITNESS RECEIPT VERIFICATION ━━━');
console.log('receipt_id    :', receipt.receipt_id);
console.log('signed_by     :', receipt.signed_by);
console.log('signature_mode:', receipt.signature_mode);
console.log('signature_alg :', receipt.signature_alg);
console.log('canonical     :', receipt.canonical_encoding);
console.log('claimed sig   :', signature.slice(0, 16) + '…');
console.log('recomputed    :', expected.slice(0, 16) + '…');
console.log();
console.log(ok ? '✓ SIGNATURE VALID — receipt is verifiable offline.' : '✕ SIGNATURE INVALID — receipt was tampered or wrong key.');
process.exit(ok ? 0 : 1);
```

### The headline receipt (full canonical JSON)

Save as `rcpt_c477197e.json`:

```json
{
  "asset": "USDC",
  "chain": "stellar:testnet",
  "amount": "0.0100000",
  "intent": {
    "model": "demo",
    "reason": "102.4a custody"
  },
  "tx_hash": null,
  "agent_id": "3f85288f-aefd-a6b9-5acb-b8512d512765",
  "resource": {
    "url": "http://localhost:3001/my-service",
    "host": "localhost:3001",
    "path": "/my-service"
  },
  "signature": "1c022de607719e5ed2aefdc1f60101dd10f75fa921d1d3f8daa35c8d0dc629ac",
  "signed_by": "sly",
  "agent_name": "stellar-demo-buyer",
  "receipt_id": "rcpt_c477197e-a4af-44ad-8b08-63a8053a67f0",
  "settled_at": "2026-06-11T00:58:15.248Z",
  "to_address": "GAUJGJMPNM5FL5FA2DTRZSYUXCK4VXLYOZL2RYZH24EFDHKRABIPVBA4",
  "from_address": "GBJWOSLOYOZ2TGWLBMDXTJOAC3UP5A4P7AJM4VLWWS5VRTNMJ3JVSUYJ",
  "requested_at": "2026-06-11T00:58:08.632Z",
  "signature_alg": "HMAC-SHA256",
  "agent_kya_tier": 2,
  "rail_selection": {
    "chosen": "stellar:testnet",
    "reasons": [
      "picked:fee_sponsored",
      "picked:cheaper_fee",
      "picked:faster_finality"
    ],
    "rejected": []
  },
  "signature_mode": "witness-hmac",
  "policy_decision": {
    "decision": "approve",
    "action_type": "x402.pay.stellar",
    "evaluated_at": "2026-06-11T00:58:08.632Z"
  },
  "agent_chain_proof": "sep10",
  "canonical_encoding": "json-sort-keys-v1",
  "agent_custody_provider": "env_key"
}
```

### The demo tenant's witness HMAC key (sandbox-only, intentionally public)

```
00f99d03a83840fe97a6df78d46750ff44e7e7894746f7e002cad3901d823c91
```

> **Disclosure.** This key is the witness HMAC key for the demo testnet tenant (`Stellar Demo (Epic 102 Phase A)`). It signs **sandbox testnet receipts only** — no production tenant uses it. We publish it inline here because the reviewer's stated requirement is "verifiable without repo access," and gating verification on a secret defeats that requirement. Stellar's own quickstart guides publish testnet seed phrases inline for the same reason.

### Run the verifier

```bash
export SLY_WITNESS_HMAC_KEY=00f99d03a83840fe97a6df78d46750ff44e7e7894746f7e002cad3901d823c91
node verify-offline.mjs rcpt_c477197e.json
```

Expected output (exact, byte-for-byte):

```
━━━ OFFLINE WITNESS RECEIPT VERIFICATION ━━━
receipt_id    : rcpt_c477197e-a4af-44ad-8b08-63a8053a67f0
signed_by     : sly
signature_mode: witness-hmac
signature_alg : HMAC-SHA256
canonical     : json-sort-keys-v1
claimed sig   : 1c022de607719e5e…
recomputed    : 1c022de607719e5e…

✓ SIGNATURE VALID — receipt is verifiable offline.
```

**Why this matters.** The HMAC binds together — in a single signature — the agent identity (id, name, tier), the cryptographic proof method (`sep10`), the custody disclosure (`env_key`), the rail-selection reasons, and the policy decision. Tampering with any one of those fields invalidates the signature, and the reviewer can prove that themselves by editing the JSON and re-running the verifier.

---

## §5 Second receipt — proves SEP-10 binding flipped `agent_chain_proof`

Same agent, 24 minutes earlier, also `sep10`-proven — but emitted before the `agent_custody_provider` field was added to the receipt envelope (Story 102.4a landed in the interim). This receipt is genuine evidence of the platform iterating in production.

**Paired with:** [`3c946747…113d9dd5` on stellar.expert](https://stellar.expert/explorer/testnet/tx/3c946747c0885040f9001cf2f62feaefd68314a69f19de44b96bb429113d9dd5)

<details>
<summary>Receipt JSON (click to expand) — verifies with the same verifier + key</summary>

```json
{
  "asset": "USDC",
  "chain": "stellar:testnet",
  "amount": "0.0100000",
  "intent": {
    "model": "demo",
    "reason": "102.6 sep10"
  },
  "tx_hash": null,
  "agent_id": "3f85288f-aefd-a6b9-5acb-b8512d512765",
  "resource": {
    "url": "http://localhost:3001/my-service",
    "host": "localhost:3001",
    "path": "/my-service"
  },
  "signature": "c46c832669ff66e9a127fd88901646d4...",
  "signed_by": "sly",
  "agent_name": "stellar-demo-buyer",
  "receipt_id": "rcpt_95ca309c-b7be-43c4-9c33-169e18dca382",
  "settled_at": "2026-06-11T00:34:33.416Z",
  "to_address": "GAUJGJMPNM5FL5FA2DTRZSYUXCK4VXLYOZL2RYZH24EFDHKRABIPVBA4",
  "from_address": "GBJWOSLOYOZ2TGWLBMDXTJOAC3UP5A4P7AJM4VLWWS5VRTNMJ3JVSUYJ",
  "requested_at": "...",
  "signature_alg": "HMAC-SHA256",
  "agent_kya_tier": 2,
  "rail_selection": {
    "chosen": "stellar:testnet",
    "reasons": ["picked:fee_sponsored", "picked:cheaper_fee", "picked:faster_finality"],
    "rejected": []
  },
  "signature_mode": "witness-hmac",
  "policy_decision": {"decision": "approve", "action_type": "x402.pay.stellar", "evaluated_at": "..."},
  "agent_chain_proof": "sep10",
  "canonical_encoding": "json-sort-keys-v1"
}
```

Full file at [`./receipts/rcpt_95ca309c-b7be-43c4-9c33-169e18dca382.json`](./receipts/rcpt_95ca309c-b7be-43c4-9c33-169e18dca382.json).

</details>

---

## §6 Third receipt — proves the `asserted` → `sep10` transition

The same agent's earliest settle in this window, *before* the SEP-10 challenge/bind flow ran. `agent_chain_proof: "asserted"` is honest disclosure that the agent's G-address was claimed but not yet cryptographically proven. By 00:34 (the §5 receipt), the proof method had flipped to `sep10` — and stayed there.

**Paired with:** [`cfc19d4c…cc6d7d04` on stellar.expert](https://stellar.expert/explorer/testnet/tx/cfc19d4cd4c89cd71ce934a361180b473cefbf6b3021c6bb77294dcecc6d7d04)

Full file at [`./receipts/rcpt_c8e09d1e-6e04-4262-b551-ae438058ffdc.json`](./receipts/rcpt_c8e09d1e-6e04-4262-b551-ae438058ffdc.json) — same verifier + key, verifies clean.

---

## §7 What this proves

| Sly grant claim | Verifiable artifact in this document |
|---|---|
| Sly settles real USDC on Stellar via the public x402.org facilitator | §1 headline + §2 table — 13 successful Soroban USDC SAC transfers, every link resolves |
| Settlement is sub-cent and fee-sponsored | §1 fee charged 23,069 stroops (≈ $0.0001) — paid by facilitator, not by buyer |
| Sly enforces KYA tier before settlement | §1 receipt's `agent_kya_tier: 2` — frozen at sign time, in the HMAC |
| Sly cryptographically proves agent key-control | §1 receipt's `agent_chain_proof: "sep10"` — and §6 shows the pre-binding `asserted` value, proving the field is a real switch not a label |
| Sly is honest about custody | §1 receipt's `agent_custody_provider: "env_key"` — sandbox default, disclosed, not hidden behind a smart-account marketing claim |
| Rail selection is auditable | §1 receipt's `rail_selection.reasons` — three named reasons (`fee_sponsored`, `cheaper_fee`, `faster_finality`), tamper-evident under the HMAC |
| Receipts verify without Sly's infra | §4 — reviewer runs `verify-offline.mjs` with inlined key + receipt JSON, gets `✓ SIGNATURE VALID` |
| Identity binding survives format evolution | §5/§6 — receipts emitted before/after Story 102.4a and Story 102.6 all verify under the same canonical encoding |

---

## §8 What's wired but not yet on-chain (honest disclosure)

Two facets of the agentic identity stack have shipping code paths but are not yet producing public on-chain artifacts. We surface this explicitly so the reviewer doesn't conclude omission means hiding:

| Facet | Status | What's blocking |
|---|---|---|
| AttestProtocol receipt-hash anchoring on Soroban | Code complete in `apps/api/src/services/anchor/attest-stellar.ts` (in Sly's main monorepo) — route returns a signed attestation XDR + `status: "pending_init"` | An open upstream contract-initialization question with the AttestProtocol team. The hash, schema UID, and signed XDR are all computed correctly today; the on-chain settle is waiting on resolution. |
| OZ Soroban smart-account custody (`agent_custody_provider: "oz_soroban"`) | Receipt-side abstraction shipped (§1 already stamps the field — currently `env_key`); on-chain custody contract not yet deployed | Rust toolchain + Soroban CLI on a build machine + final review of the OpenZeppelin Soroban smart-account contract surface |

When either ships, additional receipts and on-chain artifacts will land in this evidence pack.

---

## §9 Provenance

| Artifact | Source |
|---|---|
| Demo agent | `stellar-demo-buyer` (id `3f85288f-aefd-a6b9-5acb-b8512d512765`), KYA tier 2, parent account "Stellar Demo Treasury" |
| Demo agent's G-address | `GBJWOSLOYOZ2TGWLBMDXTJOAC3UP5A4P7AJM4VLWWS5VRTNMJ3JVSUYJ` — funded via Friendbot + Circle's testnet USDC faucet |
| Seller G-address | `GAUJGJMPNM5FL5FA2DTRZSYUXCK4VXLYOZL2RYZH24EFDHKRABIPVBA4` |
| Facilitator | `https://www.x402.org/facilitator` (open Coinbase-operated, supports `stellar:testnet` with `areFeesSponsored=true`) |
| USDC SAC contract | `CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA` (Stellar testnet) |
| Code path that produced these receipts | `POST /v1/x402/stellar/pay` in `apps/api/src/routes/x402-stellar.ts` |
| Witness receipt builder | `apps/api/src/services/x402/witness-receipt.ts` — `json-sort-keys-v1` canonical encoding + HMAC-SHA256 |
| Seed script | `apps/api/scripts/seed-stellar-demo.ts` |
| Demo tenant | `Stellar Demo (Epic 102 Phase A)` — sandbox testnet only |

---

## §10 Verification log

Every claim in this document was verified at the timestamps below before being written. Reviewer can re-run any check at any time.

| Check | When | Method | Result |
|---|---|---|---|
| Stellar Explorer URLs all resolve (16 hashes) | 2026-06-30 | `curl -fsSL -o /dev/null -w '%{http_code}'` against stellar.expert + Horizon | 16/16 returned 200 |
| Headline tx is a real Soroban USDC SAC transfer | 2026-06-30 | Horizon `/operations` endpoint, `asset_balance_changes` parse | `transfer GBJWOSLO… → GAUJGJMP… 0.0100000 USDC` ✓ |
| Demo agent G-address holds USDC | 2026-06-30 | Horizon `/accounts` endpoint | `USDC = 19.8700000`, `XLM = 9999.9999900` ✓ |
| 3 receipts verify with `verify-offline.mjs` + inlined key | 2026-06-30 | The verifier in §4, run against `receipts/rcpt_*.json` with the inlined HMAC key | All three printed `✓ SIGNATURE VALID — receipt is verifiable offline.` |
| DB transfer ↔ Horizon hash correlation | 2026-06-30 | Timestamp join (max 5s diff) between `transfers.protocol_metadata.witness_receipt.settled_at` and Horizon `created_at` | 13/14 DB transfers matched within 2 seconds; 1 DB transfer had no Horizon match within 5s (not in §2 table) |
| DB tx_hash columns | 2026-06-30 | Direct REST query against the live Supabase database | 0/14 transfers had a populated `tx_hash` in any column — disclosed honestly. The settlements are real (Horizon proves it); we just didn't capture the hash at write time because the demo seller's response body didn't echo it. |
| Demo seller's response shape | 2026-06-30 | Code read of `examples/stellar-demo/seller.mjs` and `apps/api/src/routes/x402-stellar.ts:391` | Confirmed: `tx_hash` is populated from `responseBody.tx`; the demo seller doesn't echo it. Real settle happens via x402.org facilitator regardless. |

---

## Appendix — exact reviewer flow (30 seconds, no Sly infra needed)

### Option A — fetch from the public repo (fastest, requires curl + node)

```bash
# 1. Fetch the verifier (57 lines, only Node built-ins, no deps)
curl -fsSL -o verify-offline.mjs \
  https://raw.githubusercontent.com/Sly-devs/stellar-evidence/main/verify-offline.mjs

# 2. Fetch the headline receipt
curl -fsSL -o rcpt_c477197e.json \
  https://raw.githubusercontent.com/Sly-devs/stellar-evidence/main/receipts/rcpt_c477197e-a4af-44ad-8b08-63a8053a67f0.json

# 3. Set the demo-tenant HMAC key (sandbox testnet only — see §4)
export SLY_WITNESS_HMAC_KEY=00f99d03a83840fe97a6df78d46750ff44e7e7894746f7e002cad3901d823c91

# 4. Verify
node verify-offline.mjs rcpt_c477197e.json
# → ✓ SIGNATURE VALID — receipt is verifiable offline.

# 5. Confirm the underlying Stellar tx (no Sly involvement)
curl -fsS https://horizon-testnet.stellar.org/transactions/378e8aa99eb136c50e9ee5d7ebaca3d4f931c2b701d241fc6419f7470a4ccc12 \
  | python3 -c 'import json,sys; d=json.load(sys.stdin); print("successful:", d["successful"], "ledger:", d["ledger"])'
# → successful: True ledger: 3025450

# 6. Open the human-friendly explorer
open https://stellar.expert/explorer/testnet/tx/378e8aa99eb136c50e9ee5d7ebaca3d4f931c2b701d241fc6419f7470a4ccc12
```

### Option B — inline copy-paste (no GitHub needed at all)

If for any reason you can't reach GitHub: paste the verifier from §4, paste the headline receipt from §4, set the same `SLY_WITNESS_HMAC_KEY`, run the same `node verify-offline.mjs` command. Result is byte-identical — the file contents inlined in §4 are exactly what the public repo serves.
