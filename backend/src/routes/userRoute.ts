import express, { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/dataSource';
import { User } from '../models/userModel';

const router: Router = Router(); // Utiliser Router() pour créer le routeur
router.use(express.json());

// Récupérer tous les utilisateurs
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await AppDataSource.getRepository(User).find();
    res.json(users);
  } catch (error) {
    console.error(error); // Log de l'erreur pour le débogage
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
});

// Récupérer un utilisateur par ID
router.get('/users/:id', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  // Vérification si l'ID est un nombre
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'L\'ID doit être un nombre valide.' });
  }

  try {
    const user = await AppDataSource.getRepository(User).findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }
    return res.json(user);
  } catch (error) {
    console.error(error); // Log de l'erreur pour le débogage
    return res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur.' });
  }
});

// Créer un nouvel utilisateur
router.post('/users', async (req: Request, res: Response) => {
  try {
    const newUser = AppDataSource.getRepository(User).create(req.body);
    const result = await AppDataSource.getRepository(User).save(newUser);
    res.status(201).json(result);
  } catch (error) {
    console.error(error); // Log de l'erreur pour le débogage
    res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
  }
});

// Mettre à jour un utilisateur
router.put('/users/:id', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'ID doit être un nombre' });
  }

  try {
    const user = await AppDataSource.getRepository(User).findOne({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    Object.assign(user, req.body);
    await AppDataSource.getRepository(User).save(user);
    res.json(user);
  } catch (error) {
    console.error(error); // Log de l'erreur pour le débogage
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
});

// Supprimer un utilisateur
router.delete('/users/:id', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'ID doit être un nombre' });
  }

  try {
    const user = await AppDataSource.getRepository(User).findOne({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    await AppDataSource.getRepository(User).remove(user);
    res.status(204).send(); // Pas de contenu à retourner
  } catch (error) {
    console.error(error); // Log de l'erreur pour le débogage
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
  }
});

export default router;
