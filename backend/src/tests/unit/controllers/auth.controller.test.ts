import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
    register,
    login,
    logout,
    refreshToken,
    googleCallback,
    facebookCallback
} from '../../../controllers/auth.controller';
import { authMiddleware, requireRole } from '../../../middleware/auth.middleware';
import User from '../../../models/user.model';
import Cart from '../../../models/cart.model';
import Wishlist from '../../../models/wishlist.model';
import { JWT_SECRET, REFRESH_TOKEN_SECRET } from '../../../config/constants';

// Mocking dependencies
jest.mock('../../../models/user.model');
jest.mock('../../../models/cart.model');
jest.mock('../../../models/wishlist.model');
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

// Mock console.error to suppress it during tests
const originalConsoleError = console.error;
beforeAll(() => {
    console.error = jest.fn();
});

afterAll(() => {
    console.error = originalConsoleError;
});

describe('Auth Controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();

    beforeEach(() => {
        mockRequest = {
            body: {},
            cookies: {},
            headers: {},
        };
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            cookie: jest.fn(),
            clearCookie: jest.fn(),
        };
        jest.clearAllMocks();
    });

    describe('register', () => {
        const registerData = {
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User',
            phone: '1234567890'
        };

        it('should successfully register a new user', async () => {
            mockRequest.body = registerData;
            const mockUser = {
                id: 1,
                ...registerData,
                user_type: 'customer',
                toJSON: () => ({ id: 1, ...registerData, user_type: 'customer' })
            };

            (User.findOne as jest.Mock).mockResolvedValue(null);
            (User.create as jest.Mock).mockResolvedValue(mockUser);
            (Cart.create as jest.Mock).mockResolvedValue({});
            (Wishlist.create as jest.Mock).mockResolvedValue({});
            (jwt.sign as jest.Mock).mockReturnValue('mock_token');

            await register(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(User.create).toHaveBeenCalled();
            expect(Cart.create).toHaveBeenCalled();
            expect(Wishlist.create).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 'success',
                    data: expect.objectContaining({
                        user: expect.any(Object),
                        token: expect.any(String)
                    })
                })
            );
        });

        it('should return error if email already exists', async () => {
            mockRequest.body = registerData;
            (User.findOne as jest.Mock).mockResolvedValue({ id: 1 });

            await register(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'error',
                message: 'Email already registered'
            });
        });
    });

    describe('login', () => {
        const loginData = {
            email: 'test@example.com',
            password: 'password123'
        };

        it('should successfully login user with valid credentials', async () => {
            mockRequest.body = loginData;
            const mockUser = {
                id: 1,
                ...loginData,
                user_type: 'customer',
                comparePassword: jest.fn().mockResolvedValue(true),
                toJSON: () => ({ id: 1, ...loginData, user_type: 'customer' })
            };

            (User.findOne as jest.Mock).mockResolvedValue(mockUser);
            (jwt.sign as jest.Mock).mockReturnValue('mock_token');

            await login(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 'success',
                    data: expect.objectContaining({
                        token: expect.any(String)
                    })
                })
            );
        });

        it('should return error for invalid credentials', async () => {
            mockRequest.body = loginData;
            const mockUser = {
                comparePassword: jest.fn().mockResolvedValue(false)
            };

            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            await login(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'error',
                message: 'Invalid email or password'
            });
        });
    });

    describe('refreshToken', () => {
        it('should successfully refresh token with valid refresh token', async () => {
            mockRequest.cookies = { refreshToken: 'valid_refresh_token' };
            const mockUser = {
                id: 1,
                email: 'test@example.com',
                user_type: 'customer'
            };

            (jwt.verify as jest.Mock).mockReturnValue({ id: 1 });
            (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
            (jwt.sign as jest.Mock).mockReturnValue('new_token');

            await refreshToken(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 'success',
                    data: expect.objectContaining({
                        token: expect.any(String)
                    })
                })
            );
        });

        it('should return error for invalid refresh token', async () => {
            mockRequest.cookies = { refreshToken: 'invalid_token' };
            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new Error('Invalid token');
            });

            await refreshToken(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'error',
                message: 'Invalid refresh token'
            });
        });
    });

    describe('logout', () => {
        it('should successfully logout user', async () => {
            await logout(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.clearCookie).toHaveBeenCalledWith('refreshToken', expect.any(Object));
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message: 'Successfully logged out'
            });
        });
    });
});

