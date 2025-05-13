module create_objects_addr::create_objects {
    use std::signer;
    use aptos_framework::object;

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct MyStruct has key {
        num: u8
    }

    public fun create_new_object(creator: &signer): address {
        let caller_address = signer::address_of(creator);
        let constructor_ref = object::create_object(caller_address);
        let object_signer = object::generate_signer(&constructor_ref);
        move_to(&object_signer, MyStruct { num: 0 });
        object::address_from_constructor_ref(&constructor_ref)
    }

    #[test_only]
    use std::debug;

    #[test(deployer = @create_objects_addr)]
    fun test_function(deployer: signer) {
        let new_object = create_new_object(&deployer);
        debug::print(&new_object);
    }
 
}