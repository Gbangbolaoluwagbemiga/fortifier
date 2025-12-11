#!/bin/bash
echo "🔍 Checking deployment status..."
echo ""
TXID="62d99c3efb7e8a12eb41de1e5f397d62b3"
CONTRACT="SP2QNSNKR3NRDWNTX0Q7R4T8WGBJ8RE8RA516AKZP.circuit-breaker"

echo "Transaction: $TXID"
echo "Contract: $CONTRACT"
echo ""

# Check transaction status
STATUS=$(curl -s "https://api.hiro.so/v2/transactions/$TXID" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('tx_status', 'Unknown'))" 2>/dev/null)

if [ "$STATUS" = "success" ]; then
    echo "✅ Transaction confirmed!"
    echo ""
    echo "Checking if contract exists..."
    CONTRACT_EXISTS=$(curl -s "https://api.hiro.so/v2/contracts/SP2QNSNKR3NRDWNTX0Q7R4T8WGBJ8RE8RA516AKZP/circuit-breaker" 2>&1 | grep -q "tx_id" && echo "yes" || echo "no")
    
    if [ "$CONTRACT_EXISTS" = "yes" ]; then
        echo "✅ Contract is live!"
        echo ""
        echo "You can now refresh your browser and try the contract call again."
    else
        echo "⏳ Contract may still be indexing. Wait a few more minutes."
    fi
else
    echo "⏳ Status: $STATUS"
    echo "Transaction is still pending. Please wait..."
    echo ""
    echo "Check on explorer:"
    echo "https://explorer.stacks.co/txid/$TXID?chain=mainnet"
fi
