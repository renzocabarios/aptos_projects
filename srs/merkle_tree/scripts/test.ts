import {
  Account,
  Aptos,
  AptosConfig,
  InputViewFunctionData,
  Network,
} from "@aptos-labs/ts-sdk";
import { keccak_256 } from "@noble/hashes/sha3";
// Converts a hex string to Uint8Array
function hexToBytes(hex: string): Uint8Array {
  return new Uint8Array(
    hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );
}

// Converts Uint8Array to hex string
function bytesToHex(bytes: Uint8Array): string {
  return [...bytes].map((x) => x.toString(16).padStart(2, "0")).join("");
}

// Leaf hash (same as keccak256 of address/data)
function hashLeaf(data: string): Uint8Array {
  return keccak_256(hexToBytes(data.replace(/^0x/, "")));
}
function hashPair(a: Uint8Array, b: Uint8Array): Uint8Array {
  const [first, second] = compareVectors(a, b) ? [a, b] : [b, a];
  const combined = new Uint8Array([...first, ...second]);
  return keccak_256(combined);
}
function compareVectors(a: Uint8Array, b: Uint8Array): boolean {
  for (let i = 0; i < a.length; i++) {
    if (a[i] > b[i]) return false;
    if (a[i] < b[i]) return true;
  }
  return true; // if equal
}
// Build Merkle Tree from leaves
function buildMerkleTree(leaves: Uint8Array[]): Uint8Array[][] {
  const tree: Uint8Array[][] = [leaves];

  while (tree[tree.length - 1].length > 1) {
    const layer = tree[tree.length - 1];
    const nextLayer: Uint8Array[] = [];

    for (let i = 0; i < layer.length; i += 2) {
      const left = layer[i];
      const right = i + 1 < layer.length ? layer[i + 1] : left; // duplicate if odd
      nextLayer.push(hashPair(left, right));
    }

    tree.push(nextLayer);
  }

  return tree;
}

// Generate Merkle Proof for a leaf index
function getMerkleProof(tree: Uint8Array[][], index: number): Uint8Array[] {
  const proof: Uint8Array[] = [];

  for (let layer = 0; layer < tree.length - 1; layer++) {
    const layerNodes = tree[layer];
    const isRight = index % 2;
    const siblingIndex = isRight ? index - 1 : index + 1;

    if (siblingIndex < layerNodes.length) {
      proof.push(layerNodes[siblingIndex]);
    }

    index = Math.floor(index / 2);
  }

  return proof;
}

function formatByteArray(bytes: Uint8Array): string {
  return `[${[...bytes].join(", ")}]`;
}

async function main() {
  const config = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(config);

  const MERKLE_TREE_ADDR =
    "0x66c47e01a2ac3adf3adc6fae316dace258ebdd5e387287fbf9ecf515b8f7b87e";

  const walletAddresses = [
    "0x2a9ed02bf1adb72ce456af9d6fb9601ff5267806f3f1e724f17ea1002e20378f",
    ...Array.from({ length: 100000 }, (_, i) =>
      Account.generate().accountAddress.toString()
    ),
  ];

  console.log(walletAddresses);

  const leaves = walletAddresses.map(hashLeaf);
  const tree = buildMerkleTree(leaves);
  const root = tree[tree.length - 1][0];

  // Let's test for the second address
  const index = 0;
  // const leaf = leaves[index];
  const leaf = hashLeaf(
    "0x2a9ed02bf1adb72ce456af9d6fb9601ff5267806f3f1e724f17ea1002e20378f"
  );

  const proof = getMerkleProof(tree, index);

  // Print results for Move testing
  console.log("\nRoot:");
  console.log(Array.from(root)); // type: number[]

  console.log("\nLeaf:");
  console.log(Array.from(leaf)); // type: number[]

  console.log("\nProof:");
  console.log(proof.map((p) => Array.from(p)));

  const payload: InputViewFunctionData = {
    function: `${MERKLE_TREE_ADDR}::merkle_tree::verify`,
    functionArguments: [
      proof.map((p) => Array.from(p)),
      Array.from(root),
      Array.from(leaf),
    ],
  };

  const response = await aptos.view({ payload });

  console.log(response);
}

main().catch(console.error);
