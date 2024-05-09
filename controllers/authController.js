const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { isEmail } = require('validator');

// handle errors
const handleErrors = (err) => {
    console.log(err.message,"\n", err.code,"\n", err.keyValue);
    let errors = { name: '', email: '', password: '' };
    
    
    // Unregistered Email
    if (err.message.includes('unregistered email')) {
        errors.email = 'That email is not registered';
    }

    // Invalid Email
    if (err.message.includes('invalid email')) {
        errors.email = 'That email is invalid';
    }
    
    // Empty Email Field
    if (err.message.includes('no email')) {
        errors.email = 'Please enter an email';
    }
    
    // Incorrect password
    if (err.message.includes('mismatched password')) {
        errors.password = 'Incorrect password';
    }

    // Incorrect password
    if (err.message.includes('invalid password')) {
        errors.password = 'Incorrect password';
    }

    // Empty Password Field
    if (err.message.includes('no password')) {
        errors.password = 'Please enter a password';
    }


    // duplicate username error
    if (err.code === 11000 && Object.keys(err.keyValue) == 'name') {
        errors.name = 'That username is already registered';
        return errors;
    }

    // duplicate email error
    if (err.code === 11000 && Object.keys(err.keyValue) == 'email') {
        errors.email = 'That email is already registered';
        return errors;
    }

    // Mongoose validation errors
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message; 
        });
    }

    return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET, {
        expiresIn: maxAge
    });
};

module.exports.signup_get = (req, res) => {
    res.render('signup', {title: 'Synthro Studios – Sign Up'});
}

module.exports.login_get = (req, res) => {
    res.render('login', {title: 'Synthro Studios – Log In'});
}

module.exports.signup_post = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.create({ name, email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
    
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    fieldErrors = '';
    if (email == '') {
        fieldErrors += ' no email '
    }
    else if (!isEmail(email)) {
        fieldErrors += ' invalid email ';
    }
    try {
    if (password == '') {
        fieldErrors += ' no password ';
    }
    else if ( password.legnth < 6 ) {
        fieldErrors += ' invalid password ';
    }
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
    }
    catch (err) {
        err.message += fieldErrors;
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }

}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}