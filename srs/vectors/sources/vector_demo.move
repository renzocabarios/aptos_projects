module vector_demo_addr::vector_demo {
    use std::string::{Self, String};
    use std::vector;

    struct Database has key {
        users: vector<String>
    }

    fun init_module(deployer: &signer) {
        move_to(deployer, Database {
            users: vector[]
        });
    }

    public entry fun push_users(user: String) acquires Database {
        let database = borrow_global_mut<Database>(@vector_demo_addr);

        vector::push_back(&mut database.users, user);
    } 

    public entry fun pop_users() acquires Database {
        let database = borrow_global_mut<Database>(@vector_demo_addr);
        vector::pop_back(&mut database.users);
    } 

    #[test(deployer = @vector_demo_addr)]
    fun test_function(deployer: signer) acquires Database {
        init_module(&deployer);

        push_users(string::utf8(b"John"));
        pop_users();
    }
}