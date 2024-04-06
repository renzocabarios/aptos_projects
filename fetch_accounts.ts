import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const main = async () => {
  const aptosConfig = new AptosConfig({ network: Network.DEVNET });
  const aptos = new Aptos(aptosConfig);

  const modules = await aptos.getAccountModules({
    accountAddress: process.argv[2],
  });

  console.log(modules);
};

main();
