import { Request, Response, NextFunction } from 'express';
import ProductController from '../../../controllers/product.controller';
import Product from '../../../models/product.model';
import { AppError } from '../../../middleware/error.middleware';
import sequelize from '../../../config/database';
import { Op } from 'sequelize';


jest.mock('sequelize', () => {
    const mSequelize = {
        Model: class {
            public static init() { return this; }
            public static belongsTo() { return this; }
            public static hasMany() { return this; }
            public static associate() { return this; }
        },
        DataTypes: {
            INTEGER: 'INTEGER',
            STRING: 'STRING',
            TEXT: 'TEXT',
            DECIMAL: 'DECIMAL',
            DATE: 'DATE',
            BOOLEAN: 'BOOLEAN'
        },
        Op: {
            iLike: 'iLike',
            or: 'or',
            gte: 'gte',
            lte: 'lte'
        }
    };
    return mSequelize;
});

jest.mock('../../../config/database', () => ({
    transaction: jest.fn(),
    authenticate: jest.fn(),
    sync: jest.fn(),
    close: jest.fn()
}));

// Mock the models
jest.mock('../../../models/product.model', () => {
    return {
        create: jest.fn(),
        findByPk: jest.fn(),
        findAndCountAll: jest.fn(),
        findAll: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn()
    };
});

jest.mock('../../../models/brand.model', () => {
    return {
        create: jest.fn(),
        findByPk: jest.fn(),
        findAndCountAll: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn()
    };
});

jest.mock('../../../models/category.model', () => {
    return {
        create: jest.fn(),
        findByPk: jest.fn(),
        findAndCountAll: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn()
    };
});

jest.mock('../../../models/product-specification.model', () => ({
    create: jest.fn(),
    upsert: jest.fn()
}));

jest.mock('../../../models/product-variant.model', () => ({
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
}));

jest.mock('../../../models/product-image.model', () => ({
    create: jest.fn(),
    destroy: jest.fn()
}));

jest.mock('../../../utils/database.utils', () => ({
    reorderProductIds: jest.fn().mockResolvedValue(undefined)
}));

