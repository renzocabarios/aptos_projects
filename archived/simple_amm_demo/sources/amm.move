module amm_addr::SimpleAMM {
    use aptos_framework::table::{Table};
    use aptos_framework::table;


    struct Pools has key {
        pools: Table<address, u64>,
    }

    struct LiquidityPool has store, key {
        coin_a: Coin,
        coin_b: Coin,
    }

    struct Coin has store, key {
        value: u64,
        symbol: String,
    }

    use std::debug;
    use std::string::{String, utf8};

    const ID: u64 = 100;


    fun create_coin(symbol: String, value: u64): Coin {
        Coin {symbol, value}
    }

    fun add_to_pool(account: &signer,coin_a: LiquidityPool){
        let pools = borrow_global_mut<Pools>(signer::address_of(account));
        table::add(pools, key, value);
    }

    fun create_liquidity_pool(coin_a: Coin, coin_b: Coin): LiquidityPool {
        LiquidityPool {coin_a, coin_b}
    }

    public entry fun init(account: &signer) {
        let pools = table::new<address, u64>();
        move_to(account, Pools{pools} );
    }

    // public fun get_coin(account: address): &Coin {
    //     borrow_global<Coin>(account)
    // }

    fun set_value(): u64  {
        let value_id: u64 = 200;
        let string_val: String = utf8(b"net2dev");
        let string_byte: vector<u8> = b"This is a byte string";
        debug::print(&value_id);
        debug::print(&string_val);
        debug::print(&utf8(string_byte));
        ID
    }

    #[test_only]
    use std::signer;
    use aptos_framework::account;

    #[test(a = @0x1, b = @0x2)]
    fun test_function(a: signer, b: signer) {

        let test_address = @0xCAFE;
        init(&a);

        let coin_a = create_coin(utf8(b"coin_a"), 100);
        let coin_b = create_coin(utf8(b"coin_b"), 100);
        let liquidity_pool = create_liquidity_pool(coin_a, coin_b);

        
        // let id_value = set_value();
        // debug::print(&id_value);
    }

}