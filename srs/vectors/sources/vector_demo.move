module vector_demo_addr::vector_demo {
    use std::vector;
    use std::string::{Self, String};

    struct User has store {
        first_name: String,
        last_name: String,
    }

    struct Database has key {
        users: vector<User>
    }

    fun init_module(user_signer: &signer) {
        move_to(user_signer, Database {
            users: vector[],
        })
    }

    public entry fun add_user(first_name: String, last_name: String) acquires Database {
        let database = borrow_global_mut<Database>(@vector_demo_addr);
        let user = User {
            first_name,
            last_name
        };
        
        vector::push_back(&mut database.users, user);
    }

    #[test(a = @vector_demo_addr)]
    fun test_function(a: signer) acquires Database {
        init_module(&a);
        add_user(string::utf8(b"test"), string::utf8(b"test"));
    }
}