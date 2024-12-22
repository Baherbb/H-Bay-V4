import { Request, Response, NextFunction } from 'express';
import Product from '../models/product.model';
import ProductSpecification from '../models/product-specification.model';
import ProductVariant from '../models/product-variant.model';
import ProductImage from '../models/product-image.model';
import Brand from '../models/brand.model';
import Category from '../models/category.model';
import ProductCompatibility from '../models/product-compatibility.model';
import { AppError } from '../middleware/error.middleware';
import sequelize from '../config/database';
import { Op } from 'sequelize';
import { reorderProductIds } from '../utils/database.utils';

class ProductController {
    async create(req: Request, res: Response, next: NextFunction) {
        const transaction = await sequelize.transaction();
        let isCommitted = false
        try {
            const {
                name, description, price, category_id, brand_id,
                model_number, release_date, warranty_info, weight, dimensions,
                specifications, variants, images
            } = req.body;

            const product = await Product.create({
                name, description, price, category_id, brand_id,
                model_number, release_date, warranty_info, weight, dimensions
            }, { transaction });

            if (specifications) {
                await ProductSpecification.create({
                    ...specifications,
                    product_id: product.id
                }, { transaction });
            }

            if (variants && Array.isArray(variants)) {
                await Promise.all(variants.map(variant =>
                    ProductVariant.create({
                        ...variant,
                        product_id: product.id
                    }, { transaction })
                ));
            }

            if (images && Array.isArray(images)) {
                await Promise.all(images.map(image =>
                    ProductImage.create({
                        ...image,
                        product_id: product.id
                    }, { transaction })
                ));
            }

            await transaction.commit();
            isCommitted = true

            const createdProduct = await Product.findByPk(product.id, {
                include: ProductController.getFullProductIncludes()
            });

            res.status(201).json(createdProduct);
        } catch (error) {
            if(! isCommitted) {
                await transaction.rollback();
            }
            next(error);
        }
    }
    async searchProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                search = '',
                page = 1,
                limit = 10,
                sortBy = 'name',
                sortOrder = 'ASC',
                category,
                brand,
                minPrice,
                maxPrice,
                tech_category
            } = req.query;

            const offset = (Number(page) - 1) * Number(limit);
            const where: any = {};

            if (search) {
                where[Op.or] = [
                    { name: { [Op.iLike]: `%${search}%` } },
                    { description: { [Op.iLike]: `%${search}%` } },
                    { model_number: { [Op.iLike]: `%${search}%` } }
                ];
            }

            if (category) where.category_id = category;
            if (brand) where.brand_id = brand;
            if (tech_category) where.tech_category = tech_category;
            if (minPrice || maxPrice) {
                where.price = {};
                if (minPrice) where.price[Op.gte] = minPrice;
                if (maxPrice) where.price[Op.lte] = maxPrice;
            }

            const products = await Product.findAndCountAll({
                where,
                include: ProductController.getFullProductIncludes(),
                order: [[sortBy as string, sortOrder as string]],
                limit: Number(limit),
                offset
            });

            res.status(200).json({
                data: products.rows,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: products.count,
                    totalPages: Math.ceil(products.count / Number(limit))
                }
            });
        } catch (error) {
            next(error);
        }
    }

    private static getFullProductIncludes() {
        return [
            {
                model: Category,
                as: 'productCategory',
                attributes: ['id', 'name']
            },
            {
                model: Brand,
                as: 'brand',
                attributes: ['id', 'name']
            },
            {
                model: ProductSpecification,
                as: 'specifications'
            },
            {
                model: ProductVariant,
                as: 'variants',
                include: [{
                    model: ProductImage,
                    as: 'images'
                }]
            },
            {
                model: ProductImage,
                as: 'images'
            },
            {
                model: ProductCompatibility,
                as: 'compatibility',
                include: [{
                    model: Product,
                    as: 'compatibleWith',
                    attributes: ['id', 'name']
                }]
            }
        ];
    }

    async getSortedProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                page = 1,
                limit = 10,
                sortBy = 'name',
                sortOrder = 'ASC',
                category,
                brand,
                minPrice,
                maxPrice,
                tech_category
            } = req.query;

            const offset = (Number(page) - 1) * Number(limit);
            const where: any = {};

            if (category) where.category_id = category;
            if (brand) where.brand_id = brand;
            if (tech_category) where.tech_category = tech_category;
            if (minPrice || maxPrice) {
                where.price = {};
                if (minPrice) where.price.$gte = minPrice;
                if (maxPrice) where.price.$lte = maxPrice;
            }

            const products = await Product.findAndCountAll({
                where,
                include: ProductController.getFullProductIncludes(),
                order: [[sortBy as string, sortOrder as string]],
                limit: Number(limit),
                offset
            });
            console.log('Fetched products:', products);
            res.status(200).json({
                products: products.rows,
                total: products.count,
                page: Number(page),
                totalPages: Math.ceil(products.count / Number(limit))
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            console.log(this);
            const product = await Product.findByPk(req.params.id, {
                include: ProductController.getFullProductIncludes()
            });

            if (!product) {
                throw new AppError('Product not found', 404);
            }

            res.json(product);
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const transaction = await sequelize.transaction();
        let isCommitted = false
        try {
            const { specifications, variants, images, ...productData } = req.body;
            const product = await Product.findByPk(req.params.id);

            if (!product) {
                throw new AppError('Product not found', 404);
            }

            await product.update(productData, { transaction });

            if (specifications) {
                await ProductSpecification.upsert({
                    ...specifications,
                    product_id: product.id
                }, { transaction });
            }

            if (variants && Array.isArray(variants)) {
                await Promise.all(variants.map(async variant => {
                    if (variant.id) {
                        await ProductVariant.update(variant, {
                            where: { id: variant.id, product_id: product.id },
                            transaction
                        });
                    } else {
                        await ProductVariant.create({
                            ...variant,
                            product_id: product.id
                        }, { transaction });
                    }
                }));
            }
            if (images && Array.isArray(images)) {
                await ProductImage.destroy({
                    where: { product_id: product.id },
                    transaction
                });
            
                await Promise.all(images.map(image =>
                    ProductImage.create({
                        ...image,
                        product_id: product.id
                    }, { transaction })
                ));
            }
            

            await transaction.commit();
            isCommitted = true
            const updatedProduct = await Product.findByPk(product.id, {
                include: ProductController.getFullProductIncludes()
            });

            res.json(updatedProduct);
        } catch (error) {
            if(! isCommitted){
                await transaction.rollback();
            }
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const transaction = await sequelize.transaction();
        let isCommitted = false;
        try {
            const product = await Product.findByPk(req.params.id);
    
            if (!product) {
                throw new AppError('Product not found', 404);
            }
    
            // First delete the product
            await product.destroy({ transaction });
            
            // Commit the transaction for the delete operation
            await transaction.commit();
            isCommitted = true;
    
            try {
                await reorderProductIds();
                res.status(204).send();
            } catch (reorderError) {
                console.error('Error reordering product IDs:', reorderError);
                // Even if reordering fails, the delete was successful
                res.status(204).send();
            }
        } catch (error) {
            if (!isCommitted) {
                await transaction.rollback();
            }
            next(error);
        }
    }
}

export default new ProductController();