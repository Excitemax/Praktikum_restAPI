import express from 'express';
import mysql from 'mysql2';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';

const swaggerDocument = YAML.parse(fs.readFileSync('./openapi/spec.yml', 'utf8'));

const db = mysql.createConnection({ host: "localhost", user: "root", database: "openapi", password: ""});

db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
    }
});

const app = express();
app.use(express.json());
app.use('/docs', swaggerUi.setup(swaggerDocument));

app.get('/users', (req, res) => {
    db.query('SELECT * FROM user', (err, results) => {
        if (err) {
            res.status(500).send('Internal Server Error');
            return;
        }

        res.json(results);

    });
});

app.post('/users', (req, res) => {
    const { name, email, age } = req.query;

    if (!name || !email || !age) {
        res.status(400).send('Bad Request: Missing required parameters');
        return;
    }

    db.query('INSERT INTO user (name, email, age) VALUES (?, ?, ?)', [name, email, age], (err, results) => {
        if (err) {
            res.status(500).send('Internal Server Error');
            return;
        }

        res.status(201).json({ id: results.insertId, name, email, age });
    });
});

app.get('/users/:id', (req, res) => {
    db.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            res.status(500).send('Internal Server Error');
            return;
        }
        if (results.length === 0) {
            res.status(404).send('User not found');
            return;
        }
        res.json(results[0]);
    });
});

app.delete('/users/:id', (req, res) => {
    db.query('DELETE FROM user WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            res.status(500).send('Internal Server Error');
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).send('User not found');
            return;
        }
        res.send('User deleted successfully');
    });
});

app.put('/users/:id', (req, res) => {
    db.query('UPDATE user SET name = ?, email = ? WHERE id = ?', [req.body.name, req.body.email, req.params.id], (err, results) => {
        if (err) {
            res.status(500).send('Internal Server Error');
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).send('User not found');
            return;
        }
        res.json({ id: req.params.id, name: req.body.name, email: req.body.email });
    });
});

app.listen(3000, () => console.log('server berjalan di http://localhost:3000'));


