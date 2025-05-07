module apt_game_addr::apt_game {
    use aptos_token_objects::collection;
    use std::option::{Self, Option};
    
    public entry fun create_collection(creator: &signer) {
        let max_supply = 1000;
        let royalty = option::none();
    
        // Maximum supply cannot be changed after collection creation
        collection::create_fixed_collection(
            creator,
            b"My Collection Description",
            max_supply,
            b"My Collection",
            royalty,
            b"https://mycollection.com",
        );
    }
}