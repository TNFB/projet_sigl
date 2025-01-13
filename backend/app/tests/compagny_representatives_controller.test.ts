import { jest } from '@jest/globals';
import db from '@adonisjs/lucid/services/db';
import { isValidRole } from '../utils/api_utils.js';
import CompanyRepresentativesController from '../controllers/CompanyRepresentativesController';

describe('CompanyRepresentativesController.addMissionToApprentice', () => {
  let controller;

  beforeEach(() => {
    controller = new CompanyRepresentativesController();
    jest.clearAllMocks();
  });

  it('should add a mission to the apprentice successfully', async () => {
    const request = {
      only: jest.fn(() => ({
        data: {
          apprentiEmail: 'apprentice@example.com',
          mission: {
            titreMission: 'Développement d\'une API REST',
            descriptionMission: 'Créer une API REST sécurisée',
            competences: ['Node.js', 'Express', 'MongoDB'],
          },
        },
      })),
      user: { email: 'admin@example.com' },
    };

    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(isValidRole, 'default').mockResolvedValue(true);
    jest.spyOn(db, 'from').mockImplementation((table) => {
      if (table === 'apprentices') {
        return {
          where: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              first: jest.fn().mockResolvedValue({
                id: 1,
                listMissions: JSON.stringify([]),
              }),
            }),
          }),
        };
      }
      return null;
    });

    jest.spyOn(db, 'update').mockResolvedValue();

    await controller.addMissionToApprentice({ request, response });

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      message: "Mission added successfully to apprentice's list",
    });
  });

  it('should return 400 if data is missing', async () => {
    const request = {
      only: jest.fn(() => ({ data: null })),
      user: { email: 'admin@example.com' },
    };

    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await controller.addMissionToApprentice({ request, response });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ error: 'Data is required' });
  });

  it('should return 400 if the apprentice does not exist', async () => {
    const request = {
      only: jest.fn(() => ({
        data: {
          apprentiEmail: 'unknown@example.com',
          mission: {
            titreMission: 'Développement',
            descriptionMission: 'Description',
            competences: ['Skill1'],
          },
        },
      })),
      user: { email: 'admin@example.com' },
    };

    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(isValidRole, 'default').mockResolvedValue(true);
    jest.spyOn(db, 'from').mockImplementation((table) => {
      if (table === 'apprentices') {
        return {
          where: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({ first: jest.fn().mockResolvedValue(null) }),
          }),
        };
      }
      return null;
    });

    await controller.addMissionToApprentice({ request, response });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ message: 'Apprentice not found' });
  });

  it('should return 401 if the user is unauthorized', async () => {
    const request = {
      only: jest.fn(() => ({
        data: {
          apprentiEmail: 'apprentice@example.com',
          mission: {
            titreMission: 'Développement',
            descriptionMission: 'Description',
            competences: ['Skill1'],
          },
        },
      })),
      user: null,
    };

    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await controller.addMissionToApprentice({ request, response });

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  it('should return 500 on server error', async () => {
    const request = {
      only: jest.fn(() => ({
        data: {
          apprentiEmail: 'apprentice@example.com',
          mission: {
            titreMission: 'Développement',
            descriptionMission: 'Description',
            competences: ['Skill1'],
          },
        },
      })),
      user: { email: 'admin@example.com' },
    };

    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(isValidRole, 'default').mockRejectedValue(new Error('Database error'));

    await controller.addMissionToApprentice({ request, response });

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      message: 'An error occurred while adding the mission',
    });
  });
});
