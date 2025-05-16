import {
  Account,
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  Network,
} from "@aptos-labs/ts-sdk";

async function main() {
  // Initialize the Aptos client
  const config = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(config);

  console.log("Connected to Aptos devnet");

  const MERKLE_TREE_ADDR =
    "0x84935923d26c0f5d1109ccb056d45d7ae3fc6f1fffcc45bfb0c3503d85fca1f1";

  const MY_ACCOUNT = Account.fromPrivateKey({
    privateKey: new Ed25519PrivateKey(
      "ed25519-priv-0x92cc7c947ed051383389939420305df57b79d44c05b99b1ee05523e98b61f521"
    ),
  });

  console.log("=== Addresses ===");
  console.log(`My Address: ${MY_ACCOUNT.accountAddress}`);

  // 1. Build the transaction
  console.log("\n=== 1. Building the transaction ===");
  const transaction = await aptos.transaction.build.simple({
    sender: MY_ACCOUNT.accountAddress,
    data: {
      function: `${MERKLE_TREE_ADDR}::merkle_tree::set_root`,
      functionArguments: [
        [
          246, 225, 104, 192, 251, 32, 48, 220, 74, 96, 187, 98, 1, 15, 23, 183,
          45, 109, 107, 185, 39, 84, 244, 206, 7, 175, 241, 156, 14, 118, 173,
          36,
        ],
      ],
    },
  });

  console.log("\n=== 3. Signing the transaction ===");
  const senderAuthenticator = aptos.transaction.sign({
    signer: MY_ACCOUNT,
    transaction,
  });
  console.log("Transaction signed successfully");

  // 4. Submit the transaction
  console.log("\n=== 4. Submitting the transaction ===");
  const pendingTransaction = await aptos.transaction.submit.simple({
    transaction,
    senderAuthenticator,
  });
  console.log(`Transaction submitted with hash: ${pendingTransaction.hash}`);

  // 5. Wait for the transaction to complete
  console.log("\n=== 5. Waiting for transaction completion ===");
  const txnResult = await aptos.waitForTransaction({
    transactionHash: pendingTransaction.hash,
  });
  console.log(
    `Transaction completed with status: ${
      txnResult.success ? "SUCCESS" : "FAILURE"
    }`
  );
}

main().catch(console.error);
