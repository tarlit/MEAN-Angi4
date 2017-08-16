const User = require('../models/user');

module.exports = (router) => {
    router.post('/register', (req, res) => {
        if (!req.body.email) {
            res.json({ success: false, message: 'You must provide an e-mail'});
        }
        if (!req.body.username) {
             res.json({ success: false, message: 'You must provide an username'});
        }
            if (!req.body.password) {
             res.json({ success: false, message: 'You must provide a password'});
        }
        
        let user = new User({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
        });
        user.save((err) => {
            if (err) {
                // console.log(err);
                if (err.code === 11000) {
                    res.json({ success: false, message: 'Username or e-mail already exists.'});
                } else {
                    if (err.errors) {
                        if (err.errors.email) {
                            res.json({ success: false, message: err.errors.email.message });
                        }
                        if (err.errors.username) {
                            res.json({ success: false, message: err.errors.username.message });
                        }
                        if (err.errors.password) {
                            res.json({ success: false, message: err.errors.password.message });
                        }

                        res.json({ success: false, message: err });
                    } else {
                        res.json({ success: false, message: 'Could not save user. Error: ', err});
                    }
                }
            } else {
                res.json({ success: true, message: 'User registered!'});
            }
        }) 
    });

    return router;
}