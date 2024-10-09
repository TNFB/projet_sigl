const db = require('../config/db');

exports.getAllUsers = (req, res) => {
  db.query('SELECT * FROM user', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.getUsersById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM user WHERE id = ?', id ,(err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.createUser = (req, res) => {
  const { nom, prenom, date_naissance, genre, mail, password, telephone, actif } = req.body;

  console.log("I PASS IN CREATE");

  // Exécuter la requête d'insertion
  db.query(
    'INSERT INTO user (`nom`, `prenom`, `date_naissance`, `genre`, `mail`, `password`, `telephone`, `actif`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
    [nom, prenom, date_naissance, genre, mail, password, telephone, actif], 
    (err, result) => {
      if (err) {
        console.error(err); // Log l'erreur pour le débogage
        return res.status(500).json(err);
      }
      
      // Créer un nouvel utilisateur pour la réponse
      const newUser = {
        id: result.insertId, nom, prenom, date_naissance, genre, mail, password, telephone, actif
      };

      // Renvoyer la réponse avec le nouvel utilisateur
      res.status(201).json(newUser);
    }
  );
};


exports.updateUser = (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;
  db.query('UPDATE user SET ? WHERE id = ?', [updatedUser, id], (err) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ id, ...updatedUser });
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM user WHERE id = ?', id, (err) => {
    if (err) return res.status(500).json(err);
    res.status(204).send();
  });
};

