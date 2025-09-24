# NFT Mint Bot

A simple bot to help mint NFTs from SeaDrop contracts on Ethereum testnets using Flashbots.  

> ⚠️ **Warning:** Use carefully on mainnet. This bot is for educational purposes and may fail on live NFT drops if parameters are incorrect.

---

## Repository

[https://github.com/Jaytechent/nft_mintbot.git](https://github.com/Jaytechent/nft_mintbot.git)

---

## Features

- Mint NFTs automatically when the mint starts.
- Uses Flashbots to submit transactions directly to miners (avoiding public mempool).
- Compatible with Ethereum testnets (e.g., Sepolia).

---

## Prerequisites

- Node.js (v18+ recommended)
- NPM or Yarn
- An Ethereum wallet with private key
- Testnet ETH in your wallet
- RPC URL (Sepolia or other testnet)

---

## Installation

```bash
# Clone the repository
git clone https://github.com/Jaytechent/nft_mintbot.git

# Change directory
cd nft_mintbot

# Install dependencies
npm install

# Setup

Create a .env file in the project root with:

```bash
PRIVATE_KEY=your_wallet_private_key_here
RPC_URL=https://your-testnet-rpc-url


Edit the bot parameters in script.js (or script.cjs):
```bash
const CONTRACT_ADDRESS = "YOUR_SEADROP_CONTRACT_ADDRESS";
const MINT_PRICE_ETH = "0.02"; // Price per NFT
const QUANTITY = 1;            // Number of NFTs to mint
const MINT_START_TIMESTAMP = 1737753600; // Unix timestamp when mint starts

#Usage :

open terminal and run:

```bash

node script.cjs


You should see a screen like this to show that its successfuly.

<img width="942" height="358" alt="image" src="https://github.com/user-attachments/assets/9603a03b-d57f-4483-8972-f811473db5f9" />




#The bot will:

Prepare the mint transaction.

Wait until the mint start time.

Submit the transaction via Flashbots.

Notes

Transactions sent via Flashbots are only mined if included by miners. You do not spend gas if the transaction is not included.

Test carefully on testnets before using mainnet.

NFT ownership only occurs if the transaction is successfully mined.
