import { Request, Response, NextFunction } from 'express';
import BrandController from '../../../controllers/brand.controller';
import Brand from '../../../models/brand.model';
import { AppError } from '../../../middleware/error.middleware';

jest.mock('../../../models/brand.model');

describe('BrandController', () => {
    let brandController: BrandController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;

    beforeEach(() => {
        brandController = new BrandController();
        mockRequest = {
            body: {},
            params: {}
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };
        nextFunction = jest.fn();

        jest.clearAllMocks();
    });

    describe('create', () => {
        const mockBrand = {
            id: 1,
            name: 'Test Brand',
            logo_url: 'http://apple.com/logo.png',
            description: 'Test Description'
        };

        it('should create a brand successfully', async () => {
            mockRequest.body = mockBrand;
            (Brand.create as jest.Mock).mockResolvedValue(mockBrand);

            await brandController.create(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(Brand.create).toHaveBeenCalledWith(mockBrand);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(mockBrand);
        });

        it('should handle errors during brand creation', async () => {
            const error = new Error('Database error');
            (Brand.create as jest.Mock).mockRejectedValue(error);

            await brandController.create(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalledWith(error);
        });
    });

    describe('getAll', () => {
        const mockBrands = [
            {
                id: 1,
                name: 'Brand 1',
                products: [{ id: 1, name: 'Product 1' }]
            },
            {
                id: 2,
                name: 'Brand 2',
                products: [{ id: 2, name: 'Product 2' }]
            }
        ];

        it('should get all brands successfully', async () => {
            (Brand.findAll as jest.Mock).mockResolvedValue(mockBrands);

            await brandController.getAll(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(Brand.findAll).toHaveBeenCalledWith({
                include: [{
                    association: 'products',
                    attributes: ['id', 'name']
                }]
            });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockBrands);
        });

        it('should handle errors when getting all brands', async () => {
            const error = new Error('Database error');
            (Brand.findAll as jest.Mock).mockRejectedValue(error);

            await brandController.getAll(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalledWith(error);
        });
    });

    describe('getById', () => {
        const mockBrand = {
            id: 1,
            name: 'Test Brand',
            products: [{ id: 1, name: 'Product 1' }]
        };

        it('should get brand by id successfully', async () => {
            mockRequest.params = { id: '1' };
            (Brand.findByPk as jest.Mock).mockResolvedValue(mockBrand);

            await brandController.getById(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(Brand.findByPk).toHaveBeenCalledWith('1', {
                include: [{
                    association: 'products',
                    attributes: ['id', 'name']
                }]
            });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockBrand);
        });

        it('should handle brand not found', async () => {
            mockRequest.params = { id: '999' };
            (Brand.findByPk as jest.Mock).mockResolvedValue(null);

            await brandController.getById(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalledWith(
                expect.any(AppError)
            );
        });
    });

    describe('update', () => {
        const mockBrand = {
            id: 1,
            name: 'Test Brand',
            update: jest.fn()
        };

        it('should update brand successfully', async () => {
            mockRequest.params = { id: '1' };
            mockRequest.body = { name: 'Updated Brand' };
            (Brand.findByPk as jest.Mock).mockResolvedValue(mockBrand);
            mockBrand.update.mockResolvedValue({ ...mockBrand, name: 'Updated Brand' });

            await brandController.update(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(Brand.findByPk).toHaveBeenCalledWith('1');
            expect(mockBrand.update).toHaveBeenCalledWith(mockRequest.body);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockBrand);
        });

        it('should handle brand not found during update', async () => {
            mockRequest.params = { id: '999' };
            (Brand.findByPk as jest.Mock).mockResolvedValue(null);

            await brandController.update(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalledWith(
                expect.any(AppError)
            );
        });
    });

    describe('delete', () => {
        const mockBrand = {
            id: 1,
            name: 'Test Brand',
            destroy: jest.fn()
        };

        it('should delete brand successfully', async () => {
            mockRequest.params = { id: '1' };
            (Brand.findByPk as jest.Mock).mockResolvedValue(mockBrand);
            mockBrand.destroy.mockResolvedValue(undefined);

            await brandController.delete(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(Brand.findByPk).toHaveBeenCalledWith('1');
            expect(mockBrand.destroy).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.send).toHaveBeenCalled();
        });

        it('should handle brand not found during deletion', async () => {
            mockRequest.params = { id: '999' };
            (Brand.findByPk as jest.Mock).mockResolvedValue(null);

            await brandController.delete(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalledWith(
                expect.any(AppError)
            );
        });
    });
});