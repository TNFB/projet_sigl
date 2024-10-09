const db = require('../config/db');

exports.getAllUsers = (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.createUser = (req, res) => {
  const newUser = req.body;
  db.query('INSERT INTO users SET ?', newUser, (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ id: result.insertId, ...newUser });
  });
};

exports.updateUser = (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;
  db.query('UPDATE users SET ? WHERE id = ?', [updatedUser, id], (err) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ id, ...updatedUser });
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM users WHERE id = ?', id, (err) => {
    if (err) return res.status(500).json(err);
    res.status(204).send();
  });
};

