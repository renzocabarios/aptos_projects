module resource_creator_addr::resource_creator {

    struct User has key {
        level: u64,
    }

    public entry fun create_user(user: &signer) {
        move_to(user, User {
            level: 0,
        });
    }


    public fun get_user_level(user: address): u64 acquires User {
        let user = borrow_global<User>(user);
        user.level
    }

    #[test_only]
    use std::debug;
    use std::signer;

    #[test(a = @0x1)]
    fun test_create_user(a: signer) acquires User {
        create_user(&a);

        let object_addr = signer::address_of(&a);

        let new_user = get_user_level(object_addr);

        debug::print(&new_user);
    }
}