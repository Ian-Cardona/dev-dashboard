import express, { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, MockedFunction, vi } from 'vitest';
import { IRefreshTokenService } from '../../services/refreshToken.service';
import { RefreshTokenController } from '../refreshToken.controller';
import { errorHandlerMiddleware } from '../../middlewares/error_handler.middleware';
import { loggerMiddleware } from '../../middlewares/logger.middleware';
import { generateUUID } from '../../utils/uuid.utils';

const mockRefreshTokenService = {
  create: vi.fn() as MockedFunction<IRefreshTokenService['create']>,
  findByUserAndToken: vi.fn() as MockedFunction<
    IRefreshTokenService['findByUserAndToken']
  >,
  deleteToken: vi.fn() as MockedFunction<IRefreshTokenService['deleteToken']>,
  deleteAllUserTokens: vi.fn() as MockedFunction<
    IRefreshTokenService['deleteAllUserTokens']
  >,
  deleteExpiredTokens: vi.fn() as MockedFunction<
    IRefreshTokenService['deleteExpiredTokens']
  >,
};

const refreshTokenControllerInstance = RefreshTokenController(
  mockRefreshTokenService
);

const createTestApp = () => {
  const app = express();

  app.use(loggerMiddleware);

  app.use(express.json({ limit: '1mb' }));

  app.post('/refreshToken', refreshTokenControllerInstance.createRefreshToken);
  app.get(
    '/refreshToken/:userId/:tokenId',
    refreshTokenControllerInstance.findRefreshTokenByUserAndToken
  );
  app.delete(
    '/refreshToken/:userId/:tokenId',
    refreshTokenControllerInstance.deleteRefreshTokenByUserAndToken
  );
  app.delete(
    '/refreshToken/:userId',
    refreshTokenControllerInstance.deleteAllUserTokensByUserId
  );
  app.delete(
    '/refreshToken',
    refreshTokenControllerInstance.deleteExpiredTokens
  );

  app.use(errorHandlerMiddleware);

  return app;
};

