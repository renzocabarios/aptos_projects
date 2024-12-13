import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const main = async () => {
  const aptosConfig = new AptosConfig({ network: Network.DEVNET });
  const aptos = new Aptos(aptosConfig);

  console.log(aptos);
};

main();