describe('Auth Middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();

    beforeEach(() => {
        mockRequest = {
            headers: {},
        };
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();
    });

    describe('Token Validation', () => {
        it('should allow access with valid token', async () => {
            mockRequest.headers = {
                authorization: 'Bearer valid_token'
            };
            const mockUser = { id: 1, email: 'test@example.com' };

            (jwt.verify as jest.Mock).mockReturnValue({ id: 1 });
            (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

            await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalled();
            expect(mockRequest.user).toEqual(mockUser);
        });

        it('should handle missing authorization header', async () => {
            mockRequest.headers = {};

            await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                message: 'No valid authorization header found'  // Updated message
            });
            expect(nextFunction).not.toHaveBeenCalled();
        });

        it('should handle invalid authorization header format', async () => {
            mockRequest.headers = {
                authorization: 'InvalidFormat token'
            };

            await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                message: 'No valid authorization header found'  // Updated message
            });
            expect(nextFunction).not.toHaveBeenCalled();
        });

        it('should handle JWT verification error', async () => {
            mockRequest.headers = {
                authorization: 'Bearer invalid_token'
            };

            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new Error('Invalid token');
            });

            await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(console.error).toHaveBeenCalledWith('JWT Verification Error:', expect.any(Error));
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                message: 'Invalid or expired token'
            });
            expect(nextFunction).not.toHaveBeenCalled();
        });

        it('should handle malformed JWT token', async () => {
            mockRequest.headers = {
                authorization: 'Bearer malformed.token'
            };

            // Create an actual JsonWebTokenError instance
            const jwtError = new jwt.JsonWebTokenError('jwt malformed');

            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw jwtError;
            });

            await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(console.error).toBeCalledWith('JWT Verification Error:', jwtError);
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                message: 'Invalid or expired token'
            });
            expect(nextFunction).not.toHaveBeenCalled();
        });
    });

    describe('requireRole', () => {
        it('should allow access for user with required role', () => {
            mockRequest.user = {
                user_type: 'admin'
            } as any;

            const middleware = requireRole(['admin']);
            middleware(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalled();
        });

        it('should deny access for user without required role', () => {
            mockRequest.user = {
                user_type: 'customer'
            } as any;

            const middleware = requireRole(['admin']);
            middleware(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'error',
                message: 'Unauthorized access'
            });
        });
    });
});

