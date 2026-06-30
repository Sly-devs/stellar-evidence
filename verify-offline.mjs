/**
 * Offline witness-receipt verifier — RE-DERIVES the HMAC against the canonical
 * JSON encoding and confirms it matches. Network access is not used.
 *
 *   1. Copy a receipt JSON (from sly-governed.mjs output) into /tmp/receipt.json
 *   2. Disable the network: `networksetup -setairportpower en0 off` on Mac
 *      (or `sudo ifconfig en0 down`).
 *   3. Run:  node examples/stellar-demo/verify-offline.mjs /tmp/receipt.json
 *
 * Must match the encoding in apps/api/src/services/x402/witness-receipt.ts.
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
