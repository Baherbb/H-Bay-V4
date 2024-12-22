import { Request, Response, NextFunction } from 'express';
import { forgotPassword, resetPassword } from '../../../controllers/password.controller';
import User from '../../../models/user.model';
import { emailService } from '../../../services/email.service';

jest.mock('../../../models/user.model');
jest.mock('../../../services/email.service');

describe('Password Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();

    // Spy on console.error
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore console.error after each test
    consoleErrorSpy.mockRestore();
  });

  describe('forgotPassword', () => {
    it('should handle non-existent email successfully', async () => {
      mockRequest.body = { email: 'nonexistent@example.com' };
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await forgotPassword(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'If a user with this email exists, they will receive password reset instructions.',
      });
      expect(emailService.sendResetPasswordEmail).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should generate reset token and send email for existing user', async () => {
      mockRequest.body = { email: 'existing@example.com' };
      const mockUser = {
        update: jest.fn().mockResolvedValue(true),
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (emailService.sendResetPasswordEmail as jest.Mock).mockResolvedValue(true);

      await forgotPassword(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockUser.update).toHaveBeenCalled();
      expect(emailService.sendResetPasswordEmail).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should handle email sending failure', async () => {
      mockRequest.body = { email: 'existing@example.com' };
      const mockUser = {
        update: jest.fn().mockResolvedValue(true),
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (emailService.sendResetPasswordEmail as jest.Mock).mockResolvedValue(false);

      await forgotPassword(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockUser.update).toHaveBeenCalledTimes(2); // Initial update and cleanup
      expect(mockNext).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Password reset error:',
        expect.any(Error)
      );
      expect(consoleErrorSpy.mock.calls[0][1].message).toBe(
        'Failed to send password reset email'
      );
    });

    it('should handle unexpected errors', async () => {
      mockRequest.body = { email: 'existing@example.com' };
      const mockError = new Error('Unexpected database error');
      (User.findOne as jest.Mock).mockRejectedValue(mockError);

      await forgotPassword(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Password reset error:',
        mockError
      );
    });
  });

  describe('resetPassword', () => {
    it('should reject password shorter than 6 characters', async () => {
      mockRequest.params = { token: 'validtoken' };
      mockRequest.body = { password: '12345' };

      await resetPassword(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Password must be at least 6 characters long',
      });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should handle invalid or expired token', async () => {
      mockRequest.params = { token: 'invalidtoken' };
      mockRequest.body = { password: 'validpassword123' };
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await resetPassword(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Password reset token is invalid or has expired',
      });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should successfully reset password with valid token', async () => {
      mockRequest.params = { token: 'validtoken' };
      mockRequest.body = { password: 'newpassword123' };
      const mockUser = {
        update: jest.fn().mockResolvedValue(true),
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      await resetPassword(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockUser.update).toHaveBeenCalledWith({
        password: 'newpassword123',
        reset_password_token: null,
        reset_password_expires: null,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Password has been reset successfully',
      });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });
});