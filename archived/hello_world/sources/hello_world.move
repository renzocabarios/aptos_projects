module hello_world_addr::HelloWorld {
    use std::string::{String, utf8};

    fun get_message(): String  {
         utf8(b"Hello World")
    }

    #[test_only]
    use std::debug;

    #[test]
    fun test_function() {
        let message = get_message();
        debug::print(&message);
    }
}