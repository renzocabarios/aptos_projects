module collection_creator_addr::collection_creator {
    use aptos_token_objects::collection;
    use aptos_token_objects::royalty;
    use std::option;
    use std::string::{Self};
    use std::signer;
    const COLLECTION_NAME: vector<u8> = b"Hyper Nova Squad";
    const COLLECTION_DESCRIPTION: vector<u8> = b"Just an NFT collection in Aptos";
    const COLLECTION_URI: vector<u8> = b"Ambassador Collection URI";
    const MAX_SUPPLY: u64 = 7000;

    public entry fun create_collection(creator: &signer) {
 
        let description = string::utf8(COLLECTION_DESCRIPTION);
        let name = string::utf8(COLLECTION_NAME);
        let uri = string::utf8(COLLECTION_URI);

        collection::create_fixed_collection(
            creator,
            description,
            MAX_SUPPLY,
            name,
            option::none(),
            uri,
        );
    }

    public entry fun create_collection_with_royalty(creator: &signer) {
        let treasury_addr = signer::address_of(creator);

        let royalties = option::some(royalty::create(
            5, 
            100,
            treasury_addr, 
        ));

        let description = string::utf8(COLLECTION_DESCRIPTION);
        let name = string::utf8(COLLECTION_NAME);
        let uri = string::utf8(COLLECTION_URI);

        collection::create_fixed_collection(
            creator,
            description,
            MAX_SUPPLY,
            name,
            royalties,
            uri,
        );
    }

   

    #[test_only]
    use std::debug;

    #[test(a = @0x1, b = @0x2)]
    fun test_function(a: signer, b: signer)  {
        create_collection(&a);
        create_collection_with_royalty(&a);

        
    }
}