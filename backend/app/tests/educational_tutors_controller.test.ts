import EducationalTutorsController from '../controllers/EducationalTutorsController';
import db from '@adonisjs/lucid/services/db';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

jest.mock('@adonisjs/lucid/services/db');
jest.mock('../utils/api_utils', () => ({
  isValidRole: jest.fn(),
}));

const mockIsValidRole = require('../utils/api_utils').isValidRole;

describe('EducationalTutorsController', () => {
  let controller: EducationalTutorsController;
  let mockRequest: Partial<HttpContextContract['request']>;
  let mockResponse: Partial<HttpContextContract['response']>;

  beforeEach(() => {
    controller = new EducationalTutorsController();

    mockRequest = {
      only: jest.fn(),
      user: { email: 'admin@example.com' },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('addApprentices', () => {
    it('should return 400 if no data is provided', async () => {
      mockRequest.only.mockReturnValue({});
      await controller.addApprentices({
        request: mockRequest as any,
        response: mockResponse as any,
      });

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Data is required' });
    });

    it('should return 401 if user is not authenticated', async () => {
      mockRequest.user = undefined;
      mockRequest.only.mockReturnValue({ data: { tutorId: 1, apprenticeIds: [1, 2] } });

      await controller.addApprentices({
        request: mockRequest as any,
        response: mockResponse as any,
      });

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('should return 400 if user role is invalid', async () => {
      mockRequest.only.mockReturnValue({ data: { tutorId: 1, apprenticeIds: [1, 2] } });
      mockIsValidRole.mockResolvedValue(false);

      await controller.addApprentices({
        request: mockRequest as any,
        response: mockResponse as any,
      });

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Invalid role',
      });
    });

    it('should return 400 if tutor does not exist', async () => {
      mockRequest.only.mockReturnValue({ data: { tutorId: 1, apprenticeIds: [1, 2] } });
      mockIsValidRole.mockResolvedValue(true);
      db.from.mockResolvedValueOnce([]);

      await controller.addApprentices({
        request: mockRequest as any,
        response: mockResponse as any,
      });

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'educational tutors not found' });
    });

    it('should successfully add apprentices', async () => {
      mockRequest.only.mockReturnValue({ data: { tutorId: 1, apprenticeIds: [1, 2] } });
      mockIsValidRole.mockResolvedValue(true);
      db.from.mockResolvedValueOnce([{ id: 1, listeIdApprentice: null }]);
      db.transaction.mockImplementationOnce((callback) => callback({ from: jest.fn(), update: jest.fn() }));

      await controller.addApprentices({
        request: mockRequest as any,
        response: mockResponse as any,
      });

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Apprentices added successfully' });
    });
  });

  describe('assignEducationalTutorRole', () => {
    it('should return 400 if no data is provided', async () => {
      mockRequest.only.mockReturnValue({});
      await controller.assignEducationalTutorRole({
        request: mockRequest as any,
        response: mockResponse as any,
      });

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Data is required' });
    });

    it('should successfully assign the educational tutor role', async () => {
      mockRequest.only.mockReturnValue({ data: { email: 'user@example.com' } });
      mockIsValidRole.mockResolvedValue(true);
      db.from.mockResolvedValueOnce([{ id_user: 1 }]);
      db.transaction.mockImplementationOnce((callback) => callback({ from: jest.fn(), update: jest.fn(), table: jest.fn() }));

      await controller.assignEducationalTutorRole({
        request: mockRequest as any,
        response: mockResponse as any,
      });

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User successfully assigned as educational tutor',
        userId: 1,
      });
    });
  });
});
