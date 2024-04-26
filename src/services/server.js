const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const passport = require('passport');
require('./passport');
const PORT = process.env.PORT || 5000;
let tokens = [];
let users = [
    {
        accountId: "1",
        ownerFirstName: "John",
        ownerLastName: "Doe",
        ownerAddress: "123 Main St",
        dateCreated: "2024-04-22",
        paid: true,
    },
    {
        accountId: "2",
        ownerFirstName: "Jane",
        ownerLastName: "Doe",
        ownerAddress: "456 Elm St",
        dateCreated: "2024-05-12",
        paid: false,
    },
    {
        accountId: "3",
        ownerFirstName: "Joe",
        ownerLastName: "Smith",
        ownerAddress: "789 Pine St",
        dateCreated: "2024-06-02",
        paid: true,
    },
];

app.use(cors({
    origin: 'http://localhost:8000',
    methods: ['GET', 'POST', 'PUT'],
    credentials: true
}));
app.use(cookieParser())
app.use(bodyParser.json())
app.use(session({
    secret: 'your_secret_key',
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    },
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

function generateToken() {
    return crypto.randomBytes(20).toString('hex');
}

function isAuthenticated(req, res, next) {
    const token = req.cookies.authToken;
    if (!token || !tokens.find(t => t.token === token)) {
        return res.sendStatus(401);
    }
    return next();
}

app.post('/login',  (req, res, next) => {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return res.status(500).json({message: "Error in authentication."}); }
        if (!user) { return res.status(401).json({message: "Invalid username or password."}); }

        req.logIn(user, function(err) {
            if (err) {
                return res.status(500).json({message: "Could not log in user."});
            }

            const token = generateToken();
            tokens.push({token, user: req.session.user});
            res.cookie('authToken', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, secure: false, sameSite: 'lax' });

            return res.status(200).json({message: "Login successful.", user: user, token: token});
        });

    })(req, res, next);
});

app.get('/logout',(req, res) => {
    req.logout();
    res.redirect('/login');
});

app.get("/account/:accountId", isAuthenticated, (req, res) => {
    const accountId = req.params.accountId;
    const user = users.find(user => user.accountId === accountId);

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: "Account not found." });
    }
});

app.put("/account/:accountId", isAuthenticated, (req, res) => {
    const accountId = req.params.accountId;
    const userIndex = users.findIndex(user => user.accountId === accountId);

    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...req.body };
        res.json(users[userIndex]);
    } else {
        res.status(404).json({ message: "Account not found." });
    }
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = server;
