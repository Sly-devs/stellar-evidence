# Demo addendum — pairing dashboard views with Stellar Explorer

**Purpose.** The Stellar SDF reviewer noted: *"The demo at getsly.ai/demo shows a functional dashboard but transactions cannot be independently verified on chain."* This addendum specifies the exact dashboard views to screen-record and the matching Stellar Explorer link that should appear beside each. Every view below corresponds to a real, on-chain settlement listed in [`STELLAR_EVIDENCE.md`](./STELLAR_EVIDENCE.md).

The point isn't to re-record the existing identity-stack walkthrough. The point is to **pair every UI claim with a chain-side proof** so the dashboard becomes a verification surface, not just a presentation one.

---

## Recording layout

Recommended: **side-by-side**, 60% dashboard / 40% browser tab with stellar.expert (or Horizon if showing JSON). The Explorer side stays mostly static while the dashboard drives. Crop both panels at 1600×900 so the artifacts read clearly at YouTube/LinkedIn defaults.

Cursor highlights:

- Dashboard side: hover the specific cell carrying the claim (e.g., `agent_chain_proof: "sep10"`)
- Explorer side: the matching row (e.g., the `transfer GBJWOSLO… → GAUJGJMP…` operation line)

Each beat ends with a 2-second hold on both panels visible to let the viewer's eye trace the cross-reference.

---

## Beat 1 — Transfer detail → matching Soroban tx

**Dashboard URL:**
```
/dashboard/transfers/34770f8e-0f4c-4444-bc07-287d2837054e
```

**What's visible in-frame:**
- The "Sly-Governed x402 Settlement" header block
- The **Witness Receipt** panel — receipt id `rcpt_c477197e-…`, signature `1c022de6…`, "Download JSON" + "Copy verify command" buttons in view
- The **Agentic Identity** callout — `stellar-demo-buyer` KYA T2
- Counterparties chips — `GBJWOSLO…` → `GAUJGJMP…` (both clickable)

**Paired Explorer URL:**
```
https://stellar.expert/explorer/testnet/tx/378e8aa99eb136c50e9ee5d7ebaca3d4f931c2b701d241fc6419f7470a4ccc12
```

**What the reviewer sees on the Explorer side:**
- Soroban `invoke_host_function` call → USDC SAC `transfer`
- The two G-addresses from the dashboard chips, identical bytes
- 0.0100000 USDC moved on ledger 3025450 at 2026-06-11T00:58:14Z
- Source account is the x402.org facilitator wallet (the buyer authorizes; facilitator submits — annotate this with a callout box)

**Why this beat answers the reviewer's note:** the receipt id, signature, and counterparty addresses on the dashboard match byte-for-byte to a public chain entity the reviewer can inspect without any Sly login. Two surfaces, one shared identity, both signed.

---

## Beat 2 — Agent KYA tab → matching G-address account

**Dashboard URL:**
```
/dashboard/agents/3f85288f-aefd-a6b9-5acb-b8512d512765
```
(click the **KYA** tab)

**What's visible in-frame:**
- The **Chain Bindings** panel
- The single row: `🌟 stellar testnet` · `✓ SEP-10 PROVEN` badge · `GBJWOS…SUYJ` · `verified 2026-06-10 ...`
- The tooltip on the proof badge (hover at hold time) — "SEP-10 — the agent signed a Sly-issued challenge with the G-address's keypair. Cryptographic proof of key control."

**Paired Explorer URL:**
```
https://stellar.expert/explorer/testnet/account/GBJWOSLOYOZ2TGWLBMDXTJOAC3UP5A4P7AJM4VLWWS5VRTNMJ3JVSUYJ
```

**What the reviewer sees on the Explorer side:**
- The account exists on Stellar testnet
- Holds 19+ USDC + 9999+ XLM
- Recent activity = the same 16 transactions that back the receipts in [`STELLAR_EVIDENCE.md`](./STELLAR_EVIDENCE.md)
- Account creation tx visible at the bottom

**Why this beat answers the reviewer's note:** the dashboard's "✓ SEP-10 PROVEN" badge is not marketing — it claims a verified cryptographic relationship between Sly's record of the agent and a specific G-address. The Explorer side shows that G-address actually exists on chain, holds value, and has a transaction history. The reviewer can click any of those tx hashes and trace it back to a row in [`STELLAR_EVIDENCE.md`](./STELLAR_EVIDENCE.md) §1/§2.

---

