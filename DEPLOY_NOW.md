# 🚀 Deploy Contract to Mainnet NOW

## The Problem
Your frontend is showing "Not a valid contract" because the contract hasn't been deployed to mainnet yet.

## Quick Fix - Deploy Now

**Run this command in your terminal:**

```bash
cd /Users/mac/Desktop/Talent-protocol/stackss/fortifier
clarinet deployments apply --mainnet
```

**When prompted:**
1. Type `Y` and press Enter to confirm the deployment plan
2. Type `Y` and press Enter again to continue with deployment

## What Will Happen

- ✅ Contract will be deployed to: `SP2QNSNKR3NRDWNTX0Q7R4T8WGBJ8RE8RA516AKZP.circuit-breaker`
- 💰 Cost: 0.072390 STX (from your account balance)
- ⏱️ Duration: ~1 block (~10 minutes to confirm)
- 📡 Transaction ID will be shown after deployment

## After Deployment

1. **Wait for confirmation** (~10 minutes)
2. **Refresh your browser** (the frontend page)
3. **Try the contract call again** - the "Not a valid contract" error should be gone!

## Verify Deployment

After deployment, verify it worked:

```bash
cd frontend
npm run verify
```

Or check on explorer:
https://explorer.stacks.co/?chain=mainnet&address=SP2QNSNKR3NRDWNTX0Q7R4T8WGBJ8RE8RA516AKZP

## Troubleshooting

- **"Insufficient balance"**: Make sure your account has at least 0.1 STX
- **"Deployment failed"**: Check your internet connection and try again
- **Still showing "Not a valid contract"**: Wait a few more minutes for the transaction to confirm

