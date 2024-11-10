import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import todoRouter from './routers/todoRouter.js';  // Import todoRouter
import userRouter from './routers/userRouter.js';  // Import userRouter
import { pool } from './helpers/db.js';  // Database connection

dotenv.config();

const port = process.env.PORT || 3001;  // Use the port from environment or default to 3001
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/tasks', todoRouter);  // All task-related routes handled by todoRouter
app.use('/user', userRouter);  // All user-related routes handled by userRouter

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ error: err.message });
});

// Connect to the database and verify connection
pool.connect()
    .then(client => {
        console.log('Successfully connected to the database');
        client.release();  // Release client after connection check
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