## Beat 3 — Allowed Rails chips → receipt rail_selection field

**Dashboard URL:**
```
/dashboard/agents/3f85288f-aefd-a6b9-5acb-b8512d512765
```
(default **Overview** tab)

**What's visible in-frame:**
- The Allowed Rails chips at the top of the header card: `🌟 stellar testnet` + `🔵 base sepolia`
- The header summary card: KYA Tier 2, parent account "Stellar Demo Treasury"

**Paired Explorer artifact:** the **receipt JSON itself**, surfaced beside the dashboard. Recommend a terminal panel or text overlay showing this fragment from [`STELLAR_EVIDENCE.md`](./STELLAR_EVIDENCE.md) §4:

```json
"rail_selection": {
  "chosen": "stellar:testnet",
  "reasons": [
    "picked:fee_sponsored",
    "picked:cheaper_fee",
    "picked:faster_finality"
  ],
  "rejected": []
}
```

**Why this beat answers the reviewer's note:** the dashboard chip "🌟 stellar testnet" is the visual answer; the receipt's `rail_selection.reasons` is the auditable record of *why* it was picked. The reasons land in the HMAC, so they're tamper-evident. This converts the dashboard from a presentation of conclusions into a presentation of *receipts of conclusions*.

---

## Beat 4 — Terminal: offline verification

**Dashboard:** none (this beat is browser-independent — that's the point).

**What's visible in-frame:** a terminal running the exact reviewer flow from [`STELLAR_EVIDENCE.md`](./STELLAR_EVIDENCE.md) §4:

```
$ export SLY_WITNESS_HMAC_KEY=00f99d03a83840fe97a6df78d46750ff44e7e7894746f7e002cad3901d823c91
$ node verify-offline.mjs rcpt_c477197e.json

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

**Paired Explorer URL:** *(optional)* split the right pane to show the original headline `stellar.expert` page from Beat 1 — closes the loop visually: signature valid + on-chain settle confirmed.

**Why this beat answers the reviewer's note:** the receipt's validity does not depend on Sly being online. The verifier is 57 lines, only Node built-ins, and works against any standalone receipt JSON + key. The reviewer doesn't need our infrastructure to trust the artifact — they recompute it themselves.

---

## Optional Beat 5 — Honest disclosure of the latent anchor path

If the recording has runtime budget, add a short beat showing the `/anchor` route's response:

```json
{
  "receipt_id": "rcpt_c477197e-…",
  "backend": "attest-stellar",
  "schema_uid": "witness-stellar-v1",
  "attestation_xdr": "AAAAAgAAAAB…",
  "status": "pending_init",
  "upstream_error": "Storage::MissingValue",
  "blocker": "AttestProtocol contract not initialized on testnet",
  "tracking": "upstream contract init · in progress"
}
```

**Why include this:** the proposal's revision response is more credible if the demo openly shows what's wired-but-latent than if it skips around it. The reviewer sees the same honesty disclosure in [`STELLAR_EVIDENCE.md`](./STELLAR_EVIDENCE.md) §8; this beat makes the disclosure visual.

---

## What this addendum is NOT

- A re-recording — the existing `stellar-identity-stack` walkthrough at `docs/demos/stellar-identity-stack/narration.md` covers the identity-stack thesis. This addendum is a **second**, evidence-first cut that pairs each dashboard claim with on-chain proof.
- A demo of unshipped scope — every dashboard URL above exists today and renders against the same data backing [`STELLAR_EVIDENCE.md`](./STELLAR_EVIDENCE.md).
- A substitute for the proposal's tranche commitments — measurable per-tranche acceptance criteria (N SEP-10 agents, M SDP disbursements, K Allbridge receipts) live in the proposal, not in a video.

## Recording checklist before publishing

- [ ] All 4 dashboard URLs render against the same agent/transfer ids cited in [`STELLAR_EVIDENCE.md`](./STELLAR_EVIDENCE.md)
- [ ] Every paired Explorer URL is verified resolvable on the day of recording (see [`STELLAR_EVIDENCE.md`](./STELLAR_EVIDENCE.md) §10 for the verification one-liner)
- [ ] Terminal beat 4 runs cleanly with the published key — capture an actual `✓ SIGNATURE VALID` line, not a mocked frame
- [ ] No production credentials visible in any frame (.env, browser autofill, etc.)
- [ ] Beats 1, 2, 4 each include a 2s hold on the cross-reference between the two panels
