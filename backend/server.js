require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
const port = 5000;
const secretKey = 'your_jwt_secret_key';

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: 'localhost',
    database: 'menuManagement',
    password: process.env.DB_PASSWORD,
    port: process.env.PORT,
});

// Middleware to verify JWT token
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (token) {
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// Middleware to check admin role
const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.sendStatus(403);
    }
    next();
};

// Admin login endpoint
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }

        const admin = result.rows[0];
        if (password !== admin.password) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }

        const token = jwt.sign({ username: admin.username, role: 'admin' }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// User login endpoint
app.post('/api/user/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }

        const user = result.rows[0];
        if (password !== user.password) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }

        const token = jwt.sign({ username: user.username, role: 'user', id: user.id }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// CRUD endpoints for lunch items
app.post('/api/lunch-items', [authenticateJWT, adminOnly], async (req, res) => {
    const { name } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO lunch_item (name) VALUES ($1) RETURNING *',
            [name]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/lunch-items', authenticateJWT, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM lunch_item');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.delete('/api/lunch-items/:id', [authenticateJWT, adminOnly], async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM lunch_item WHERE id = $1', [id]);
        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Endpoint for user to select a lunch item
app.post('/api/user/select-item', authenticateJWT, async (req, res) => {
    const { itemId } = req.body;
    const userId = req.user.id;
    const username = req.user.username;

    try {
        // Check if the item exists
        const itemCheck = await pool.query('SELECT * FROM lunch_item WHERE id = $1', [itemId]);
        if (itemCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Lunch item not found' });
        }

        const itemName = itemCheck.rows[0].name;

        // Insert the user selection into the database
        await pool.query(
            'INSERT INTO user_choices (user_id, username, item_id, item_name) VALUES ($1, $2, $3, $4)',
            [userId, username, itemId, itemName]
        );

        res.status(201).json({ message: 'Item selected successfully. Please wait until it is cooked.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to get user choices
app.get('/api/user-choices', [authenticateJWT, adminOnly], async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM user_choices');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
