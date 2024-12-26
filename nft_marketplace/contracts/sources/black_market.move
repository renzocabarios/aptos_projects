module black_market::black_market {
    use 0x1::signer;
    use 0x1::vector;
    use 0x1::coin;
    use 0x1::aptos_coin;

    struct NFT has store, key {
        id: u64,
        owner: address,
        name: vector<u8>,
        description: vector<u8>,
        uri: vector<u8>,
        price: u64,
        for_sale: bool,
        rarity: u8  
    }

    struct Marketplace has key {
        nfts: vector<NFT>
    }

    const MARKETPLACE_FEE_PERCENT: u64 = 2; 

    struct ListedNFT has copy, drop {
        id: u64,
        price: u64,
        rarity: u8
    }

    public entry fun initialize(account: &signer) {
        let marketplace = Marketplace {
            nfts: vector::empty<NFT>()
        };
        move_to(account, marketplace);
    }


    public entry fun mint_nft(account: &signer, name: vector<u8>, description: vector<u8>, uri: vector<u8>, rarity: u8) acquires Marketplace {
        let marketplace = borrow_global_mut<Marketplace>(signer::address_of(account));
        let nft_id = vector::length(&marketplace.nfts);

        let new_nft = NFT {
            id: nft_id,
            owner: signer::address_of(account),
            name,
            description,
            uri,
            price: 0,
            for_sale: false,
            rarity
        };

        vector::push_back(&mut marketplace.nfts, new_nft);
    }
    
    public entry fun list_for_sale(account: &signer, marketplace_addr: address, nft_id: u64, price: u64) acquires Marketplace {
        let marketplace = borrow_global_mut<Marketplace>(marketplace_addr);
        let nft_ref = vector::borrow_mut(&mut marketplace.nfts, nft_id);

        assert!(nft_ref.owner == signer::address_of(account), 100); 
        assert!(!nft_ref.for_sale, 101); 
        assert!(price > 0, 102); 

        nft_ref.for_sale = true;
        nft_ref.price = price;
    }  

    public entry fun delist(account: &signer, marketplace_addr: address, nft_id: u64) acquires Marketplace {
        let marketplace = borrow_global_mut<Marketplace>(marketplace_addr);
        let nft_ref = vector::borrow_mut(&mut marketplace.nfts, nft_id);

        assert!(nft_ref.owner == signer::address_of(account), 100); 
        assert!(nft_ref.for_sale, 101); 

        nft_ref.for_sale = false;
        nft_ref.price = 0;
    }  

    public entry fun transfer(account: &signer, marketplace_addr: address, nft_id: u64, user: address) acquires Marketplace {
        let marketplace = borrow_global_mut<Marketplace>(marketplace_addr);
        let nft_ref = vector::borrow_mut(&mut marketplace.nfts, nft_id);

        assert!(nft_ref.owner == signer::address_of(account), 100); 

        // Transfer ownership
        nft_ref.owner = user;
        nft_ref.for_sale = false;
        nft_ref.price = 0;
    }  


    #[view]
    public fun get_all_nfts_for_owner(marketplace_addr: address, owner_addr: address, limit: u64, offset: u64): vector<u64> acquires Marketplace {
        let marketplace = borrow_global<Marketplace>(marketplace_addr);
        let nft_ids = vector::empty<u64>();

        let nfts_len = vector::length(&marketplace.nfts);
        let end = min(offset + limit, nfts_len);
        let mut_i = offset;
        while (mut_i < end) {
            let nft = vector::borrow(&marketplace.nfts, mut_i);
            if (nft.owner == owner_addr) {
                vector::push_back(&mut nft_ids, nft.id);
            };
            mut_i = mut_i + 1;
        };

        nft_ids
    }

    #[view]
    public fun get_nft_details(marketplace_addr: address, nft_id: u64): (u64, address, vector<u8>, vector<u8>, vector<u8>, u64, bool, u8) acquires Marketplace {
        let marketplace = borrow_global<Marketplace>(marketplace_addr);
        let nft = vector::borrow(&marketplace.nfts, nft_id);

        (nft.id, nft.owner, nft.name, nft.description, nft.uri, nft.price, nft.for_sale, nft.rarity)
    }

    public entry fun set_price(account: &signer, marketplace_addr: address, nft_id: u64, price: u64) acquires Marketplace {
        let marketplace = borrow_global_mut<Marketplace>(marketplace_addr);
        let nft_ref = vector::borrow_mut(&mut marketplace.nfts, nft_id);

        assert!(nft_ref.owner == signer::address_of(account), 200); 
        assert!(price > 0, 201); // Invalid price

        nft_ref.price = price;
    }    

    public entry fun purchase_nft(account: &signer, marketplace_addr: address, nft_id: u64, payment: u64) acquires Marketplace {
        let marketplace = borrow_global_mut<Marketplace>(marketplace_addr);
        let nft_ref = vector::borrow_mut(&mut marketplace.nfts, nft_id);

        assert!(nft_ref.for_sale, 400); // NFT is not for sale
        assert!(payment >= nft_ref.price, 401); // Insufficient payment

        // Calculate marketplace fee
        let fee = (nft_ref.price * MARKETPLACE_FEE_PERCENT) / 100;
        let seller_revenue = payment - fee;

        // Transfer payment to the seller and fee to the marketplace
        coin::transfer<aptos_coin::AptosCoin>(account, marketplace_addr, seller_revenue);
        coin::transfer<aptos_coin::AptosCoin>(account, signer::address_of(account), fee);

        // Transfer ownership
        nft_ref.owner = signer::address_of(account);
        nft_ref.for_sale = false;
        nft_ref.price = 0;
    }

    public entry fun transfer_ownership(account: &signer, marketplace_addr: address, nft_id: u64, new_owner: address) acquires Marketplace {
        let marketplace = borrow_global_mut<Marketplace>(marketplace_addr);
        let nft_ref = vector::borrow_mut(&mut marketplace.nfts, nft_id);

        assert!(nft_ref.owner == signer::address_of(account), 300); 
        assert!(nft_ref.owner != new_owner, 301); 

        nft_ref.owner = new_owner;
        nft_ref.for_sale = false;
        nft_ref.price = 0;
    }

    public fun get_all_nfts_for_sale(marketplace_addr: address, limit: u64, offset: u64): vector<ListedNFT> acquires Marketplace {
        let marketplace = borrow_global<Marketplace>(marketplace_addr);
        let nfts_for_sale = vector::empty<ListedNFT>();

        let nfts_len = vector::length(&marketplace.nfts);
        let end = min(offset + limit, nfts_len);
        let mut_i = offset;
        while (mut_i < end) {
            let nft = vector::borrow(&marketplace.nfts, mut_i);
            if (nft.for_sale) {
                let listed_nft = ListedNFT { id: nft.id, price: nft.price, rarity: nft.rarity };
                vector::push_back(&mut nfts_for_sale, listed_nft);
            };
            mut_i = mut_i + 1;
        };

        nfts_for_sale
    }


    #[view]
    public fun get_all_for_sale(marketplace_addr: address, limit: u64, offset: u64): vector<u64> acquires Marketplace {
        let marketplace = borrow_global<Marketplace>(marketplace_addr);
        let nfts_for_sale = vector::empty<u64>();

        let nfts_len = vector::length(&marketplace.nfts);
        let end = min(offset + limit, nfts_len);
        let mut_i = offset;
        while (mut_i < end) {
            let nft = vector::borrow(&marketplace.nfts, mut_i);
            if (nft.for_sale) {
                vector::push_back(&mut nfts_for_sale, nft.id);
            };
            mut_i = mut_i + 1;
        };

        nfts_for_sale
    }

    public fun min(a: u64, b: u64): u64 {
        if (a < b) { a } else { b }
    }
}