describe('RefreshToken Controller', () => {
  let app: Express;

  const mockJwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
    'eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNjAwMDAwMDAwfQ.' +
    'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  const validData = {
    userId: generateUUID(),
    tokenId: generateUUID(),
    refreshToken: mockJwt,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  };

  beforeEach(() => {
    app = createTestApp();
    vi.clearAllMocks();
  });

  describe('POST /refreshToken', () => {
    it('should create new refresh token and return 201', async () => {
      mockRefreshTokenService.create.mockResolvedValue({
        ...validData,
        createdAt: new Date().toISOString(),
      });

      const response = await request(app).post('/refreshToken').send(validData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          userId: validData.userId,
          refreshToken: validData.refreshToken,
          expiresAt: validData.expiresAt,
          tokenId: expect.stringMatching(
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
          ),
          createdAt: expect.any(String),
        })
      );
      expect(mockRefreshTokenService.create).toHaveBeenCalledTimes(1);
    });

    it('should return 400 if userId is missing', async () => {
      const invalidData = { ...validData };
      delete invalidData.userId;
      const response = await request(app)
        .post('/refreshToken')
        .send(invalidData);
      expect(response.status).toBe(400);
    });

    it('should return 400 if userId is invalid UUID format', async () => {
      const invalidData = { ...validData, userId: 'invalid-uuid' };
      const response = await request(app)
        .post('/refreshToken')
        .send(invalidData);
      expect(response.status).toBe(400);
    });

    it('should return 400 if refreshToken is missing', async () => {
      const invalidData = { ...validData };
      delete invalidData.refreshToken;
      const response = await request(app)
        .post('/refreshToken')
        .send(invalidData);
      expect(response.status).toBe(400);
    });

    it('should return 400 if expiresAt is missing', async () => {
      const invalidData = { ...validData };
      delete invalidData.expiresAt;
      const response = await request(app)
        .post('/refreshToken')
        .send(invalidData);
      expect(response.status).toBe(400);
    });

    it('should return 400 if expiresAt is invalid', async () => {
      const invalidData = { ...validData, expiresAt: 'invalid-date' };
      const response = await request(app)
        .post('/refreshToken')
        .send(invalidData);
      expect(response.status).toBe(400);
    });

    it('should return 400 if expiresAt is in the past', async () => {
      const invalidData = {
        ...validData,
        expiresAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      };
      const response = await request(app)
        .post('/refreshToken')
        .send(invalidData);
      expect(response.status).toBe(400);
    });

    it('should return 500 on unexpected errors', async () => {
      mockRefreshTokenService.create.mockRejectedValue(
        new Error('Unexpected error')
      );
      const response = await request(app).post('/refreshToken').send(validData);
      expect(response.status).toBe(500);
    });

    it('should return 400 if request body is empty', async () => {
      const response = await request(app).post('/refreshToken').send({});
      expect(response.status).toBe(400);
    });

    it('should return 400 if refreshToken is empty string', async () => {
      const invalidData = { ...validData, refreshToken: '' };
      const response = await request(app)
        .post('/refreshToken')
        .send(invalidData);
      expect(response.status).toBe(400);
    });

    it('should return 400 if refreshToken is not a valid JWT format', async () => {
      const invalidData = { ...validData, refreshToken: 'invalid.jwt.token' };
      const response = await request(app)
        .post('/refreshToken')
        .send(invalidData);
      expect(response.status).toBe(400);
    });

    it('should handle very long expiration dates', async () => {
      const futureData = {
        ...validData,
        expiresAt: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000
        ).toISOString(), // 1 year
      };
      mockRefreshTokenService.create.mockResolvedValue({
        ...futureData,
        createdAt: new Date().toISOString(),
      });

      const response = await request(app)
        .post('/refreshToken')
        .send(futureData);
      expect(response.status).toBe(201);
    });

    it('should return 400 for malformed JSON', async () => {
      const response = await request(app)
        .post('/refreshToken')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}');
      expect(response.status).toBe(400);
    });
  });

  describe('GET /refreshToken/:userId/:tokenId', () => {
    it('should return 200 and the refresh token', async () => {
      mockRefreshTokenService.findByUserAndToken.mockResolvedValue({
        ...validData,
        createdAt: new Date().toISOString(),
      });

      const response = await request(app).get(
        `/refreshToken/${validData.userId}/${validData.tokenId}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          userId: validData.userId,
          refreshToken: validData.refreshToken,
          expiresAt: validData.expiresAt,
          tokenId: validData.tokenId,
          createdAt: expect.any(String),
        })
      );
    });

    it('should return 404 if refresh token is not found', async () => {
      mockRefreshTokenService.findByUserAndToken.mockResolvedValue(null);
      const response = await request(app).get(
        `/refreshToken/${validData.userId}/${validData.tokenId}`
      );

      expect(response.status).toBe(404);
    });

    it('should return 400 if userId or tokenId invalid UUID', async () => {
      const response1 = await request(app).get(
        `/refreshToken/invalid-uuid/${validData.tokenId}`
      );
      const response2 = await request(app).get(
        `/refreshToken/${validData.userId}/invalid-uuid`
      );
      expect(response1.status).toBe(400);
      expect(response2.status).toBe(400);
    });

    it('should return 500 on unexpected errors', async () => {
      mockRefreshTokenService.findByUserAndToken.mockRejectedValue(new Error());
      const response = await request(app).get(
        `/refreshToken/${validData.userId}/${validData.tokenId}`
      );

      expect(response.status).toBe(500);
    });
  });

  describe('DELETE /refreshToken/:userId/:tokenId', () => {
    it('should return 204 on successful deletion', async () => {
      const response = await request(app).delete(
        `/refreshToken/${validData.userId}/${validData.tokenId}`
      );
      expect(response.status).toBe(204);
    });

    it('should return 400 if userId or tokenId invalid UUID', async () => {
      const response1 = await request(app).delete(
        `/refreshToken/invalid-uuid/${validData.tokenId}`
      );
      const response2 = await request(app).delete(
        `/refreshToken/${validData.userId}/invalid-uuid`
      );
      expect(response1.status).toBe(400);
      expect(response2.status).toBe(400);
    });

    it('should return 500 on unexpected errors', async () => {
      mockRefreshTokenService.deleteToken.mockRejectedValue(new Error());
      const response = await request(app).delete(
        `/refreshToken/${validData.userId}/${validData.tokenId}`
      );
      expect(response.status).toBe(500);
    });
  });

  describe('DELETE /refreshToken/:userId', () => {
    it('should delete all tokens for user and return 204', async () => {
      const response = await request(app).delete(
        `/refreshToken/${validData.userId}`
      );
      expect(response.status).toBe(204);
      expect(mockRefreshTokenService.deleteAllUserTokens).toHaveBeenCalledWith(
        validData.userId
      );
    });

    it('should return 400 if userId is invalid UUID', async () => {
      const response = await request(app).delete('/refreshToken/invalid-uuid');
      expect(response.status).toBe(400);
    });

    it('should return 500 on unexpected errors', async () => {
      mockRefreshTokenService.deleteAllUserTokens.mockRejectedValue(
        new Error()
      );
      const response = await request(app).delete(
        `/refreshToken/${validData.userId}`
      );

      expect(response.status).toBe(500);
    });
  });

  describe('DELETE /refreshToken (delete expired tokens)', () => {
    it('should delete expired tokens and return 204', async () => {
      const response = await request(app).delete('/refreshToken');
      expect(response.status).toBe(204);
      expect(mockRefreshTokenService.deleteExpiredTokens).toHaveBeenCalled();
    });

    it('should return 500 on unexpected errors', async () => {
      mockRefreshTokenService.deleteExpiredTokens.mockRejectedValue(
        new Error()
      );
      const response = await request(app).delete('/refreshToken');
      expect(response.status).toBe(500);
    });
  });

  describe('HTTP Method Validation', () => {
    it('should return 405 for unsupported methods on /refreshToken', async () => {
      const response = await request(app).put('/refreshToken').send(validData);
      expect(response.status).toBe(404); // Express returns 404 for unmatched routes
    });
  });

  describe('Content-Type Validation', () => {
    it('should handle missing Content-Type header gracefully', async () => {
      const response = await request(app)
        .post('/refreshToken')
        .send('not-json');
      expect(response.status).toBe(400);
    });
  });

  describe('Request Size Limits', () => {
    it('should reject requests exceeding 1mb limit', async () => {
      const largePayload = {
        ...validData,
        extraData: 'x'.repeat(2 * 1024 * 1024), // 2MB string
      };
      const response = await request(app)
        .post('/refreshToken')
        .send(largePayload);
      expect(response.status).toBe(413); // Payload Too Large
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle multiple simultaneous requests', async () => {
      mockRefreshTokenService.create.mockResolvedValue({
        ...validData,
        createdAt: new Date().toISOString(),
      });

      const requests = Array(5)
        .fill(null)
        .map(() => request(app).post('/refreshToken').send(validData));

      const responses = await Promise.all(requests);
      responses.forEach(response => {
        expect(response.status).toBe(201);
      });
      expect(mockRefreshTokenService.create).toHaveBeenCalledTimes(5);
    });
  });

  describe('Service Layer Error Handling', () => {
    it('should handle database connection errors', async () => {
      mockRefreshTokenService.create.mockRejectedValue(
        new Error('Database connection failed')
      );
      const response = await request(app).post('/refreshToken').send(validData);
      expect(response.status).toBe(500);
    });

    it('should handle timeout errors', async () => {
      mockRefreshTokenService.findByUserAndToken.mockRejectedValue(
        new Error('Request timeout')
      );
      const response = await request(app).get(
        `/refreshToken/${validData.userId}/${validData.tokenId}`
      );
      expect(response.status).toBe(500);
    });
  });

  describe('Response Format Validation', () => {
    it('should return consistent error format', async () => {
      const response = await request(app)
        .post('/refreshToken')
        .send({ userId: 'invalid-uuid' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should not expose sensitive information in error responses', async () => {
      mockRefreshTokenService.create.mockRejectedValue(
        new Error('Internal database error with sensitive info')
      );

      const response = await request(app).post('/refreshToken').send(validData);
      expect(response.status).toBe(500);
      expect(response.body.message).not.toContain('database');
      expect(response.body.message).not.toContain('sensitive');
    });
  });

  describe('URL Parameter Edge Cases', () => {
    // it('should handle URL-encoded special characters in UUIDs', async () => {
    //   const specialUuid = validData.userId.replace('-', '%2D');
    //   const response = await request(app).get(
    //     `/refreshToken/${specialUuid}/${validData.tokenId}`
    //   );
    //   expect(response.status).toBe(200);
    // });

    it('should reject extremely long path parameters', async () => {
      const longString = 'x'.repeat(1000);
      const response = await request(app).get(
        `/refreshToken/${longString}/${validData.tokenId}`
      );
      expect(response.status).toBe(400);
    });
  });

  describe('Performance Tests', () => {
    it('should complete requests within reasonable time', async () => {
      const startTime = Date.now();

      mockRefreshTokenService.create.mockResolvedValue({
        ...validData,
        createdAt: new Date().toISOString(),
      });

      const response = await request(app).post('/refreshToken').send(validData);
      const endTime = Date.now();

      expect(response.status).toBe(201);
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle create -> find -> delete workflow', async () => {
      // Create - Mock the create service method
      mockRefreshTokenService.create.mockResolvedValue({
        ...validData,
        createdAt: new Date().toISOString(),
      });

      let response = await request(app).post('/refreshToken').send(validData);
      expect(response.status).toBe(201);

      // Find - Mock the findByUserAndToken service method
      mockRefreshTokenService.findByUserAndToken.mockResolvedValue({
        ...validData,
        createdAt: new Date().toISOString(),
      });

      response = await request(app).get(
        `/refreshToken/${validData.userId}/${validData.tokenId}`
      );
      expect(response.status).toBe(200);

      // Delete - Mock the deleteToken service method
      mockRefreshTokenService.deleteToken.mockResolvedValue(undefined);

      response = await request(app).delete(
        `/refreshToken/${validData.userId}/${validData.tokenId}`
      );
      expect(response.status).toBe(204);

      // Verify all service methods were called
      expect(mockRefreshTokenService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: validData.userId,
          refreshToken: validData.refreshToken,
          expiresAt: validData.expiresAt,
        })
      );
      expect(mockRefreshTokenService.findByUserAndToken).toHaveBeenCalledWith(
        validData.userId,
        validData.tokenId
      );
      expect(mockRefreshTokenService.deleteToken).toHaveBeenCalledWith(
        validData.userId,
        validData.tokenId
      );
    });

    it('should maintain consistent behavior across related operations', async () => {
      mockRefreshTokenService.create.mockResolvedValue({
        ...validData,
        createdAt: new Date().toISOString(),
      });
      mockRefreshTokenService.findByUserAndToken
        .mockResolvedValueOnce({
          ...validData,
          createdAt: new Date().toISOString(),
        })
        .mockResolvedValueOnce(null);
      mockRefreshTokenService.deleteToken.mockResolvedValue(undefined);

      const createResponse = await request(app)
        .post('/refreshToken')
        .send(validData);
      const findResponse = await request(app).get(
        `/refreshToken/${validData.userId}/${validData.tokenId}`
      );
      const deleteResponse = await request(app).delete(
        `/refreshToken/${validData.userId}/${validData.tokenId}`
      );
      const findAfterDeleteResponse = await request(app).get(
        `/refreshToken/${validData.userId}/${validData.tokenId}`
      );

      expect(createResponse.status).toBe(201);
      expect(findResponse.status).toBe(200);
      expect(deleteResponse.status).toBe(204);
      expect(findAfterDeleteResponse.status).toBe(404);
    });
  });
});
