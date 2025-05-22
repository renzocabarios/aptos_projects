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
  // proof:vector<vector<u8>>, root:vector<u8>, leaf:vector<u8>

  const payload: InputViewFunctionData = {
    function: `${MERKLE_TREE_ADDR}::merkle_tree::verify`,
    functionArguments: [
      [
        [
          177, 191, 167, 200, 222, 127, 213, 43, 149, 43, 191, 148, 35, 241, 32,
          167, 10, 155, 169, 53, 195, 119, 59, 211, 17, 220, 191, 15, 203, 152,
          140, 239,
        ],
        [
          120, 125, 247, 91, 206, 137, 90, 222, 195, 255, 212, 143, 139, 40,
          242, 210, 254, 113, 19, 238, 120, 242, 175, 208, 214, 28, 129, 231,
          62, 249, 167, 230,
        ],
      ],
      [
        44, 94, 147, 228, 17, 138, 218, 217, 206, 194, 181, 183, 112, 1, 27,
        158, 186, 184, 55, 227, 26, 16, 207, 179, 231, 116, 156, 16, 106, 83,
        161, 5,
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
