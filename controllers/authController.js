const User = require('../models/User')
const passport = require('passport')
function authController() {
    return {
        //  SIGN IN 
        signin(req, resp) {
            resp.render('auth/signin')
        },

        postSignin(req, resp, next) {
            const { username, password } = req.body
            // Validate request 
            if (!username || !password) {
                req.flash('error', 'All fields are required')
                return resp.redirect('/signin')

            }
            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    req.flash('error', "Something went wrong")
                    return next(err)
                }
                if (!user) {
                    req.flash('error', info ? info.message :'Invalid login credentials');
                    return resp.redirect('/signin')
                }
                req.logIn(user, (err) => {
                    if (err) {
                        req.flash('error', 'failed to log in the user')
                        return next(err)
                    }

                    return resp.redirect('/home');
                })
            })(req, resp, next)
        },
        home(req, resp) {
            resp.render('auth/home')
        },
//  SIGNUP
        signup(req, resp) {
            resp.render('auth/signup')
        },
        postSignup(req, resp) {
            const { username, email, password } = req.body;
            console.log(req.body);
            if (!username || !email || !password) {
                req.flash('error', 'All fields are required');
                req.flash('username', username);
                req.flash('email', email);
                return resp.redirect('/');
            }
            // Check if email exists 
            User.exists({ email: email })
                .then((result) => {
                    if (result) {
                        req.flash('error', 'Email already taken');
                        req.flash('username', username);
                        req.flash('email', email);
                        return resp.redirect('/');
                    } else {
                        // Only register the user if the email does not exist
                        User.register({
                            username: req.body.username,
                            email: req.body.email
                        }, req.body.password, function (err) {
                            if (err) {
                                req.flash('error', 'something went to wrong');
                                return resp.redirect('/');
                            } else {
                                return resp.redirect('/signin');
                            }
                        });
                    }
                })
                .catch((err) => {
                    // Handle error
                    console.error(err);
                    req.flash('error', 'An error occurred while checking if the email exists');
                    return resp.redirect('/');
                });
        }
        ,
        
/*        postSignup(req, resp) {
            const { username, email, password } = req.body
            console.log(req.body);
            if (!username || !email || !password) {
                req.flash('error', 'All fields are required')
                req.flash('username', username)
                req.flash('email', email)
                return resp.redirect('/')
            }
            // Check if email exists 
            User.exists({ email: email }, (err, result) => {
                if (result) {
                    req.flash('error', 'Email already taken')
                    req.flash('username', username)
                    req.flash('email', email)
                    return resp.redirect('/')
                }
            })
            User.register({
                username: req.body.username,
                email: req.body.email
            }, req.body.password, function (err) {
                if (err) {
                    req.flash('error', 'something went to wrong')
                    return resp.redirect('/')
                } else {
                    return resp.redirect('/signin')
                }
            });
        },
*/
        //  RESET PASSWORD 
        reset(req, resp) {
            resp.render('auth/reset')
        },

        resetPassword(req, resp) {
            User.findByUsername(req.body.username, (err, user) => {
                if (err) {
                    req.flash('error', 'plz check your password')
                } else {
                    user.changePassword(req.body.oldpassword,
                        req.body.newpassword, function (err) {
                            if (err) {
                                return resp.redirect('/reset');
                            } else {
                                return resp.redirect('/signin')
                            }
                        });
                }
            });
        },
        //  LOGOUT  
        logout(req, resp, next) {
            req.logout(function (err) {
                if (err) {
                    return next(err);
                }
                return resp.redirect('/')
            });

        }


    }
}
module.exports = authController
