#!/bin/bash
echo "🚀 Deploying circuit-breaker contract to mainnet..."
echo ""
echo "This will deploy: SP2QNSNKR3NRDWNTX0Q7R4T8WGBJ8RE8RA516AKZP.circuit-breaker"
echo "Cost: 0.072390 STX"
echo ""
echo "Press Enter to continue, or Ctrl+C to cancel..."
read
clarinet deployments apply --mainnet
