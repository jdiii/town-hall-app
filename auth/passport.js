var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('../config/config');
var User = require('../model/user');

module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        // we dont actually need any user info in the db
        /*User.findById(id, function(err, user) {
            done(err, user);
        });*/
        
        done(null, user);
    });

    passport.use(new GoogleStrategy({

        clientID        : config.googleAuth.clientID,
        clientSecret    : config.googleAuth.clientSecret,
        callbackURL     : config.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {
        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            console.log(profile);
            
            // we authenticate by domain
            if(config.googleAuth.domains.length == 0 || config.googleAuth.domains.indexOf(profile._json.domain) > -1){
                console.log('domain is OK!');
                var newUser = new User({
                    id : profile.id,
                    token : token,
                    name  : profile.displayName
                });
                return done(null,newUser);
            } else {
                console.log('user is outside domain');
                return done(null,false,{message: 'Access Denied'});
            }

            //TODO: replace above dummy codez with implementation of actual users 
            /*User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {

                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser          = new User();

                    // set all of the relevant information
                    newUser.google.id    = profile.id;
                    newUser.google.token = token;
                    newUser.google.name  = profile.displayName;
                    newUser.google.email = profile.emails[0].value; // pull the first email

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });*/
        });

    }));

};
