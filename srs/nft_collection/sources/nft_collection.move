module nft_collection_addr::nft_collection {
    use aptos_token_objects::aptos_token;
    use aptos_framework::object::{Self};
    use std::string;

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
    fun init_module(deployer: &signer) {
        aptos_token::create_collection(
            deployer,
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
        );
    }

    fun create_token(deployer: &signer) {

        aptos_token::mint_token_object(
            deployer,
            string::utf8(b"Collection Name"),
            string::utf8(b"Collection Description"),
            string::utf8(b"Token Name"),
            string::utf8(b"Collection Uri"),
            vector[],
            vector[],
            vector[],
        );
    }

    #[test(deployer = @nft_collection_addr)]
    fun test_function(deployer: signer) {
        init_module(&deployer);
        create_token(&deployer);
    }
}