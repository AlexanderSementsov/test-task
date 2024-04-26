const passport = require('passport'); // add this line
const LocalStrategy = require('passport-local').Strategy;
const hardcodedCredentials = {
    username: 'user',
    password: 'password'
};

passport.use(new LocalStrategy(
    function(username, password, done) {
        if (username === hardcodedCredentials.username && password === hardcodedCredentials.password) {
            return done(null, {
                id: 1,
                accountId: 1231234123,
                ownerFirstName: 'John',
                ownerLastName: 'Doe',
                ownerAddress: '123 Main St',
                dateCreated: '2024-04-22',
                paid: true
            });
        } else {
            return done(null, false, { message: 'Invalid username or password.' });
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(function(username, done) {
    const user = {
        id: 1,
        accountId: 1231234123,
        ownerFirstName: 'John',
        ownerLastName: 'Doe',
        ownerAddress: '123 Main St',
        dateCreated: '2024-04-22',
        paid: true
    };

    if (user !== undefined) {
        done(null, user);
    } else {
        done(null, false);
    }
});