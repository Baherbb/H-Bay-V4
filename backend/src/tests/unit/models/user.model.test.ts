import { Sequelize, Model, DataTypes, ModelStatic, Association } from 'sequelize';
import bcrypt from 'bcryptjs';
import User, { UserAttributes, UserType } from '../../../models/user.model';

// Create mock types and values first
const mockDataTypes = {
    STRING: jest.fn().mockImplementation(() => ({ type: 'STRING' })),
    INTEGER: jest.fn().mockImplementation(() => ({ type: 'INTEGER' })),
    ENUM: jest.fn().mockImplementation(() => ({ type: 'ENUM' })),
    DATE: jest.fn().mockImplementation(() => ({ type: 'DATE' })),
    NOW: 'CURRENT_TIMESTAMP'
};

// Define interface for mock user
interface MockUser {
    id?: number;
    name?: string;
    email?: string;
    password?: string | null;
    user_type?: UserType;
    changed: jest.Mock;
    comparePassword: (candidatePassword: string) => Promise<boolean>;
}

// Define interface for model associations
interface MockAssociations {
    [key: string]: Association;
}

// Define mock model class with proper typing
class MockModelClass extends Model {
    static init = jest.fn().mockReturnThis();
    static associations: MockAssociations = {};
}

// Mock Sequelize first
jest.mock('sequelize', () => {
    const actualSequelize = jest.requireActual('sequelize');
    return {
        ...actualSequelize,
        Sequelize: jest.fn(() => ({
            Model: MockModelClass,
            DataTypes: mockDataTypes
        })),
        Model: MockModelClass,
        DataTypes: mockDataTypes
    };
});

// Mock database configuration
jest.mock('../../../config/database', () => ({
    __esModule: true,
    default: new (jest.requireActual('sequelize').Sequelize)()
}));

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
    genSalt: jest.fn(),
    hash: jest.fn(),
    compare: jest.fn()
}));

describe('User Model', () => {
    let mockUser: MockUser;

    beforeEach(() => {
        jest.clearAllMocks();
        mockUser = {
            id: 1,
            password: 'hashed-password',
            changed: jest.fn(),
            comparePassword: User.prototype.comparePassword
        };
    });

    describe('Model Initialization', () => {
        it('should initialize with correct options', () => {
            const initOptions = User.getAttributes();
            expect(initOptions).toBeDefined();
            expect(User.options).toEqual(
                expect.objectContaining({
                    schema: 'public',
                    timestamps: true,
                    underscored: true,
                    freezeTableName: true
                })
            );
        });
    });

    describe('Attributes', () => {
        it('should define email attribute correctly', () => {
            const attributes = User.getAttributes();
            expect(attributes.email).toEqual(
                expect.objectContaining({
                    allowNull: false,
                    unique: true,
                    validate: { isEmail: true }
                })
            );
        });

        it('should define user_type attribute correctly', () => {
            const attributes = User.getAttributes();
            expect(attributes.user_type.values).toEqual([
                'customer',
                'employee',
                'admin',
                'super_admin'
            ]);
        });
    });

    describe('Password Hooks', () => {
        it('should hash password before create', async () => {
            const mockSalt = 'mock-salt';
            const mockHash = 'hashed-password';
            (bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt);
            (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

            const user: MockUser = {
                password: 'password123',
                changed: jest.fn(),
                comparePassword: User.prototype.comparePassword
            };

            await User.options.hooks?.beforeCreate?.(user as any, {} as any);

            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', mockSalt);
            expect(user.password).toBe(mockHash);
        });

        it('should hash password before update when changed', async () => {
            const mockSalt = 'mock-salt';
            const mockHash = 'new-hashed-password';
            (bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt);
            (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

            const user: MockUser = {
                password: 'newpassword123',
                changed: jest.fn().mockReturnValue(true),
                comparePassword: User.prototype.comparePassword
            };

            await User.options.hooks?.beforeUpdate?.(user as any, {} as any);

            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', mockSalt);
            expect(user.password).toBe(mockHash);
        });
    });

    describe('Instance Methods', () => {
        it('should compare password successfully', async () => {
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            const result = await mockUser.comparePassword('password123');

            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed-password');
            expect(result).toBe(true);
        });

        it('should handle null password comparison', async () => {
            mockUser.password = null;
            const result = await mockUser.comparePassword('password123');
            
            expect(result).toBe(false);
            expect(bcrypt.compare).not.toHaveBeenCalled();
        });
    });
});