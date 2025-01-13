import { HttpContext } from '@adonisjs/core/http';
import TrainingDiariesController from '../controllers/training_diaries_controller.js';
import db from '@adonisjs/lucid/services/db';
import { isValidRole } from '../utils/api_utils.js';

jest.mock('@adonisjs/lucid/services/db');
jest.mock('../utils/api_utils');

describe('TrainingDiariesController', () => {
  let controller;
  let request;
  let response;

  beforeEach(() => {
    controller = new TrainingDiariesController();
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

  describe('createTraningDiary', () => {
    it('should create a training diary successfully', async () => {
      request.only.mockReturnValue({ data: { id_user: 1 } });
      isValidRole.mockResolvedValue(true);
      db.from.mockReturnValueOnce({
        where: jest.fn().mockReturnValueOnce({
          first: jest.fn().mockResolvedValue({ id_user: 1, role: 'apprentices' }),
        }),
      });
      db.from.mockReturnValueOnce({
        where: jest.fn().mockReturnValueOnce({
          first: jest.fn().mockResolvedValue(null),
        }),
      });
      db.table.mockReturnValueOnce({
        insert: jest.fn().mockResolvedValue([42]), // ID du journal créé
      });
      db.from.mockReturnValueOnce({
        where: jest.fn().mockReturnValue({
          update: jest.fn().mockResolvedValue(1),
        }),
      });

      await controller.createTraningDiary({ request, response } as HttpContext);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Training Diary created',
        trainingDiaryId: 42,
      });
    });

    it('should return 400 if data is missing', async () => {
      request.only.mockReturnValue({});

      await controller.createTraningDiary({ request, response } as HttpContext);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({ error: 'Data is required' });
    });

    it('should return 401 if user is unauthorized', async () => {
      request.user = null;

      await controller.createTraningDiary({ request, response } as HttpContext);

      expect(response.status).toHaveBeenCalledWith(401);
      expect(response.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('should return 400 if role is invalid', async () => {
      request.only.mockReturnValue({ data: { id_user: 1 } });
      isValidRole.mockResolvedValue(false);

      await controller.createTraningDiary({ request, response } as HttpContext);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Invalid role',
      });
    });

    it('should return 400 if training diary already exists', async () => {
      request.only.mockReturnValue({ data: { id_user: 1 } });
      isValidRole.mockResolvedValue(true);
      db.from.mockReturnValueOnce({
        where: jest.fn().mockReturnValueOnce({
          first: jest.fn().mockResolvedValue({ id_user: 1, role: 'apprentices' }),
        }),
      });
      db.from.mockReturnValueOnce({
        where: jest.fn().mockReturnValueOnce({
          first: jest.fn().mockResolvedValue({ id_training_diary: 99 }),
        }),
      });

      await controller.createTraningDiary({ request, response } as HttpContext);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Un journal de formation existe déjà pour cet utilisateur',
        trainingDiaryId: 99,
      });
    });

    it('should return 403 if user is not found or not an apprentice', async () => {
      request.only.mockReturnValue({ data: { id_user: 1 } });
      isValidRole.mockResolvedValue(true);
      db.from.mockReturnValueOnce({
        where: jest.fn().mockReturnValueOnce({
          first: jest.fn().mockResolvedValue(null),
        }),
      });

      await controller.createTraningDiary({ request, response } as HttpContext);

      expect(response.status).toHaveBeenCalledWith(403);
      expect(response.json).toHaveBeenCalledWith({
        message: 'user not found or not authorised',
      });
    });

    it('should return 500 if an error occurs', async () => {
      request.only.mockReturnValue({ data: { id_user: 1 } });
      isValidRole.mockResolvedValue(true);
      db.from.mockRejectedValue(new Error('DB error'));

      await controller.createTraningDiary({ request, response } as HttpContext);

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Erreur in createTraningDiary',
      });
    });
  });
});
