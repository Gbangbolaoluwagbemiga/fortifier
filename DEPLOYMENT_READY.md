# 🚀 Deployment Ready - Manual Steps Required

## Deployment Plan Generated

Your deployment plan has been generated and is ready. The contracts will be deployed to:

**Network:** Stacks Testnet  
**Deployer Address:** `ST2QNSNKR3NRDWNTX0Q7R4T8WGBJ8RE8RA7GKS7WN`  
**Total Cost:** 4.655114 STX  
**Duration:** 1 block

## Contracts to Deploy (in order):

1. **circuit-breaker** - Cost: 931,692 microSTX
2. **fortifier** - Cost: 930,019 microSTX  
3. **guard** - Cost: 931,357 microSTX
4. **quarantine** - Cost: 929,350 microSTX
5. **role-change-guardian** - Cost: 932,696 microSTX

## Deploy Now

Run this command in your terminal (requires interactive terminal):

```bash
clarinet deployment apply -p deployments/default.testnet-plan.yaml
```

When prompted, type `Y` to confirm.

## Alternative: Use Stacks.js

If Clarinet doesn't work, you can deploy using the Stacks.js library directly. The deployment script is ready at `scripts/deploy.js` but needs the correct network configuration.

## Post-Deployment

After deployment, you'll need to:

1. **Note the contract addresses** - They'll be in format: `ST2QNSNKR3NRDWNTX0Q7R4T8WGBJ8RE8RA7GKS7WN.contract-name`

2. **Configure Fortifier** - Call `configure-contracts` on the fortifier contract with all deployed addresses

3. **Set up guardians/approvers** - Add guardians to circuit-breaker and quarantine, add approvers to role-change-guardian

4. **Configure policies** - Set spend caps, rate limits, and allow/deny lists

## Verify Deployment

Check your contracts on the Stacks Explorer:
- Testnet: https://explorer.stacks.co/?chain=testnet
- Search for your deployer address: `ST2QNSNKR3NRDWNTX0Q7R4T8WGBJ8RE8RA7GKS7WN`

## Important Notes

- ⚠️ Ensure you have at least 5 STX in your testnet wallet
- ⚠️ All contracts use Clarity 4 features (deployed as Clarity 1 for compatibility)
- ⚠️ The deployment plan is in `deployments/default.testnet-plan.yaml`
- ⚠️ Your mnemonic is configured in `settings/Testnet.toml` (gitignored)

---

**Ready to deploy!** Run the command above when ready.

