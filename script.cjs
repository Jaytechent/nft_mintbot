const { ethers } = require("ethers");
const { FlashbotsBundleProvider } = require("@flashbots/ethers-provider-bundle");
require("dotenv").config();

// === ENV CONFIG ===
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;
console.log("RPC URL:", RPC_URL);

// === CONTRACT CONFIG ===
const CONTRACT_ADDRESS = "0xef978E7fA8F3eF38828946f335AB60ba4955A0d5";

const MINT_PRICE_ETH = "0.02"; // 0.02 ETH per NFT
const QUANTITY = 1;            // Number of NFTs to mint
const MINT_START_TIMESTAMP = 1737753600; // Replace with exact mint start Unix timestamp

// === ABI (Minimal) ===
const ABI = [
  "function mintSeaDrop(address minter, uint256 quantity)"
];

// === PROVIDERS AND SIGNERS ===
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

async function main() {
  console.log("Starting bot...");
  console.log("Wallet Address:", wallet.address);

  // Setup Flashbots
  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    wallet,
    "https://relay.flashbots.net"
  );

  // Calculate total mint cost
  const totalCost = ethers.utils.parseEther(MINT_PRICE_ETH).mul(QUANTITY);

  // Build mint transaction
  const mintTx = await contract.populateTransaction.mintSeaDrop(wallet.address, QUANTITY);

  // Use legacy gas price instead of EIP-1559
  const gasPrice = ethers.utils.parseUnits("150", "gwei"); // aggressive gas for speed

  // Final clean legacy transaction
  const finalTx = {
    to: CONTRACT_ADDRESS,
    data: mintTx.data,
    value: totalCost,
    gasLimit: ethers.BigNumber.from("300000"), // Adjust if needed
    gasPrice, // Legacy gas price for compatibility
    nonce: await provider.getTransactionCount(wallet.address, "pending"),
    chainId: (await provider.getNetwork()).chainId
  };

  console.log("Prepared mint transaction:", finalTx);

  // Countdown loop until mint start
  console.log("Waiting for mint start...");
  while (true) {
    const block = await provider.getBlock("latest");
    if (block.timestamp >= MINT_START_TIMESTAMP) {
      console.log("Mint is live! Sending transaction...");
      break;
    }
    await new Promise(r => setTimeout(r, 500)); // Sleep 0.5 sec
  }

  // Sign transaction before sending
  const signedTx = await wallet.signTransaction(finalTx);

  // Target block to include the transaction
  const targetBlock = (await provider.getBlockNumber()) + 1;

  // Send as Flashbots bundle
  const bundle = [{ signedTransaction: signedTx }];
  const response = await flashbotsProvider.sendBundle(bundle, targetBlock);

  console.log("Bundle submitted:", response);

  // Check status
  const status = await response.wait();
  if (status === 0) {
    console.log("Transaction failed or was not included.");
  } else {
    console.log("Mint transaction confirmed successfully!");
  }
}

main().catch(console.error);
