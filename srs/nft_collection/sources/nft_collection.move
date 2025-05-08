module nft_collection_addr::nft_collection {
    use aptos_framework::object::{Self, Object};
    use aptos_token_objects::aptos_token::{Self, AptosToken};
    use std::string;

    const DESCRIPTION: vector<u8> = b"Move Spiders are awesome";
    const COLLECTION_NAME: vector<u8> = b"Move Spiders";
    const URI: vector<u8> = b"";

    fun init_module(cafe_signer: &signer) {
        aptos_token::create_collection(
            cafe_signer,
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
