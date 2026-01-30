import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import users from './models/people.js';

dotenv.config();

mongoose.connect('mongodb://localhost/People');
let db = mongoose.connection;

db.once('open', async () => {
    console.log('Connected to the database');
    const collections = await db.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
});

db.on('error', (err) => {
    console.error('Database error:', err);
});

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use(session({
    secret: process.env.secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

server.use((req, res, next) => {
    console.log('Session ID:', req.sessionID);
    console.log('Session data:', req.session);
    next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

server.use(express.static(path.join(__dirname, 'Views')));

server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Views', 'home.html'));
});

server.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'Views', 'signup.html'));
});

server.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'Views', 'login.html'));
});

server.post('/signup', async (req, res) => {
    const { firstName, lastName, username, age, email, password, confirmPassword } = req.body;
    
    console.log('Signup request received:', { firstName, lastName, username, age, email, password: 'xxxx', confirmPassword: 'xxxx' });

    if (!firstName || !lastName || !username || !age || !email || !password || !confirmPassword) {
        console.log('Validation failed: Missing required fields');
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        console.log('Validation failed: Passwords do not match');
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    const parsedAge = parseInt(age);
    if (isNaN(parsedAge)) {
        console.log('Validation failed: Invalid age');
        return res.status(400).json({ error: 'Age must be a valid number' });
    }

    try {
        const newUser = new users({
            firstName,
            lastName,
            username,
            age: parsedAge,
            email,
            password
        });

        await newUser.save();
        console.log('User saved successfully:', { username, email });

        req.session.user = { username, email };
        console.log('Session set:', req.session.user);

        res.status(201).json({
            message: 'Signup successful',
            user: { username, email },
            promptLogin: true
        });
    } catch (err) {
        console.error('Signup error:', err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Email or username already exists' });
        }
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            console.log('Validation errors:', errors);
            return res.status(400).json({ error: errors });
        }
        res.status(500).json({ error: 'Server error during signup: ' + err.message });
    }
});

server.post('/login', async (req, res) => {
    const { email, password, } = req.body;

    if (!email || !password) {
        console.log('Validation failed: Missing email or password');
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await users.findOne({ email , username });
        if (!user) {
            console.log('User not found:', email);
            return res.status(401).json({ error: 'Please sign up before logging in' });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            console.log('Invalid password for:', email);
            return res.status(401).json({ error: 'Verify password' });
        }

        req.session.user = { username: user.username, email: user.email };
        console.log('Session set for login:', req.session.user);

        res.status(200).json({
            message: 'Login successful',
            user: { username: user.username, email: user.email }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error during login: ' + err.message });
    }
});

server.get('/session', (req, res) => {
    console.log('Session check:', req.session);
    if (req.session.user) {
        res.status(200).json({
            message: 'Session active',
            user: req.session.user
        });
    } else {
        res.status(401).json({ error: 'No active session' });
    }
});


server.listen(5000, () => {
    console.log('Server is running on port 5000');
});