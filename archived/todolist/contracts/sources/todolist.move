module todolist_addr::todolist {
    use std::signer;
    use std::vector;
    use aptos_framework::object;
    use aptos_std::string_utils;
    use std::bcs;
    use std::string::String;

    struct UserTodoListCounter has key {
        counter: u64,
    }

    struct TodoList has key, drop {
        owner: address,
        todos: vector<Todo>,
    }

    struct Todo has store, drop, copy {
        content: String,
        completed: bool,
    }

    fun construct_todo_list_object_seed(counter: u64): vector<u8> {
        bcs::to_bytes(&string_utils::format2(&b"{}_{}", @todolist_addr, counter))
    }

    public entry fun create_todo_list(sender: &signer) acquires UserTodoListCounter {
        let sender_address = signer::address_of(sender);
        let counter = if (exists<UserTodoListCounter>(sender_address)) {
            let counter = borrow_global<UserTodoListCounter>(sender_address);
            counter.counter
        } else {
            let counter = UserTodoListCounter { counter: 0 };
            move_to(sender, counter);
            0
        };

        let todo_list_seed = construct_todo_list_object_seed(counter);
        let obj_holds_todo_list = object::create_named_object(
            sender,
            todo_list_seed,
        );
        let obj_signer = object::generate_signer(&obj_holds_todo_list);
        let todo_list = TodoList {
            owner: sender_address,
            todos: vector::empty(),
        };
        move_to(&obj_signer, todo_list);
        let counter = borrow_global_mut<UserTodoListCounter>(sender_address);
        counter.counter = counter.counter + 1;
    }

    const E_TODO_LIST_DOES_NOT_EXIST: u64 = 1;
    const E_TODO_DOES_NOT_EXIST: u64 = 2;
    const E_TODO_ALREADY_COMPLETED: u64 = 3;

    fun assert_user_has_todo_list(user_addr: address) {
        assert!(
            exists<TodoList>(user_addr),
            E_TODO_LIST_DOES_NOT_EXIST
        );
    }

    public entry fun create_todo(sender: &signer, todo_list_idx: u64, content: String) acquires TodoList {
        let sender_address = signer::address_of(sender);

        let todo_list_seed = construct_todo_list_object_seed(todo_list_idx);

        let todo_list_obj_addr = object::create_object_address(
            &sender_address,
            todo_list_seed
        );

        assert_user_has_todo_list(todo_list_obj_addr);
        let todo_list = borrow_global_mut<TodoList>(todo_list_obj_addr);
        let new_todo = Todo {
            content,
            completed: false
        };
        vector::push_back(&mut todo_list.todos, new_todo);
    }

    fun assert_user_has_given_todo(todo_list: &TodoList, todo_id: u64) {
        assert!(
            todo_id < vector::length(&todo_list.todos),
            E_TODO_DOES_NOT_EXIST
        );
    }

    public entry fun complete_todo(sender: &signer, todo_list_idx: u64, todo_idx: u64) acquires TodoList {
        let sender_address = signer::address_of(sender);

        let todo_list_seed = construct_todo_list_object_seed(todo_list_idx);

        let todo_list_obj_addr = object::create_object_address(
            &sender_address,
            todo_list_seed
        );

        assert_user_has_todo_list(todo_list_obj_addr);

        let todo_list = borrow_global_mut<TodoList>(todo_list_obj_addr);

        assert_user_has_given_todo(todo_list, todo_idx);
        let todo_record = vector::borrow_mut(&mut todo_list.todos, todo_idx);
        assert!(todo_record.completed == false, E_TODO_ALREADY_COMPLETED);
        todo_record.completed = true;
    }

    #[view]
    public fun get_todo_list_counter(sender: address): u64 acquires UserTodoListCounter {
        if (exists<UserTodoListCounter>(sender)) {
            let counter = borrow_global<UserTodoListCounter>(sender);
            counter.counter
        } else {
            0
        }
    }

    #[view]
    public fun get_todo_list_obj_addr(sender: address, todo_list_idx: u64): address {
        let todo_list_seed = construct_todo_list_object_seed(todo_list_idx);
        object::create_object_address(&sender, todo_list_seed)
    }

    #[view]
    public fun has_todo_list(sender: address, todo_list_idx: u64): bool {
        let todo_list_obj_addr = get_todo_list_obj_addr(sender, todo_list_idx);
        exists<TodoList>(todo_list_obj_addr)
    }

    #[view]
    public fun get_todo_list(sender: address, todo_list_idx: u64): (address, u64) acquires TodoList {
        let todo_list_obj_addr = get_todo_list_obj_addr(sender, todo_list_idx);
        assert_user_has_todo_list(todo_list_obj_addr);
        let todo_list = borrow_global<TodoList>(todo_list_obj_addr);
        (todo_list.owner, vector::length(&todo_list.todos))
    }

    #[view]
    public fun get_todo_list_by_todo_list_obj_addr(todo_list_obj_addr: address): (address, u64) acquires TodoList {
        let todo_list = borrow_global<TodoList>(todo_list_obj_addr);
        (todo_list.owner, vector::length(&todo_list.todos))
    }

    #[view]
    public fun get_todo(sender: address, todo_list_idx: u64, todo_idx: u64): (String, bool) acquires TodoList {
        let todo_list_obj_addr = get_todo_list_obj_addr(sender, todo_list_idx);
        assert_user_has_todo_list(todo_list_obj_addr);
        let todo_list = borrow_global<TodoList>(todo_list_obj_addr);
        assert!(todo_idx < vector::length(&todo_list.todos), E_TODO_DOES_NOT_EXIST);
        let todo_record = vector::borrow(&todo_list.todos, todo_idx);
        (todo_record.content, todo_record.completed)
    }
}