import { Request, Response, NextFunction } from 'express';
import Brand from '../models/brand.model';
import {AppError} from '../middleware/error.middleware';

export default class BrandController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const brand = await Brand.create(req.body);
            res.status(201).json(brand);
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const brands = await Brand.findAll({
                include: [{
                    association: 'products',
                    attributes: ['id', 'name']
                }]
            });
            res.status(200).json(brands);
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const brand = await Brand.findByPk(req.params.id, {
                include: [{
                    association: 'products',
                    attributes: ['id', 'name']
                }]
            });

            if (!brand) {
                throw new AppError('Brand not found', 404);
            }

            res.status(200).json(brand);
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const brand = await Brand.findByPk(req.params.id);

            if (!brand) {
                throw new AppError('Brand not found', 404);
            }

            await brand.update(req.body);
            res.status(200).json(brand);
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const brand = await Brand.findByPk(req.params.id);

            if (!brand) {
                throw new AppError('Brand not found', 404);
            }

            await brand.destroy();
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

