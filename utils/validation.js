module.exports.validateRegisterInput = (
    username,
    password,
    confirmPassword,
    email
) => {
    const errors = {}

    if(username.trim() === ''){
        errors.username = 'Username must not be empty!'
    }

    if(email.trim() === ''){
        errors.email = 'Email must not be empty!'
    }else {
        const regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if(!email.match(regEx)){
            errors.email = 'Email must be a valid email address!'
        }
    }

    if(password.trim() === ''){
        errors.password = 'Password must no be empty!'
    } else if(password.trim() !== confirmPassword.trim()){
        errors.confirmPassword = 'Passwords must match';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

module.exports.validateLoginInput = (username, password) => {
    const errors = {}

    if(username.trim() === ''){
        errors.username = 'Username must not be empty!'
    }
    if(password.trim() === ''){
        errors.password = 'Password must not be empty!'
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}