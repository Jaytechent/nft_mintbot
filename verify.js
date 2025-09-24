const { ethers } = require("ethers");
require("dotenv").config();

// Use your RPC URL
const RPC_URL = process.env.RPC_URL || "http://161.97.147.14:8545";

// The transaction hash you got from your bot
const TX_HASH = "0x47fb15d5b27100443cfa7a72ab03786892ab88e43acca45085aa54506eae4979";

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

    // Fetch transaction
    const tx = await provider.getTransaction(TX_HASH);
    if (!tx) {
        console.log("Transaction not found on this RPC.");
        return;
    }
    console.log("Transaction details:", tx);

    // Fetch receipt to check confirmation
    const receipt = await provider.getTransactionReceipt(TX_HASH);
    if (!receipt) {
        console.log("Transaction pending or not yet mined.");
        return;
    }

    console.log("Transaction receipt:", receipt);
    console.log("Status:", receipt.status === 1 ? "Success" : "Failed");
}

main().catch(console.error);
