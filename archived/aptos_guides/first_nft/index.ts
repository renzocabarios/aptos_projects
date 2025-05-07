import { Account, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

(async () => {
  const APTOS_NETWORK = Network.DEVNET;
  const config = new AptosConfig({ network: APTOS_NETWORK });
  const aptos = new Aptos(config);

  const alice = Account.generate();
  const bob = Account.generate();

  const INITIAL_BALANCE = 1000000000;

  console.log("Alice: ", alice.publicKey.toString());
  console.log("Alice: ", alice.accountAddress.toString());

  console.log("Bob: ", bob.publicKey.toString());
  console.log("Bob: ", bob.accountAddress.toString());

  await aptos.fundAccount({
    accountAddress: alice.accountAddress,
    amount: INITIAL_BALANCE,
  });
  await aptos.fundAccount({
    accountAddress: bob.accountAddress,
    amount: INITIAL_BALANCE,
  });

  const createCollectionTransaction = await aptos.createCollectionTransaction({
    creator: alice,
    description: "This is an example collection.",
    name: "Example Collection",
    uri: "aptos.dev",
  });

  const committedTxn = await aptos.signAndSubmitTransaction({
    signer: alice,
    transaction: createCollectionTransaction,
  });
  await aptos.waitForTransaction({ transactionHash: committedTxn.hash });

  const mintTokenTransaction = await aptos.mintDigitalAssetTransaction({
    creator: alice,
    collection: "Example Collection",
    description: "This is an example digital asset.",
    name: "Example Asset",
    uri: "https://aptos.dev/asset.png",
  });

  const mintTxn = await aptos.signAndSubmitTransaction({
    signer: alice,
    transaction: mintTokenTransaction,
  });
  await aptos.waitForTransaction({ transactionHash: mintTxn.hash });

  const aliceDigitalAssets = await aptos.getOwnedDigitalAssets({
    ownerAddress: alice.accountAddress,
  });
  await new Promise((resolve) => setTimeout(resolve, 10000));
  console.log(aliceDigitalAssets);

  //   const digitalAssetAddress = aliceDigitalAssets[0].token_data_id;

  //   const transferTransaction = await aptos.transferDigitalAssetTransaction({
  //     sender: alice,
  //     digitalAssetAddress,
  //     recipient: bob.accountAddress,
  //   });

  //   const transferTxn = await aptos.signAndSubmitTransaction({
  //     signer: alice,
  //     transaction: transferTransaction,
  //   });
  //   await aptos.waitForTransaction({ transactionHash: transferTxn.hash });

  //   const aliceDigitalAssetsAfter = await aptos.getOwnedDigitalAssets({
  //     ownerAddress: alice.accountAddress,
  //   });
  //   const bobDigitalAssetsAfter = await aptos.getOwnedDigitalAssets({
  //     ownerAddress: bob.accountAddress,
  //   });

  //   console.log(
  //     `Alice's digital asset balance: ${aliceDigitalAssetsAfter.length}`
  //   );
  //   console.log(`Bob's digital asset balance: ${bobDigitalAssetsAfter.length}`);
})()
  .then(() => {
    console.log("Success");
  })
  .catch((e) => {
    console.error(e);
  });
