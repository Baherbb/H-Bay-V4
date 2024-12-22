import { Request, Response, NextFunction } from 'express';
import CategoryController from '../../../controllers/category.controller';
import Category from '../../../models/category.model';
import { AppError } from '../../../middleware/error.middleware';
import User from '../../../models/user.model';

jest.mock('../../../models/category.model');

describe('CategoryController', () => {
    let categoryController: CategoryController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;

    beforeEach(() => {
        categoryController = new CategoryController();
        mockRequest = {
            user: {
                id: 1,
                email: 'admin@test.com',
                user_type: 'admin'
            } as User
        };
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        nextFunction = jest.fn();
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new category successfully', async () => {
            const categoryData = {
                name: 'Test Category',
                description: 'Test Description',
                image_url: 'http://test.com/image.jpg',
                parent_category_id: null,
            };

            const mockCreatedCategory = {
                id: 1,
                ...categoryData
            };

            mockRequest.body = categoryData;
            (Category.create as jest.Mock).mockResolvedValue(mockCreatedCategory);
            (Category.findByPk as jest.Mock).mockResolvedValue(null);

            await categoryController.create(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(Category.create).toHaveBeenCalledWith(categoryData);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(mockCreatedCategory);
        });

        it('should throw error if parent category does not exist', async () => {
            const categoryData = {
                name: 'Test Category',
                description: 'Test Description',
                parent_category_id: 999,
            };

            mockRequest.body = categoryData;
            (Category.findByPk as jest.Mock).mockResolvedValue(null);

            await categoryController.create(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Parent Category not Found',
                    statusCode: 404,
                })
            );
            expect(Category.create).not.toHaveBeenCalled();
        });

        it('should handle duplicate category name', async () => {
            const categoryData = {
                name: 'Existing Category',
                description: 'Test Description',
            };

            mockRequest.body = categoryData;
            const error = new Error();
            error.name = 'SequelizeUniqueConstraintError';
            (Category.create as jest.Mock).mockRejectedValue(error);

            await categoryController.create(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Category name already exists',
                    statusCode: 400,
                })
            );
        });
    });

    describe('update', () => {
        it('should update category successfully', async () => {
            const updateData = {
                name: 'Updated Category',
                description: 'Updated Description',
            };

            const mockExistingCategory = {
                id: 1,
                name: 'Original Category',
                description: 'Original Description',
                update: jest.fn().mockResolvedValue({
                    id: 1,
                    ...updateData
                }),
            };

            mockRequest.params = { id: '1' };
            mockRequest.body = updateData;
            (Category.findByPk as jest.Mock).mockResolvedValue(mockExistingCategory);

            await categoryController.update(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockExistingCategory.update).toHaveBeenCalledWith({
                ...updateData,
                parent_category_id: undefined,
            });
            expect(mockResponse.json).toHaveBeenCalled();
        });

        it('should throw error if category not found', async () => {
            mockRequest.params = { id: '999' };
            mockRequest.body = {
                name: 'Updated Category',
            };
            (Category.findByPk as jest.Mock).mockResolvedValue(null);

            await categoryController.update(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Category not found',
                    statusCode: 404,
                })
            );
        });

        it('should throw error if parent category does not exist', async () => {
            const updateData = {
                name: 'Updated Category',
                parent_category_id: 999,
            };

            const mockExistingCategory = {
                id: 1,
                name: 'Original Category',
                update: jest.fn(),
            };

            mockRequest.params = { id: '1' };
            mockRequest.body = updateData;
            (Category.findByPk as jest.Mock)
                .mockResolvedValueOnce(mockExistingCategory) // First call for finding the category to update
                .mockResolvedValueOnce(null); // Second call for finding the parent category

            await categoryController.update(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Parent category not found',
                    statusCode: 404,
                })
            );
            expect(mockExistingCategory.update).not.toHaveBeenCalled();
        });
    });

    describe('delete', () => {
        it('should delete category successfully', async () => {
            const mockCategory = {
                id: 1,
                children: [],
                destroy: jest.fn().mockResolvedValue(undefined),
            };

            mockRequest.params = { id: '1' };
            (Category.findByPk as jest.Mock).mockResolvedValue(mockCategory);

            await categoryController.delete(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockCategory.destroy).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(204);
        });

        it('should throw error if category not found', async () => {
            mockRequest.params = { id: '999' };
            (Category.findByPk as jest.Mock).mockResolvedValue(null);

            await categoryController.delete(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Category not found',
                    statusCode: 404,
                })
            );
        });

        it('should not delete category with children', async () => {
            const mockCategory = {
                id: 1,
                children: [{ id: 2 }],
                destroy: jest.fn(),
            };

            mockRequest.params = { id: '1' };
            (Category.findByPk as jest.Mock).mockResolvedValue(mockCategory);

            await categoryController.delete(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Cannot delete category with subcategories',
                    statusCode: 400,
                })
            );
            expect(mockCategory.destroy).not.toHaveBeenCalled();
        });
    });

    describe('getAll', () => {
        it('should return all categories', async () => {
            const mockCategories = [
                { id: 1, name: 'Category 1' },
                { id: 2, name: 'Category 2' },
            ];

            (Category.findAll as jest.Mock).mockResolvedValue(mockCategories);

            await categoryController.getAll(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(Category.findAll).toHaveBeenCalledWith({
                include: [
                    {
                        model: Category,
                        as: 'parent',
                        attributes: ['id', 'name'],
                    },
                    {
                        model: Category,
                        as: 'children',
                        attributes: ['id', 'name'],
                    },
                ],
                order: [['name', 'ASC']],
            });
            expect(mockResponse.json).toHaveBeenCalledWith(mockCategories);
        });

        it('should handle database errors', async () => {
            const error = new Error('Database error');
            (Category.findAll as jest.Mock).mockRejectedValue(error);

            await categoryController.getAll(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalledWith(error);
        });
    });

    describe('getById', () => {
        it('should return category by id', async () => {
            const mockCategory = {
                id: 1,
                name: 'Test Category',
            };

            mockRequest.params = { id: '1' };
            (Category.findByPk as jest.Mock).mockResolvedValue(mockCategory);

            await categoryController.getById(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(Category.findByPk).toHaveBeenCalledWith('1', {
                include: [
                    {
                        model: Category,
                        as: 'parent',
                        attributes: ['id', 'name'],
                    },
                    {
                        model: Category,
                        as: 'children',
                        attributes: ['id', 'name'],
                    },
                ],
            });
            expect(mockResponse.json).toHaveBeenCalledWith(mockCategory);
        });

        it('should throw error if category not found', async () => {
            mockRequest.params = { id: '999' };
            (Category.findByPk as jest.Mock).mockResolvedValue(null);

            await categoryController.getById(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Category not Found',
                    statusCode: 404,
                })
            );
        });
    });
});