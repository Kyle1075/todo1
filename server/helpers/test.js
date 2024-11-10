import fs from 'fs';
import path from 'path';
import { pool } from './db.js';
import { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';

const { sign } = jwt;
const __dirname = path.resolve();

const clearTestDb = async () => {
    try {
        await pool.query('TRUNCATE account, task RESTART IDENTITY CASCADE;');
        console.log('Test database cleared.');
    } catch (error) {
        console.error('Error clearing test database:', error.message);
        throw error;
    }
};

const initializeTestDb = async () => {
    const sql = fs.readFileSync(path.resolve(__dirname, './todo.sql'), 'utf-8');
    try {
        await pool.query(sql);
        console.log('Test database initialized successfully.');
    } catch (error) {
        console.error('Error initializing test database:', error.message);
        throw error;
    }
};

const insertTestUser = async (email, password) => {
    try {
        const hashedPassword = await hash(password, 10);
        await pool.query('INSERT INTO account (email, password) VALUES ($1, $2)', [
            email,
            hashedPassword,
        ]);
        console.log(`Test user ${email} added successfully.`);
    } catch (error) {
        if (error.code === '23505') {
            console.warn(`Test user ${email} already exists.`);
        } else {
            console.error('Error adding test user:', error.message);
            throw error;
        }
    }
};

const getToken = (email) => {
    return sign({ user: email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
};

export { clearTestDb, initializeTestDb, insertTestUser, getToken };
