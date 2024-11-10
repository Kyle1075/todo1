//todoRouter.js
import { Router } from 'express';
import { pool } from '../helpers/db.js';
import { auth } from '../helpers/auth.js'; // Authentication middleware
import { emptyOrRows } from '../helpers/utils.js'; // Utility to handle query results
import {getTasks,postTask}from '../controllers/TaskController.js';
const router = Router();
router.get('/',getTasks);
// GET all tasks
router.get('/', async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM task');
        const tasks = emptyOrRows(result.rows);
        return res.status(200).json(tasks);
    } catch (error) {
        return next(error);
    }
});

// POST a new task
router.post('/create', auth, async (req, res, next) => {
    const { description } = req.body;

    if (!description || typeof description !== 'string') {
        return res.status(400).json({ error: 'Description is required and must be a string' });
    }

    try {
        const result = await pool.query('INSERT INTO task(description) VALUES($1) RETURNING *', [description]);
        return res.status(200).json(result.rows[0]);
    } catch (error) {
        return next(error);
    }
});

// DELETE a task by ID
router.delete('/delete/:id', auth, async (req, res, next) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    try {
        const result = await pool.query('DELETE FROM task WHERE id = $1 RETURNING id', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        return res.status(200).json({ id });
    } catch (error) {
        return next(error);
    }
});

export default router;