describe('ProductController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRequest = {
            params: {},
            query: {},
            body: {}
        };
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        mockNext = jest.fn();
        jest.clearAllMocks();
    });

    describe('create', () => {
        const mockProductData = {
            name: 'Test Product',
            description: 'Test Description',
            price: 99.99,
            category_id: 1,
            brand_id: 1,
            specifications: {
                processor: 'Test Processor',
                ram: '8GB'
            },
            variants: [{
                sku: 'TEST-SKU-1',
                price: 99.99,
                stock_quantity: 10
            }],
            images: [{
                image_url: 'test-image.jpg',
                is_primary: true,
                display_order: 1
            }]
        };

        it('should create a product with all associated data successfully', async () => {
            const mockTransaction = {
                commit: jest.fn(),
                rollback: jest.fn()
            };
            (sequelize.transaction as jest.Mock).mockResolvedValue(mockTransaction);

            const mockCreatedProduct = {
                id: 1,
                ...mockProductData
            };
            (Product.create as jest.Mock).mockResolvedValue(mockCreatedProduct);
            (Product.findByPk as jest.Mock).mockResolvedValue(mockCreatedProduct);

            mockRequest.body = mockProductData;

            await ProductController.create(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(Product.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: mockProductData.name,
                    description: mockProductData.description,
                    price: mockProductData.price
                }),
                { transaction: mockTransaction }
            );
            expect(mockTransaction.commit).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(mockCreatedProduct);
        });

        it('should rollback transaction on error', async () => {
            const mockTransaction = {
                commit: jest.fn(),
                rollback: jest.fn()
            };
            (sequelize.transaction as jest.Mock).mockResolvedValue(mockTransaction);
            
            const mockError = new Error('Database error');
            (Product.create as jest.Mock).mockRejectedValue(mockError);

            mockRequest.body = mockProductData;

            await ProductController.create(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockTransaction.rollback).toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    describe('searchProducts', () => {
        it('should search products with given criteria', async () => {
            const mockProducts = {
                rows: [
                    { id: 1, name: 'Test Product 1' },
                    { id: 2, name: 'Test Product 2' }
                ],
                count: 2
            };
            (Product.findAndCountAll as jest.Mock).mockResolvedValue(mockProducts);
    
            // Update query parameters to match controller expectations
            mockRequest.query = {
                search: 'test',
                page: '1',
                limit: '10',
                sortBy: 'name',
                sortOrder: 'ASC',
                category: '1',
                brand: '2',
                minPrice: '10',
                maxPrice: '100'
            };
    
            await ProductController.searchProducts(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );
    
            // Updated expectations to match the actual implementation
            expect(Product.findAndCountAll).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        [Op.or]: [
                            { name: { [Op.iLike]: '%test%' } },
                            { description: { [Op.iLike]: '%test%' } },
                            { model_number: { [Op.iLike]: '%test%' } }
                        ],
                        category_id: '1',
                        brand_id: '2',
                        price: {
                            [Op.gte]: '10',
                            [Op.lte]: '100'
                        }
                    }),
                    limit: 10,
                    offset: 0,
                    order: [['name', 'ASC']],
                    include: expect.any(Array)
                })
            );
    
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                data: mockProducts.rows,
                pagination: {
                    page: 1,
                    limit: 10,
                    total: 2,
                    totalPages: 1
                }
            });
        });
    });

    describe('getById', () => {
        it('should return product by id', async () => {
            const mockProduct = {
                id: 1,
                name: 'Test Product'
            };
            (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

            mockRequest.params = { id: '1' };

            await ProductController.getById(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(Product.findByPk).toHaveBeenCalledWith('1', expect.any(Object));
            expect(mockResponse.json).toHaveBeenCalledWith(mockProduct);
        });

        it('should handle not found product', async () => {
            (Product.findByPk as jest.Mock).mockResolvedValue(null);

            mockRequest.params = { id: '999' };

            await ProductController.getById(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
        });
    });

    describe('update', () => {
        const mockUpdateData = {
            name: 'Updated Product',
            price: 149.99
        };

        it('should update product successfully', async () => {
            const mockTransaction = {
                commit: jest.fn(),
                rollback: jest.fn()
            };
            (sequelize.transaction as jest.Mock).mockResolvedValue(mockTransaction);

            const mockProduct = {
                id: 1,
                update: jest.fn().mockResolvedValue(true)
            };
            (Product.findByPk as jest.Mock)
                .mockResolvedValueOnce(mockProduct)
                .mockResolvedValueOnce({ ...mockProduct, ...mockUpdateData });

            mockRequest.params = { id: '1' };
            mockRequest.body = mockUpdateData;

            await ProductController.update(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockProduct.update).toHaveBeenCalledWith(mockUpdateData, { transaction: mockTransaction });
            expect(mockTransaction.commit).toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalled();
        });

        it('should handle update errors', async () => {
            const mockTransaction = {
                commit: jest.fn(),
                rollback: jest.fn()
            };
            (sequelize.transaction as jest.Mock).mockResolvedValue(mockTransaction);
            
            const mockError = new Error('Update error');
            (Product.findByPk as jest.Mock).mockRejectedValue(mockError);

            mockRequest.params = { id: '1' };
            mockRequest.body = mockUpdateData;

            await ProductController.update(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockTransaction.rollback).toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    describe('delete', () => {
        it('should delete product successfully', async () => {
            const mockTransaction = {
                commit: jest.fn(),
                rollback: jest.fn()
            };
            (sequelize.transaction as jest.Mock).mockResolvedValue(mockTransaction);

            const mockProduct = {
                id: 1,
                destroy: jest.fn().mockResolvedValue(true)
            };
            (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

            mockRequest.params = { id: '1' };

            await ProductController.delete(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockProduct.destroy).toHaveBeenCalledWith({ transaction: mockTransaction });
            expect(mockTransaction.commit).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(204);
        });

        it('should handle delete errors', async () => {
            const mockTransaction = {
                commit: jest.fn(),
                rollback: jest.fn()
            };
            (sequelize.transaction as jest.Mock).mockResolvedValue(mockTransaction);

            const mockError = new Error('Delete error');
            (Product.findByPk as jest.Mock).mockRejectedValue(mockError);

            mockRequest.params = { id: '1' };

            await ProductController.delete(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockTransaction.rollback).toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });
});