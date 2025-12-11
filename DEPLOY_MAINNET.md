# Mainnet Deployment Instructions

## ✅ Setup Complete

The mainnet deployment is configured and ready to go!

## 📋 Deployment Details

- **Contract**: `circuit-breaker`
- **Cost**: 0.072390 STX (well under 0.5 STX limit)
- **Deployer Address**: `SP2QNSNKR3NRDWNTX0Q7R4T8WGBJ8RE8RA516AKZP`
- **Network**: Stacks Mainnet
- **Duration**: ~1 block (~10 minutes)

## 🚀 Deploy Command

Run this command in your terminal:

```bash
clarinet deployments apply --mainnet
```

When prompted:
1. Type `Y` to confirm the deployment plan
2. Type `Y` again to continue with the deployment

## 📝 Configuration Files

- **`settings/Mainnet.toml`**: Contains your mainnet mnemonic and network configuration
- **`deployments/default.mainnet-plan.yaml`**: Contains the deployment plan

## ⚠️ Important Notes

1. **STX Balance**: Ensure your deployer account (`SP2QNSNKR3NRDWNTX0Q7R4T8WGBJ8RE8RA516AKZP`) has sufficient STX:
   - Deployment cost: 0.072390 STX
   - Recommended: At least 0.1 STX to cover fees

2. **Network**: This will deploy to **Stacks Mainnet** (real STX, real transactions)

3. **Confirmation**: The deployment will be broadcast immediately after confirmation

4. **Transaction ID**: After deployment, you'll receive a transaction ID that you can view on:
   - Stacks Explorer: https://explorer.stacks.co/?chain=mainnet

## 🔍 Verify Deployment

After deployment, verify the contract is live:

```bash
# Check contract on explorer
open "https://explorer.stacks.co/?chain=mainnet&address=SP2QNSNKR3NRDWNTX0Q7R4T8WGBJ8RE8RA516AKZP"
```

## 📦 Contract Address

Once deployed, your contract will be available at:
```
SP2QNSNKR3NRDWNTX0Q7R4T8WGBJ8RE8RA516AKZP.circuit-breaker
```

## 🎯 Next Steps

After successful deployment:
1. Update your frontend `.env` file with the mainnet contract address
2. Update frontend network configuration to use mainnet
3. Test the contract functions on mainnet

