const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const crypto = require('crypto');

const PORT = process.env.PORT || 5000;

const users = [];
const tokens = [];

const hardcodedCredentials = {
    username: 'user',
    password: 'password'
};

// Middleware
app.use(cors());
app.use(bodyParser.json())
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: false }));

function generateToken() {
    return crypto.randomBytes(20).toString('hex');
}

function isAuthenticated(req, res, next) {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return res.sendStatus(401);
    }

    const token = authorizationHeader.split(' ')[1];

    if (!token || !tokens.find(t => t.token === token)) {
        return res.sendStatus(401);
    }

    return next();
}

// Routes

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === hardcodedCredentials.username && password === hardcodedCredentials.password) {
        req.session.user = { username };
        const token = generateToken();
        tokens.push({ token, user: req.session.user });
        res.json({ token });
    } else {
        res.sendStatus(401);
    }
});

app.get('/logout', isAuthenticated, (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
});

app.get('/authorize', isAuthenticated, (req, res) => {
    const token = generateToken();
    tokens.push({ token, user: req.session.user });
    res.json({ token });
});

app.get('/account/:accountId', isAuthenticated, (req, res) => {
    const accountId = req.params.accountId;

    const userIndex = users.findIndex(user => user.accountId === accountId);
    if (userIndex !== -1) {
        const userData = users[userIndex];
        res.json(userData);
    } else {
        const newUserData = {
            accountId,
            ownerFirstName: 'John',
            ownerLastName: 'Doe',
            ownerAddress: '123 Main St',
            dateCreated: '2024-04-22',
            paid: true
        };
        users.push(newUserData);
        res.json(newUserData);
    }
});

app.put('/account/:accountId', isAuthenticated, (req, res) => {
    const accountId = req.params.accountId;

    const userIndex = users.findIndex(user => user.accountId === accountId);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...req.body };
        res.json(users[userIndex]);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = server;
