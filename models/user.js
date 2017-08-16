const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

let emailLengthChecker = (email) => {
    if (!email) {
        return false;
    }
    if (email.length < 8 || email.length > 40) {
        return false;
    }

    return true;
}

let validEmailChecker = (email) => {
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    return regExp.test(email);
};

const emailValidators = [
    {
        validator: emailLengthChecker, 
        message: 'Email must be at least 8 characters but no more 40'
    }, 
    {
        validator: validEmailChecker,
        message: 'Please, enter a valid e-mail!'
    }
];

let usernameLengthChecker = (username) => {
    if (!username) {
        return false;
    }
    if (username.length < 2 || username.length > 20) {
        return false;
    }

    return true;
};

let validUsername = (username) => {
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    return regExp.test(username);
};

const usernameValidators = [
    {
        validator: usernameLengthChecker,
        message: 'Username must be at least 2 characters but no more 20'
    },
    {
        validator: validUsername,
        message: 'Valid username contains lowercase, uppercase or numbers!'
    }
];

let passwordLengthChecker = (password) => {
    if (!password) {
        return false;
    }
    if (password.length < 8 || password.length > 25) {
        return false;
    }

    return true;
};

let validPassword = (password) => {
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[\d])(?=.*?[\W]).{8,25}$/);
    return regExp.test(password); 
};

const passwordValidators = [
    {
        validator: passwordLengthChecker,
        message: 'Password must be at least 8 characters but no more than 25'
    },
    {
        validator: validPassword,
        message: 'Must have at least one lowercase, special character, and number'
    }
];

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, validate: emailValidators },
    username: { type: String, required: true, unique: true, validate: usernameValidators },
    password: { type: String, required: true, validate: passwordValidators }
});

userSchema.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    bcrypt.hash(this.password, null, null, (err, hash) => {
        if (err) {
            return next(err);
        }

        this.password = hash;
        next();
    });
});

userSchema.methods.comparePassword = (password) => {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);