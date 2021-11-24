(async function() {
    let password = "admin";
    let message = (function() {
        let ___switch_result___ = null;
        switch (password.length) {
            case 0:
                ___switch_result___ = "cannot send empty string";
                break;
            case 1:
            case 2:
            case 3:
            case 4:
                ___switch_result___ = "password is too short";
                break;
            case 5:
                ___switch_result___ = "password saved";
                break;
            default:
                ___switch_result___ = "password is too long";
        }
        return ___switch_result___;
    })();
})()