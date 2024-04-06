import { Account } from "@aptos-labs/ts-sdk";

const main = async () => {
  const account = Account.generate();
  console.log(account);
};

main();
