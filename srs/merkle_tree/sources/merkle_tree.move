module merkle_tree_addr::merkle_tree {
    
    use std::vector;
    use std::string::{Self, String};
    use std::hash;
    use std::signer;
    use std::bcs;
    use aptos_std::math64;
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_std::aptos_hash;

    struct Whitelist has key {
        root: vector<u8>
    }

    fun init_module(deployer: &signer) {
        move_to(deployer, Whitelist {
            root: vector[]
        })
    }

    public entry fun update_root(root: vector<u8>) acquires Whitelist {
        let whitelist = borrow_global_mut<Whitelist>(@merkle_tree_addr);
        whitelist.root = root;
    }

    // acquires Root,Check
    #[view]
    public fun verify(
        account: address, 
        proofs: vector<vector<u8>>,
        _leaf: vector<u8>
    ): bool acquires Whitelist { 
        let account_addr = account;
        let whitelist = borrow_global<Whitelist>(@merkle_tree_addr);
        let addr_byte = bcs::to_bytes<address>(&account_addr);
        vector::append(&mut addr_byte, _leaf);
        let leaf = aptos_hash::keccak256(addr_byte);
        let is_valid = verify_merkle(leaf, proofs, whitelist.root);
        is_valid
    }

    fun verify_merkle(
        leaf: vector<u8>,
        proofs: vector<vector<u8>>,
        root: vector<u8>,
    ): bool  {
        let computedHash = &leaf;

        let i = 0u64; 
        let proofs_length = vector::length(&proofs);
        while (i < proofs_length) {
        let proofElement = vector::borrow(&proofs, i);

        if (compare_vector(*computedHash, *proofElement) <= COMPARE_EQUAL) {
            // Hash(current computed hash + current element of the proof)
            let combined_hash = vector::empty<u8>();
            vector::append(&mut combined_hash, *computedHash);
            vector::append(&mut combined_hash, *proofElement);
            computedHash = &hash::sha2_256(combined_hash);
        } else {
            // Hash(current element of the proof + current computed hash)
            let combined_hash = vector::empty<u8>();
            vector::append(&mut combined_hash, *proofElement);
            vector::append(&mut combined_hash, *computedHash);
            computedHash = &hash::sha2_256(combined_hash);
        };
        i = i + 1;
        };

        // Check if the computed hash (root) is equal to the provided root
        compare_vector(*computedHash, root) == COMPARE_EQUAL
    }

    const COMPARE_EQUAL: u8 = 127u8;

    fun compare_vector(
        x: vector<u8>,
        y: vector<u8>,
    ): u8 {
        let x_length = vector::length(&x);
        let y_length = vector::length(&y);
        let min_length = math64::min(x_length, y_length);

        let i = 0;
        while (i < min_length) {
        let x_i = vector::borrow(&x, i);
        let y_i = vector::borrow(&y, i);
        let compare_result = compare_u8(*x_i, *y_i);
        if (compare_result != COMPARE_EQUAL) {
            return compare_result
        };
        i = i + 1;
        };

        compare_u64(x_length, y_length)
    }

    fun compare_u8(
        x: u8,
        y: u8,
    ): u8 {
        if (x > y) {
        return 255
        };
        if (x < y) {
        return 0
        };
        COMPARE_EQUAL
    }

    fun compare_u64(
        x: u64,
        y: u64,
    ): u8 {
        if (x > y) {
        return 255
        };
        if (x < y) {
        return 0
        };
        COMPARE_EQUAL
    }

    #[test(deployer = @merkle_tree_addr)]
    fun test_function(deployer: signer) {
        init_module(&deployer);
    }
}