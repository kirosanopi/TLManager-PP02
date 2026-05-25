const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const main = express();
const PORT = process.env.PORT || 3000;

main.use(cors());
main.use(express.json());

/* API endpoints */

// GET (get list all tasks)
main.get('/tasks', async(req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, title, completed, user_id, created_at FROM tasks ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch(err) {
        console.error(err.message);
        res.status(500).json({error: 'Server error'});
    }
});

// POST (create new task)
main.post('/tasks', async(req, res) => {
    const {title, user_id} = req.body;

    if (!title) {
        return res.status(400).json({error: 'Title is required'});
    }

    try {
        const result = await pool.query(
            'INSERT INTO tasks(title, user_id) VALUES ($1, $2) RETURNING *',
            [title, user_id || null] 
        );
        res.status(201).json(result.rows[0]);
    } catch(err) {
        console.error(err.message);
        res.status(500).json({error: 'Server error'});
    }
});

// PUT (rename status task)
main.put('/tasks/:id', async(req, res) => {
    const {id} = req.params;
    const {completed} = req.body;

    if(typeof completed !== 'boolean') {
        return res.status(400).json({error: 'Completed must be boolean'});
    }

    try {
        const result = await pool.query(
            'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *',
            [completed, id]
        );

    if(result.rows.length === 0) {
        return res.status(404).json({error: 'Task not found'});
    }
    res.json(result.rows[0]);
    } catch(err) {
        console.error(err.message);
        res.status(500).json({error: 'Server error'});
    }
});

// DELETE (delete task)
main.delete('/tasks/:id', async(req, res) => {
    const {id} = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM tasks WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({error: 'Task not found'});
        }
        res.json({message: 'Task deleted successfully', task: result.rows[0]});
    } catch(err) {
        console.error(err.message);
        res.status(500).json({error: 'Server error'});
    }
});

main.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
