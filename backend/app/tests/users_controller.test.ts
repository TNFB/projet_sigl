import { HttpContext } from '@adonisjs/core/http'
import { beforeEach, describe, jest } from '@jest/globals'
import ApprenticeMastersController from '../controllers/apprentice_masters_controller.js'
import db from '@adonisjs/lucid/services/db'
import bcrypt from 'bcrypt'
import { findUserByEmail, isValidRole } from '../utils/api_utils.js'

jest.mock('@adonisjs/lucid/services/db')
jest.mock('bcrypt')
jest.mock('../utils/api_utils')

describe('ApprenticeMastersController', () => {
  let controller;
  let request;
  let response;

  beforeEach(() => {
    controller = new ApprenticeMastersController();
    request = {
      only: jest.fn(),
      input: jest.fn(),
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

  describe('addApprentices', () => {
    it('should add apprentices successfully', async () => {
      request.only.mockReturnValue({ masterId: 1, apprenticeIds: [101, 102, 103] });
      isValidRole.mockResolvedValue(true);
      db.from.mockReturnValueOnce({
        where: jest.fn().mockReturnValueOnce({
          first: jest.fn().mockResolvedValue({ id: 1 })
        })
      });
      db.transaction.mockImplementation(async (callback) => {
        return callback({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              update: jest.fn()
            })
          })
        });
      });

      await controller.addApprentices({ request, response } as HttpContext);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({ message: 'Apprentices added successfully' });
    });

    it('should return 400 if data is missing', async () => {
      request.only.mockReturnValue({});

      await controller.addApprentices({ request, response } as HttpContext);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({ error: 'Data is required' });
    });

    it('should return 401 if user is unauthorized', async () => {
      request.user = null;

      await controller.addApprentices({ request, response } as HttpContext);

      expect(response.status).toHaveBeenCalledWith(401);
      expect(response.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('should return 400 if role is invalid', async () => {
      request.only.mockReturnValue({ masterId: 1, apprenticeIds: [101, 102, 103] });
      isValidRole.mockResolvedValue(false);

      await controller.addApprentices({ request, response } as HttpContext);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({ status: 'error', message: 'Invalid role' });
    });

    it('should return 400 if master is not found', async () => {
      request.only.mockReturnValue({ masterId: 1, apprenticeIds: [101, 102, 103] });
      isValidRole.mockResolvedValue(true);
      db.from.mockReturnValueOnce({
        where: jest.fn().mockReturnValueOnce({
          first: jest.fn().mockResolvedValue(null)
        })
      });

      await controller.addApprentices({ request, response } as HttpContext);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({ message: 'Master not found' });
    });

    it('should return 500 if an error occurs', async () => {
      request.only.mockReturnValue({ masterId: 1, apprenticeIds: [101, 102, 103] });
      isValidRole.mockResolvedValue(true);
      db.from.mockReturnValueOnce({
        where: jest.fn().mockReturnValueOnce({
          first: jest.fn().mockRejectedValue(new Error('DB error'))
        })
      });

      await controller.addApprentices({ request, response } as HttpContext);

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({ message: 'An error occurred while adding apprentices' });
    });
  });
});
