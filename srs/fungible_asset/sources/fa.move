module fungible_asset_addr::fungible_asset {
    use aptos_framework::fungible_asset::{Self, MintRef, TransferRef, BurnRef, Metadata, FungibleStore, FungibleAsset};
    use aptos_framework::primary_fungible_store;

    
    use std::option;
    use std::string;
    use aptos_framework::object::{Self, Object};

    const FA_NAME: vector<u8> = b"My Asset";
    const FA_SYMBOL: vector<u8> = b"MA";

    fun init_module(deployer: &signer) {
        let metadata_constructor_ref = &object::create_named_object(deployer, FA_SYMBOL);
        let max_supply = option::none();

        // constructor_ref: &ConstructorRef,
        // maximum_supply: Option<u128>,
        // name: String,
        // symbol: String,
        // decimals: u8,
        // icon_uri: String,
        // project_uri: String,
        primary_fungible_store::create_primary_store_enabled_fungible_asset(
            metadata_constructor_ref,
            max_supply,
            string::utf8(FA_NAME),
            string::utf8(FA_SYMBOL),
            6,
            string::utf8(b""),
            string::utf8(b""),
        );
    }


    #[view]
    public fun asset_address(): address {
        object::create_object_address(&@fungible_asset_addr, FA_SYMBOL)
    }
    
    #[view]
    public fun asset_metadata(): Object<Metadata> {
        object::address_to_object(asset_address())
    }

    #[test(deployer=@fungible_asset_addr)]
    fun test_function(deployer: signer) {
        init_module(&deployer);
    }
}