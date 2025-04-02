module counter_addr::counter {

    struct Data has key {
        value: u64,
    }

    public entry fun initialize(account: &signer, val: u64) {
        let data = Data { value: val };
        move_to(account, data);
    }

    public entry fun set_value(account: &signer, val: u64) acquires Data {
        let data = borrow_global_mut<Data>(signer::address_of(account));
        data.value = val;
    }

    public fun get_value(addr: address): u64 acquires Data {
        let data = borrow_global<Data>(addr);
        data.value
    }

    #[test_only]
    use std::debug;
    use std::signer;

    #[test(a = @0x1)]
    fun test_function(a: signer) acquires Data {
        initialize(&a, 0);

        let object_addr = signer::address_of(&a);
        debug::print(&get_value(object_addr));

        set_value(&a, 2);
        debug::print(&get_value(object_addr));
    }
}