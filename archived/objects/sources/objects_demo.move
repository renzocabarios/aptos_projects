module object_demo_addr::object_demo {
    use std::signer;
    use aptos_framework::object;
 
    entry fun create_simple_object(caller: &signer) {
        let caller_address = signer::address_of(caller);
        let constructor_ref = object::create_object(caller_address);
    }

    const NAME: vector<u8> = b"MyAwesomeObject";
    entry fun create_named_object(caller: &signer) {
        let caller_address = signer::address_of(caller);
        let constructor_ref = object::create_named_object(caller, NAME);
    }

    entry fun create_sticky_object(caller: &signer) {
        let caller_address = signer::address_of(caller);
        let constructor_ref = object::create_sticky_object(caller_address);
    }

    struct MyStruct has key {
        num: u8
    } 
    
    // Wallet -> OBJECT or PDA in Solana -> object or MyStruct
    entry fun create_object_and_move_to(caller: &signer) {
        let caller_address = signer::address_of(caller);
    
        // Creates the object
        let constructor_ref = object::create_object(caller_address);
    
        // Retrieves a signer for the object
        let object_signer = object::generate_signer(&constructor_ref);
    
        // Moves the MyStruct resource into the object
        move_to(&object_signer, MyStruct { num: 0 });
    }

}