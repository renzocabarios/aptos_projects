module nft_collection_addr::nft_collection {
    use aptos_framework::object::{Self};
    use aptos_token_objects::aptos_token::{Self};
    use std::string;

    const DESCRIPTION: vector<u8> = b"Move Spiders are awesome";
    const COLLECTION_NAME: vector<u8> = b"Move Spiders";
    const URI: vector<u8> = b"";

    fun init_module(deployer: &signer) {

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
            deployer,
            string::utf8(DESCRIPTION),
            1000,
            string::utf8(COLLECTION_NAME),
            string::utf8(URI),
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            0, 
			100,
      );
    }
    
    fun create_token(creator: &signer, owner: address) {

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
            string::utf8(COLLECTION_NAME),
            string::utf8(COLLECTION_NAME),
            string::utf8(COLLECTION_NAME),
            string::utf8(URI),
            vector[],
            vector[],
            vector[],
      );
      object::transfer(creator, nft, owner);
    }

	#[test(a = @nft_collection_addr)]
	fun test_function(a: signer){
		init_module(&a);
	}
}
