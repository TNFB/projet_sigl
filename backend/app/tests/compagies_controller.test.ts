import db from '@adonisjs/lucid/services/db';
import { isValidRole } from '../utils/api_utils.js';
import CompaniesController from '../controllers/CompaniesController';
import { jest } from '@jest/globals';

jest.mock('@adonisjs/lucid/services/db');
jest.mock('../utils/api_utils.js');

describe('CompaniesController', () => {
  let controller: CompaniesController;

  beforeEach(() => {
    controller = new CompaniesController();
    jest.clearAllMocks();
  });

  describe('createCompany', () => {
    it('should create companies successfully', async () => {
      const mockRequest = {
        user: { email: 'admin@example.com' },
        only: jest.fn().mockReturnValue({
          data: {
            companiesData: [{ name: 'Company A' }, { name: 'Company B' }],
          },
        }),
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      (isValidRole as jest.Mock).mockResolvedValue(true);
      (db.from as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(null),
      });
      (db.table as jest.Mock).mockReturnValue({
        insert: jest.fn().mockResolvedValue([1]),
      });
      (db.from as jest.Mock).mockReturnValue({
        where: jest.fn().mockResolvedValueOnce({ idCompany: 1, name: 'Company A' }),
      });

      await controller.createCompany({ request: mockRequest, response: mockResponse });

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        results: [
          { idCompany: 1, name: 'Company A', status: 'success', message: 'Company created successfully' },
        ],
        message: 'Companies processing completed',
      });
    });

    it('should return an error if companiesData is invalid', async () => {
      const mockRequest = {
        user: { email: 'admin@example.com' },
        only: jest.fn().mockReturnValue({
          data: { companiesData: [] },
        }),
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      (isValidRole as jest.Mock).mockResolvedValue(true);

      await controller.createCompany({ request: mockRequest, response: mockResponse });

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid input: data should be a non-empty array of company names',
      });
    });

    it('should return unauthorized if user is not authenticated', async () => {
      const mockRequest = {
        user: null,
        only: jest.fn(),
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.createCompany({ request: mockRequest, response: mockResponse });

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });
  });

  describe('getAllCompanyNames', () => {
    it('should return all company names', async () => {
      const mockRequest = {
        user: { email: 'admin@example.com' },
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      (isValidRole as jest.Mock).mockResolvedValue(true);
      (db.from as jest.Mock).mockResolvedValue([{ name: 'Company A' }, { name: 'Company B' }]);

      await controller.getAllCompanyNames({ request: mockRequest, response: mockResponse });

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        companyNames: ['Company A', 'Company B'],
      });
    });

    it('should return error if no companies are found', async () => {
      const mockRequest = {
        user: { email: 'admin@example.com' },
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      (isValidRole as jest.Mock).mockResolvedValue(true);
      (db.from as jest.Mock).mockResolvedValue([]);

      await controller.getAllCompanyNames({ request: mockRequest, response: mockResponse });

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'No companies found' });
    });

    it('should return unauthorized if user is not authenticated', async () => {
      const mockRequest = {
        user: null,
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.getAllCompanyNames({ request: mockRequest, response: mockResponse });

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });
  });
});
