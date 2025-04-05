module tba_exam_addr::tba_exam {

    use aptos_framework::table::{Table};
    use aptos_framework::table;
    use std::signer;
    use aptos_framework::account;
    use aptos_std::string::{String, utf8};

    struct Entries has key {
        users: Table<address, Participant>,
        owner: address,
    }

    struct Participant has store, key, copy, drop {
        full_name: String,
        github: String,
        email: String,
        discord: String
    }


    public entry fun init(account: &signer) {
        let owner = signer::address_of(account);
        let users = table::new<address, Participant>();
        let entries = Entries{users, owner};
        move_to(account,  entries);
    }

    public entry fun add_participant(
        account: &signer,
        exam_address: address,
        full_name: String,
        github: String,
        email: String,
        discord: String
    ) acquires Entries {
        let user_address = signer::address_of(account);
        let entries = borrow_global_mut<Entries>(exam_address);

        assert!(!table::contains(&entries.users, user_address), 102);

        let participant = Participant {
            full_name,
            github,
            email,
            discord,
        };

        table::add(&mut entries.users, user_address, participant);
    }

    #[view]
    public fun get_participant(exam_address: address, user_address: address): Participant acquires Entries {
        let entries = borrow_global<Entries>(exam_address);
        *table::borrow(&entries.users, user_address)
    }

    #[test_only]
    use std::debug;


    #[test(admin = @tba_exam_addr, user = @0x4)]
    fun test_init_and_add_participant(admin: signer, user: signer) acquires Entries {
        init(&admin);

        let exam_address = signer::address_of(&admin);

        add_participant(
            &user,
            exam_address,
            utf8(b"Renzo Cabarios"),
            utf8(b"renzocbrs"),
            utf8(b"renzo@example.com"),
            utf8(b"renzocbrs#1234")
        );

        add_participant(
            &admin,
            exam_address,
            utf8(b"Renzo Cabarios"),
            utf8(b"renzocbrs"),
            utf8(b"renzo@example.com"),
            utf8(b"renzocbrs#1234")
        );

        let stored = get_participant(exam_address, signer::address_of(&user));
        debug::print(&stored.full_name);
        debug::print(&stored.github);
        debug::print(&stored.email);
        debug::print(&stored.discord);

        assert!(stored.full_name == utf8(b"Renzo Cabarios"), 1001);
        assert!(stored.github == utf8(b"renzocbrs"), 1002);
        assert!(stored.email == utf8(b"renzo@example.com"), 1003);
        assert!(stored.discord == utf8(b"renzocbrs#1234"), 1004);
    }
}