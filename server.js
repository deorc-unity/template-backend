const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/api/templates', (req, res) => {
    db.all('SELECT * FROM templates', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/templates', (req, res) => {
    const { name, html } = req.body;
    db.run('INSERT INTO templates (name, html) VALUES (?, ?)', [name, html], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, name, html });
    });
});

app.put('/api/templates/:id', (req, res) => {
    const { id } = req.params;
    const { html } = req.body;
    db.run('UPDATE templates SET html = ? WHERE id = ?', [html, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id, html });
    });
});

app.delete('/api/templates/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM templates WHERE id = ?', id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Template deleted' });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
