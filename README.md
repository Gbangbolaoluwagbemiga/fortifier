# Fortifier – On-chain Incident Response & Resilience (Stacks)

Fortifier is a hackathon-grade blueprint for protecting DAO/treasury assets on Stacks. It combines on-chain guardrails (circuit breakers, rate limits, safe-mode switches) with an off-chain watcher that detects anomalies and coordinates human approvals during emergencies.

> Current repo: Clarity/Clarinet scaffolding is set up; `contracts/stream.clar` and `tests/stream.test.ts` are placeholders to evolve into Fortifier guard modules.

## What It Does
- Detect: Watch transfers, role/signer changes, velocity spikes, and new-recipient anomalies.
- Protect: Auto-apply guardrails—time-lock spikes, rate-limit outflows, pause non-essential functions, quarantine suspicious recipients.
- Govern: Escalate to multisig approvers (Safe-like flow) for high-risk actions.
- Coordinate: Emit on-chain alerts, push Discord/Telegram notifications, and keep an incident timeline.
- Recover: Safe-mode playbooks—restore known-good signer sets, revert policy changes, and staged unpausing with caps.
- Prove: On-chain attestations for incidents, responses, and post-mortems (useful for insurance and transparency).

## Architecture (MVP scope)
- On-chain (Clarity):
  - `circuit-breaker` module: pause/unpause, staged unpause with rate limits.
  - `guard` module: policy checks (per-period spend caps, recipient allow/deny lists).
  - `quarantine` registry: mark risky recipients/contracts.
  - `role-change-guardian`: gates updates to signer/policy configs behind delays + multisig approval.
- Off-chain watcher (Node/TypeScript):
  - Listens to mempool + chain events; evaluates heuristics (velocity, new recipient, role changes).
  - Submits protective txs (pause/rate-limit/quarantine) or raises human approval requests.
  - Sends alerts to Discord/Telegram/Webhooks.
- Dashboard (stretch): Incident console to review alerts, approve/deny actions, and track audit trails.

## Repo Structure (current)
```
├── Clarinet.toml                 # Clarinet project config
├── contracts/
│   └── stream.clar               # Placeholder; will host Fortifier guards
├── deployments/
│   └── default.testnet-plan.yaml # Deployment plan
├── settings/
│   ├── Devnet.toml               # Local dev config (gitignored)
│   └── Testnet.toml              # Testnet config (gitignored)
├── tests/
│   └── stream.test.ts            # Placeholder tests
├── package.json                  # JS toolchain (tests, scripts)
└── README.md
```

## Quick Start
### 1) Install Clarinet
```powershell
winget install clarinet
```
Restart your terminal afterward.

### 2) Install dependencies
```bash
npm install
```

### 3) Configure network accounts (gitignored)
Create `settings/Devnet.toml` and/or `settings/Testnet.toml`:
```toml
[network]
name = "testnet"

[accounts.deployer]
mnemonic = "your 24 word mnemonic here"
balance = 100_000_000_000_000
```
Use **test mnemonics only**. Never commit these files.

### 4) Run checks and tests
```bash
clarinet check          # Clarity type/syntax checks
npm test                # Vitest suite (will expand with guard logic)
```

### 5) Deploy to testnet
```bash
clarinet deployments generate --testnet --low-cost
clarinet deployment apply -p deployments/default.testnet-plan.yaml
```
Inspect on the Hiro explorer (testnet).

## Implementation Plan (guide for contributors)
- Phase 1: Replace `stream.clar` with `circuit-breaker` + `guard` primitives (pause, staged unpause, spend caps, allow/deny lists).
- Phase 2: Add role-change guardian (delayed signer/policy updates) and quarantine registry.
- Phase 3: Expand tests in `tests/stream.test.ts` to cover guard paths, pausing, staged unpause, and policy updates.
- Phase 4: Ship a basic watcher script (Node) that listens for anomalies and submits pause/quarantine txs.
- Stretch: Dashboard for approvals + incident log; on-chain attestations for post-mortems.

## Suggested On-chain Interfaces (Clarity sketch)
- Public:
  - `pause` / `unpause` with staged limits
  - `set-rate-limit` (per recipient / global buckets)
  - `quarantine-recipient` / `clear-quarantine`
  - `propose-signer-change` / `execute-signer-change` (time-locked)
- Read-only:
  - `is-paused`, `current-rate-limit`, `is-quarantined`, `pending-signer-change`

## Testing Strategy
- Unit tests (Vitest + Clarinet): policy checks, pause/unpause, rate-limit math, quarantine flows.
- Property-style cases: velocity caps, staged unpause guardrails, signer-change delays.
- Watcher integration (stretch): simulate anomaly events and assert protective tx submission.

## Security & Ops
- Never commit `settings/*.toml` (mnemonics/keys).
- Use separate wallets for devnet/testnet vs. mainnet.
- Treat watcher keys with least privilege (only guard/pause actions).
- Add pausability and staged unpause to reduce blast radius during incidents.

## Pitch Notes (hackathon-ready)
- Problem: Treasuries/DAOs lose funds due to key compromise and unchecked velocity.
- Solution: Fortifier adds automated guardrails and a human-in-the-loop circuit breaker.
- Differentiator: On-chain attestations + staged recovery flow; integrates with existing multisigs.
- Metrics: MTTR for incidents, prevented outflow vs. baseline, clear audit trail for insurers/community.

## License
MIT
