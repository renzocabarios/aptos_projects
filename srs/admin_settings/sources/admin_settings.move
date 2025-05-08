module admin_settings_addr::admin_settings {

    struct AdminSettings has key {
        transaction_fee: u64
    }

    fun init_module(user_signer:  &signer) {
        move_to(user_signer, AdminSettings{
            transaction_fee: 100
        })
    }
}