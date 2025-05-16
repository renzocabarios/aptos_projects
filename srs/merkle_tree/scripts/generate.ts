import { Account, Serializer } from "@aptos-labs/ts-sdk";
import { createHash } from "crypto";
import keccak256 from "keccak256";

function keccak256HexFromAddress(addressHex: string): string {
  const cleanHex = addressHex.startsWith("0x")
    ? addressHex.slice(2)
    : addressHex;

  const addressBytes = Buffer.from(cleanHex, "hex");

  const hash = keccak256(addressBytes).toString("hex");

  return "0x" + hash;
}

/** Sort and hash two hex strings */
function hashPair(a: string, b: string): string {
  const aBytes = Buffer.from(a.replace(/^0x/, ""), "hex");
  const bBytes = Buffer.from(b.replace(/^0x/, ""), "hex");

  const [left, right] =
    Buffer.compare(aBytes, bBytes) < 0 ? [aBytes, bBytes] : [bBytes, aBytes];

  const combined = Buffer.concat([left, right]);
  return "0x" + keccak256(combined).toString("hex");
}

/** Build a Merkle tree from a list of addresses */
function buildMerkleTree(leaves: string[]): string[][] {
  let level = leaves.map(keccak256HexFromAddress);
  const tree = [level];
  while (level.length > 1) {
    const nextLevel = [];
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = level[i + 1] ?? left;
      nextLevel.push(hashPair(left, right));
    }
    level = nextLevel;
    tree.unshift(level);
  }
  return tree;
}

/** Generate a Merkle proof for a given leaf */
function getProof(tree: string[][], value: string): string[] {
  const hashed = keccak256HexFromAddress(value);
  const leaves = tree[tree.length - 1];
  let index = leaves.indexOf(hashed);
  if (index === -1) throw new Error("Leaf not found");

  const proof: string[] = [];
  for (let i = tree.length - 1; i > 0; i--) {
    const siblingIndex = index ^ 1;
    const level = tree[i];
    if (siblingIndex < level.length) proof.push(level[siblingIndex]);
    index = Math.floor(index / 2);
  }

  return proof;
}

/** Convert hex string to number[] */
function hexToBytes(hex: string): number[] {
  return [...Buffer.from(hex.replace(/^0x/, ""), "hex")];
}

async function main() {
  // 0x292d11a7a7f6e72bd0c8943d3e4a5e4ca38245cda3cb20cb92312cccb91632a2
  const leaves = [
    "0x2a9ed02bf1adb72ce456af9d6fb9601ff5267806f3f1e724f17ea1002e20378f",
    ...Array.from({ length: 4 }, (_, i) =>
      Account.generate().accountAddress.toString()
    ),
  ].sort();

  // const targetLeaf = leaves[0];
  const targetLeaf = leaves[0];

  const tree = buildMerkleTree(leaves);

  console.log(tree);

  const root = tree[0][0];
  const proof = getProof(tree, targetLeaf);
  const leafBytes = hexToBytes(keccak256HexFromAddress(""));

  console.log("Merkle Root (hex):", root);
  console.log("Merkle Root (bytes):", hexToBytes(root));

  console.log("Proof (bytes):", proof.map(hexToBytes));
  console.log(
    "Proof (hex):",
    proof.map((addressHex) => addressHex.slice(2))
  );
  console.log("Leaf (bytes):", leafBytes);

  console.log(
    keccak256HexFromAddress(
      "0x2a9ed02bf1adb72ce456af9d6fb9601ff5267806f3f1e724f17ea1002e20378f"
    )
  );
}

main()
  .then(() => console.log("Done."))
  .catch(console.error);
