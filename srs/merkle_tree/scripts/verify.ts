import {
  Aptos,
  AptosConfig,
  InputViewFunctionData,
  Network,
} from "@aptos-labs/ts-sdk";

async function main() {
  const config = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(config);

  const MERKLE_TREE_ADDR =
    "0x84935923d26c0f5d1109ccb056d45d7ae3fc6f1fffcc45bfb0c3503d85fca1f1";

  const payload: InputViewFunctionData = {
    function: `${MERKLE_TREE_ADDR}::merkle_tree::verify`,
    functionArguments: [
      [
        [
          126, 147, 82, 13, 118, 21, 210, 1, 240, 150, 184, 134, 232, 190, 37,
          24, 108, 75, 247, 244, 251, 88, 93, 194, 169, 9, 181, 62, 246, 225,
          86, 242,
        ],
        [
          223, 55, 97, 57, 15, 210, 107, 13, 107, 94, 116, 4, 208, 151, 150,
          152, 29, 233, 222, 63, 135, 169, 26, 0, 91, 28, 183, 221, 34, 34, 101,
          49,
        ],
        [
          174, 248, 248, 58, 128, 87, 30, 215, 73, 239, 128, 113, 107, 106, 245,
          94, 124, 130, 187, 227, 180, 201, 101, 36, 29, 39, 220, 239, 156, 127,
          14, 207,
        ],
      ],
      [
        177, 191, 167, 200, 222, 127, 213, 43, 149, 43, 191, 148, 35, 241, 32,
        167, 10, 155, 169, 53, 195, 119, 59, 211, 17, 220, 191, 15, 203, 152,
        140, 239,
      ],
    ],
  };

  const response = await aptos.view({ payload });

  console.log(response);
}

main().catch(console.error);
