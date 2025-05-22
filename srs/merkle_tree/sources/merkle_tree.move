module merkle_tree_addr::merkle_tree {
   use std::vector;
    use aptos_std::aptos_hash;

    const BYTESLENGHTMISMATCH:u64 = 0;


    #[view]
    public fun verify(proof:vector<vector<u8>>, root:vector<u8>, leaf:vector<u8>): bool {
        let computedHash = leaf;
        assert!(vector::length(&root)==32,BYTESLENGHTMISMATCH);
        assert!(vector::length(&leaf)==32,BYTESLENGHTMISMATCH);
        let i = 0;
        while (i < vector::length(&proof)) {
            let proofElement=*vector::borrow_mut(&mut proof, i);
            if (compare_vector(& computedHash,& proofElement)==1) {
                vector::append(&mut computedHash,proofElement);
                computedHash = aptos_hash::keccak256(computedHash)
            }
            else{
                vector::append(&mut proofElement,computedHash);
                computedHash = aptos_hash::keccak256(proofElement)
            };
            i = i+1
        };
        computedHash == root
    }

    fun compare_vector(a:&vector<u8>,b:&vector<u8>):u8{
        let index = 0;
        while(index < vector::length(a)){
            if(*vector::borrow(a,index) > *vector::borrow(b,index)){
                return 0
            };
            if(*vector::borrow(a,index) < *vector::borrow(b,index)){
                return 1
            };
            index = index +1;
        };
        1
    }
 
}