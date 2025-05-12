module nft_launchpad_addr::nft_launchpad {
    use std::string;
    use aptos_token_objects::aptos_token::{Self};
    use aptos_framework::object::{Self, ExtendRef};
    use std::signer;

    struct CollectionCreator has key {
        extend_ref: ExtendRef
    }

    fun init_module(deployer: &signer) {

        let creator_constructor_ref = &object::create_object(@nft_launchpad_addr);
        let extend_ref = object::generate_extend_ref(creator_constructor_ref);

        move_to(deployer, CollectionCreator {
            extend_ref
        });

        let creator_signer = &object::generate_signer(creator_constructor_ref);
        // creator: &signer,
        // description: String,
        // max_supply: u64,
        // name: String,
        // uri: String,
        // mutable_description: bool,
        // mutable_royalty: bool,
        // mutable_uri: bool,
        // mutable_token_description: bool,
        // mutable_token_name: bool,
        // mutable_token_properties: bool,
        // mutable_token_uri: bool,
        // tokens_burnable_by_creator: bool,
        // tokens_freezable_by_creator: bool,
        // royalty_numerator: u64,
        // royalty_denominator: u64,
        aptos_token::create_collection(
            creator_signer,
            string::utf8(b"Collection Description"),
            1000,
            string::utf8(b"Collection Name"),
            string::utf8(b"Collection Uri"),
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            5,
            100
        )
    }

    public entry fun create_token(minter: &signer) acquires CollectionCreator {
        let creator_extend_ref = &borrow_global<CollectionCreator>(@nft_launchpad_addr).extend_ref;
        let creator = &object::generate_signer_for_extending(creator_extend_ref);


        // creator: &signer,
        // collection: String,
        // description: String,
        // name: String,
        // uri: String,
        // property_keys: vector<String>,
        // property_types: vector<String>,
        // property_values: vector<vector<u8>>,
        let nft = aptos_token::mint_token_object(
            creator,
            string::utf8(b"Collection Name"),
            string::utf8(b"Collection Description"),
            string::utf8(b"Token Name"),
            string::utf8(b"Collectiong Uri"),
            vector[],
            vector[],
            vector[],
        );

        let minter_addr = signer::address_of(minter);

        object::transfer(creator, nft, minter_addr);
    }

    #[test(deployer = @nft_launchpad_addr, minter = @0x123)]
    fun test_function(deployer: signer, minter: signer) acquires CollectionCreator {
        init_module(&deployer);
        create_token(&minter);
    }


}