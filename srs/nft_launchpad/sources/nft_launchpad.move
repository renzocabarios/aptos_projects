module nft_launchpad_addr::nft_launchpad {
    use aptos_framework::object::{Self, Object, ExtendRef};
    use aptos_token_objects::aptos_token::{Self, AptosToken};
    use std::string;

    const DESCRIPTION: vector<u8> = b"Move Spiders are awesome";
    const COLLECTION_NAME: vector<u8> = b"Move Spiders";
    const URI: vector<u8> = b"";

    struct NftCollectionCreator has key {
        extend_ref: ExtendRef
    }

    fun init_module(deployer: &signer){
        let creator_constructor_ref = &object::create_object(@nft_launchpad_addr);
        let extend_ref = object::generate_extend_ref(creator_constructor_ref);
        move_to(deployer, NftCollectionCreator { extend_ref });

        let creator_signer = &object::generate_signer(creator_constructor_ref);

        aptos_token::create_collection(
            creator_signer,
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

    fun create_token(owner: address) acquires NftCollectionCreator {
        let creator_extend_ref = &borrow_global<NftCollectionCreator>(@nft_launchpad_addr).extend_ref;
        let creator = &object::generate_signer_for_extending(creator_extend_ref);
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

    #[test_only]
    use std::signer;

    #[test(deployer = @nft_launchpad_addr, minter = @0x1)]
    fun test_function(deployer: signer, minter: signer)  acquires NftCollectionCreator {
        init_module(&deployer);

        create_token(@nft_launchpad_addr);

        let minter_address = signer::address_of(&minter);
        create_token(minter_address);
    }
}