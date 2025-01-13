import ProfessionalsController from '../controllers/professionals_controller.js';
import db from '@adonisjs/lucid/services/db';
import bcrypt from 'bcrypt';
import { isValidRole } from '../utils/api_utils.js';
import { describe, jest, beforeEach, afterEach, it, expect } from '@jest/globals';

jest.mock('@adonisjs/lucid/services/db');
jest.mock('bcrypt');
jest.mock('../utils/api_utils');

describe('ProfessionalsController', () => {
  let controller;
  let request;
  let response;

  beforeEach(() => {
    controller = new ProfessionalsController();
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

  describe('createOrUpdateProfessionals', () => {
    it('should return 400 if data is missing', async () => {
      request.only.mockReturnValue({});

      await controller.createOrUpdateProfessionals({ request, response });

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({ error: 'Data is required' });
    });

    it('should return 401 if user is unauthorized', async () => {
      request.user = null;

      await controller.createOrUpdateProfessionals({ request, response });

      expect(response.status).toHaveBeenCalledWith(401);
      expect(response.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('should return 400 if role is invalid', async () => {
      request.only.mockReturnValue({ data: { peopleData: [] } });
      isValidRole.mockResolvedValue(false);

      await controller.createOrUpdateProfessionals({ request, response });

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Invalid role',
      });
    });

    it('should return 400 if peopleData is not an array', async () => {
      request.only.mockReturnValue({ data: { peopleData: {} } });
      isValidRole.mockResolvedValue(true);

      await controller.createOrUpdateProfessionals({ request, response });

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({ error: 'Input should be an array of people' });
    });

    it('should create a new professional if user does not exist', async () => {
      request.only.mockReturnValue({
        data: {
          peopleData: [
            {
              name: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
              companyName: 'Company A',
            },
          ],
        },
      });
      isValidRole.mockResolvedValue(true);
      db.from.mockReturnValueOnce({
        where: jest.fn().mockReturnValueOnce({ first: jest.fn().mockResolvedValue(null) }),
      });
      db.table.mockReturnValueOnce({
        insert: jest.fn().mockResolvedValueOnce([{ idCompany: 1 }]),
      });
      bcrypt.hash.mockResolvedValue('hashedpassword');
      db.table.mockReturnValueOnce({
        insert: jest.fn().mockResolvedValueOnce([{ id_user: 1 }]),
      });

      await controller.createOrUpdateProfessionals({ request, response });

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Apprentice masters processed successfully',
        results: [
          {
            email: 'john.doe@example.com',
            status: 'created',
            userId: 1,
            compagnyId: 1,
          },
        ],
      });
    });

    it('should update an existing professional', async () => {
      request.only.mockReturnValue({
        data: {
          peopleData: [
            {
              name: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
              companyName: 'Company A',
            },
          ],
        },
      });
      isValidRole.mockResolvedValue(true);
      db.from.mockReturnValueOnce({
        where: jest.fn().mockReturnValueOnce({
          first: jest.fn().mockResolvedValue({ idCompany: 1 }),
        }),
      });
      db.from.mockReturnValueOnce({
        where: jest.fn().mockReturnValueOnce({
          first: jest.fn().mockResolvedValue({ id_user: 1 }),
        }),
      });
      db.from.mockReturnValueOnce({
        where: jest.fn().mockReturnValueOnce({
          first: jest.fn().mockResolvedValue(null),
        }),
      });

      await controller.createOrUpdateProfessionals({ request, response });

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Apprentice masters processed successfully',
        results: [
          {
            email: 'john.doe@example.com',
            status: 'updated',
            userId: 1,
            compagnyId: 1,
          },
        ],
      });
    });

    it('should return 500 if an error occurs', async () => {
      request.only.mockReturnValue({
        data: {
          peopleData: [
            {
              name: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
              companyName: 'Company A',
            },
          ],
        },
      });
      isValidRole.mockResolvedValue(true);
      db.from.mockImplementation(() => {
        throw new Error('DB error');
      });

      await controller.createOrUpdateProfessionals({ request, response });

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({
        error: 'An error occurred while processing professionals',
      });
    });
  });
});
