#!/usr/bin/env node

/**
 * Fortifier Deployment Script
 * Uses @stacks/transactions to deploy Clarity 4 contracts to Stacks
 */

import * as transactions from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { generateWallet } from '@stacks/wallet-sdk';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Only deploy circuit-breaker to stay under 0.5 STX limit
const CONTRACTS = [
  'circuit-breaker'
];

async function deployContract(contractName, network, privateKey, isMainnet) {
  const contractPath = join(__dirname, '..', 'contracts', `${contractName}.clar`);
  const contractCode = readFileSync(contractPath, 'utf8');
  
  const addressVersion = isMainnet 
    ? transactions.AddressVersion.MainnetSingleSig 
    : transactions.AddressVersion.TestnetSingleSig;
  const address = transactions.getAddressFromPrivateKey(privateKey, addressVersion);
  const contractAddress = address.split('.')[0];
  
  console.log(`\n📦 Deploying ${contractName}...`);
  console.log(`   Address: ${address}`);
  
  try {
    // Get nonce
    const account = await transactions.getAccountNonce({
      address,
      network
    });
    
    const txOptions = {
      contractName,
      codeBody: contractCode,
      senderKey: privateKey,
      network,
      anchorMode: transactions.AnchorMode.Any,
      postConditionMode: transactions.PostConditionMode.Allow,
      fee: 10000,
      nonce: account.nonce,
    };

    const transaction = await transactions.makeContractDeploy(txOptions);
    console.log(`   ✅ Transaction created: ${transaction.txid()}`);
    
    const broadcastResponse = await transactions.broadcastTransaction(transaction, network);
    
    if (broadcastResponse.error) {
      console.error(`   ❌ Error: ${broadcastResponse.error}`);
      if (broadcastResponse.reason) {
        console.error(`   Reason: ${broadcastResponse.reason}`);
      }
      return null;
    }
    
    console.log(`   ✅ Broadcast successful!`);
    console.log(`   📡 TX ID: ${broadcastResponse.txid}`);
    const chainParam = network.chainId === transactions.ChainID.Testnet ? 'testnet' : 'mainnet';
    console.log(`   🔗 Explorer: https://explorer.stacks.co/txid/${broadcastResponse.txid}?chain=${chainParam}`);
    
    return {
      contractName,
      txid: broadcastResponse.txid,
      address: `${contractAddress}.${contractName}`
    };
  } catch (error) {
    console.error(`   ❌ Deployment failed: ${error.message}`);
    if (error.stack) {
      console.error(`   Stack: ${error.stack}`);
    }
    return null;
  }
}

async function main() {
  const networkType = process.argv[2] || 'testnet';
  
  if (!['testnet', 'mainnet'].includes(networkType)) {
    console.error('Usage: node deploy.js [testnet|mainnet]');
    process.exit(1);
  }
  
  const isMainnet = networkType === 'mainnet';
  
  // Create network configuration
  const network = isMainnet
    ? new StacksMainnet({ url: 'https://api.hiro.so' })
    : new StacksTestnet({ url: 'https://api.testnet.hiro.so' });
  
  // Get private key from environment or mnemonic
  let privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  
  // If no private key, try to get from mnemonic
  if (!privateKey) {
    const mnemonic = process.env.DEPLOYER_MNEMONIC;
    if (mnemonic) {
      try {
        console.log('🔑 Deriving private key from mnemonic...');
        const wallet = await generateWallet({ secretKey: mnemonic, password: '' });
        // Get the first account's private key
        const account = wallet.accounts[0];
        privateKey = account.stxPrivateKey;
        console.log(`   ✅ Derived address: ${account.address}`);
      } catch (error) {
        console.error('❌ Failed to derive private key from mnemonic:', error.message);
        process.exit(1);
      }
    }
  }
  
  if (!privateKey) {
    console.error('❌ DEPLOYER_PRIVATE_KEY or DEPLOYER_MNEMONIC environment variable not set');
    console.error('   Set it with: export DEPLOYER_PRIVATE_KEY=your_private_key');
    console.error('   Or: export DEPLOYER_MNEMONIC="your 24 word mnemonic"');
    console.error('   Or add it to .env file');
    process.exit(1);
  }
  
  console.log(`\n🚀 Fortifier Deployment`);
  console.log(`   Network: ${networkType}`);
  console.log(`   Contracts: ${CONTRACTS.length}`);
  console.log(`   Using @stacks/transactions for deployment\n`);
  
  const results = [];
  
  for (const contract of CONTRACTS) {
    const result = await deployContract(contract, network, privateKey, isMainnet);
    if (result) {
      results.push(result);
    }
    // Wait a bit between deployments
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log(`\n\n📊 Deployment Summary:`);
  console.log(`   ✅ Successful: ${results.length}/${CONTRACTS.length}`);
  
  if (results.length > 0) {
    console.log(`\n📝 Deployed Contracts:`);
    results.forEach(r => {
      console.log(`   • ${r.contractName}: ${r.address}`);
      console.log(`     TX: ${r.txid}`);
    });
  }
  
  if (results.length < CONTRACTS.length) {
    console.log(`\n⚠️  Some contracts failed to deploy. Check errors above.`);
    process.exit(1);
  }
  
  console.log(`\n✨ Deployment complete!\n`);
}

main().catch(console.error);
