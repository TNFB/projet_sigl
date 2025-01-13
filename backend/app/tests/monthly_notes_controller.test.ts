import MonthluNotesController from '../controllers/monthlu_notes_controller.js';
import db from '@adonisjs/lucid/services/db';
import { isValidRole } from '../utils/api_utils.js';
import { describe, jest, beforeEach, afterEach, it, expect } from '@jest/globals';

jest.mock('@adonisjs/lucid/services/db');
jest.mock('../utils/api_utils');

describe('MonthluNotesController', () => {
  let controller;
  let request;
  let response;

  beforeEach(() => {
    controller = new MonthluNotesController();
    request = {
      only: jest.fn(),
      user: { email: 'admin@example.com' },
    };
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createMonthlyNote', () => {
    it('should return 400 if data is missing', async () => {
      request.only.mockReturnValue({});

      await controller.createMonthlyNote({ request, response });

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({ error: 'Data is required' });
    });

    it('should return 401 if user is unauthorized', async () => {
      request.user = null;

      await controller.createMonthlyNote({ request, response });

      expect(response.status).toHaveBeenCalledWith(401);
      expect(response.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('should return 400 if role is invalid', async () => {
      request.only.mockReturnValue({
        data: {
          email: 'apprentice@example.com',
          title: 'Test Note',
          content: 'This is a test note.',
        },
      });
      isValidRole.mockResolvedValue(false);

      await controller.createMonthlyNote({ request, response });

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Invalid role',
      });
    });

    it('should return 403 if user does not exist or is not an apprentice', async () => {
      request.only.mockReturnValue({
        data: {
          email: 'unknown@example.com',
          title: 'Test Note',
          content: 'This is a test note.',
        },
      });
      isValidRole.mockResolvedValue(true);
      db.from.mockReturnValueOnce({
        where: jest.fn().mockReturnValueOnce({ first: jest.fn().mockResolvedValue(null) }),
      });

      await controller.createMonthlyNote({ request, response });

      expect(response.status).toHaveBeenCalledWith(403);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Utilisateur non trouvé ou non autorisé',
      });
    });

    it('should return 400 if apprentice does not exist', async () => {
      request.only.mockReturnValue({
        data: {
          email: 'apprentice@example.com',
          title: 'Test Note',
          content: 'This is a test note.',
        },
      });
      isValidRole.mockResolvedValue(true);
      db.from
        .mockReturnValueOnce({
          where: jest.fn().mockReturnValueOnce({ first: jest.fn().mockResolvedValue({ id: 1, role: 'apprentices' }) }),
        })
        .mockReturnValueOnce({
          where: jest.fn().mockReturnValueOnce({ first: jest.fn().mockResolvedValue(null) }),
        });

      await controller.createMonthlyNote({ request, response });

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Apprenti non trouvé',
      });
    });

    it('should create a monthly note successfully', async () => {
      request.only.mockReturnValue({
        data: {
          email: 'apprentice@example.com',
          title: 'Test Note',
          content: 'This is a test note.',
        },
      });
      isValidRole.mockResolvedValue(true);
      db.from
        .mockReturnValueOnce({
          where: jest.fn().mockReturnValueOnce({ first: jest.fn().mockResolvedValue({ id: 1, role: 'apprentices' }) }),
        })
        .mockReturnValueOnce({
          where: jest.fn().mockReturnValueOnce({ first: jest.fn().mockResolvedValue({ id_training_diary: 1 }) }),
        });
      db.table.mockReturnValueOnce({
        insert: jest.fn().mockResolvedValueOnce([1]),
      });

      await controller.createMonthlyNote({ request, response });

      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Note mensuelle créée',
        noteId: 1,
      });
    });

    it('should return 500 if an error occurs', async () => {
      request.only.mockReturnValue({
        data: {
          email: 'apprentice@example.com',
          title: 'Test Note',
          content: 'This is a test note.',
        },
      });
      isValidRole.mockResolvedValue(true);
      db.from.mockImplementation(() => {
        throw new Error('DB error');
      });

      await controller.createMonthlyNote({ request, response });

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Erreur lors de la création de la note mensuelle',
      });
    });
  });
});
