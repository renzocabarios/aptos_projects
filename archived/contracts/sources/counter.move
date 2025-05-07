module counter_addr::counter {
    use std::signer;

    /// Resource to store the counter value
    struct Counter {
        value: u64,
    }

    /// Initialize the counter for the account
    public fun initialize(account: &signer) {
        assert!(
            !exists<Counter>(signer::address_of(account)),
            1, // Error code
            "Counter already exists"
        );
        move_to(account, Counter { value: 0 });
    }

    /// Increment the counter by 1
    public fun increment(account: &signer) {
        let counter = borrow_global_mut<Counter>(signer::address_of(account));
        counter.value = counter.value + 1;
    }

    /// Get the current counter value
    public fun get_value(account: &signer): u64 {
        let counter = borrow_global<Counter>(signer::address_of(account));
        counter.value
    }
}