describe('Social Authentication', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();

    beforeEach(() => {
        mockRequest = {
            user: undefined,
            cookies: {},
        };
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            cookie: jest.fn(),
            redirect: jest.fn(),
        };
        jest.clearAllMocks();
    });

    describe('googleCallback', () => {
        it('should successfully authenticate Google user and create cart/wishlist if not exists', async () => {
            const mockUser = {
                id: 1,
                email: 'test@gmail.com',
                name: 'Test User',
                user_type: 'customer'
            };

            mockRequest.user = mockUser;

            (Cart.findOne as jest.Mock).mockResolvedValue(null);
            (Wishlist.findOne as jest.Mock).mockResolvedValue(null);
            (Cart.create as jest.Mock).mockResolvedValue({});
            (Wishlist.create as jest.Mock).mockResolvedValue({});
            (jwt.sign as jest.Mock).mockReturnValueOnce('access_token').mockReturnValueOnce('refresh_token');

            await googleCallback(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(Cart.create).toHaveBeenCalledWith({ user_id: mockUser.id });
            expect(Wishlist.create).toHaveBeenCalledWith({ user_id: mockUser.id });
            expect(mockResponse.cookie).toHaveBeenCalledWith(
                'refreshToken',
                'refresh_token',
                expect.any(Object)
            );
            expect(mockResponse.redirect).toHaveBeenCalledWith(
                expect.stringContaining('/auth/callback?token=access_token&provider=google')
            );
        });

        it('should not create cart/wishlist if they already exist', async () => {
            const mockUser = {
                id: 1,
                email: 'test@gmail.com',
                name: 'Test User',
                user_type: 'customer'
            };

            mockRequest.user = mockUser;

            (Cart.findOne as jest.Mock).mockResolvedValue({ id: 1 });
            (Wishlist.findOne as jest.Mock).mockResolvedValue({ id: 1 });
            (jwt.sign as jest.Mock).mockReturnValueOnce('access_token').mockReturnValueOnce('refresh_token');

            await googleCallback(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(Cart.create).not.toHaveBeenCalled();
            expect(Wishlist.create).not.toHaveBeenCalled();
            expect(mockResponse.redirect).toHaveBeenCalledWith(
                expect.stringContaining('/auth/callback?token=access_token&provider=google')
            );
        });

        it('should handle authentication failure', async () => {
            mockRequest.user = undefined;

            await googleCallback(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.redirect).toHaveBeenCalledWith(
                expect.stringContaining('/auth/callback?error=authentication_failed&provider=google')
            );
        });
    });

    describe('facebookCallback', () => {
        it('should successfully authenticate Facebook user and create cart/wishlist if not exists', async () => {
            const mockUser = {
                id: 1,
                email: 'test@facebook.com',
                name: 'Test User',
                user_type: 'customer'
            };

            mockRequest.user = mockUser;

            (Cart.findOne as jest.Mock).mockResolvedValue(null);
            (Wishlist.findOne as jest.Mock).mockResolvedValue(null);
            (Cart.create as jest.Mock).mockResolvedValue({});
            (Wishlist.create as jest.Mock).mockResolvedValue({});
            (jwt.sign as jest.Mock).mockReturnValueOnce('access_token').mockReturnValueOnce('refresh_token');

            await facebookCallback(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(Cart.create).toHaveBeenCalledWith({ user_id: mockUser.id });
            expect(Wishlist.create).toHaveBeenCalledWith({ user_id: mockUser.id });
            expect(mockResponse.cookie).toHaveBeenCalledWith(
                'refreshToken',
                'refresh_token',
                expect.any(Object)
            );
            expect(mockResponse.redirect).toHaveBeenCalledWith(
                expect.stringContaining('/auth/callback?token=access_token&provider=facebook')
            );
        });

        it('should not create cart/wishlist if they already exist', async () => {
            const mockUser = {
                id: 1,
                email: 'test@facebook.com',
                name: 'Test User',
                user_type: 'customer'
            };

            mockRequest.user = mockUser;

            (Cart.findOne as jest.Mock).mockResolvedValue({ id: 1 });
            (Wishlist.findOne as jest.Mock).mockResolvedValue({ id: 1 });
            (jwt.sign as jest.Mock).mockReturnValueOnce('access_token').mockReturnValueOnce('refresh_token');

            await facebookCallback(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(Cart.create).not.toHaveBeenCalled();
            expect(Wishlist.create).not.toHaveBeenCalled();
            expect(mockResponse.redirect).toHaveBeenCalledWith(
                expect.stringContaining('/auth/callback?token=access_token&provider=facebook')
            );
        });

        it('should handle authentication failure', async () => {
            mockRequest.user = undefined;

            await facebookCallback(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.redirect).toHaveBeenCalledWith(
                expect.stringContaining('/auth/callback?error=authentication_failed&provider=facebook')
            );
        });
    });
});