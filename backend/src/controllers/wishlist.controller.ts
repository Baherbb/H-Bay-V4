import { Request, Response, NextFunction } from 'express';
import Wishlist from '../models/wishlist.model';
import WishlistItem from '../models/wishlist-items.model';
import ProductVariant from '../models/product-variant.model';
import Product from '../models/product.model';
import ProductImage from '../models/product-image.model';
import Brand from '../models/brand.model';
import { AppError } from '../middleware/error.middleware';
import User from '../models/user.model';
import { Op } from 'sequelize';

export interface AuthRequest extends Request {
    user: User;
}

class WishlistController {
    private static getWishlistIncludes() {
        return [
            {
                model: ProductVariant,
                as: 'variant',
                include: [
                    {
                        model: Product,
                        as: 'product',
                        include: [
                            {
                                model: ProductImage,
                                as: 'images',
                                where: { is_primary: true },
                                required: false,
                                limit: 1
                            },
                            {
                                model: Brand,
                                as: 'brand',
                                attributes: ['id', 'name']
                            }
                        ],
                        attributes: ['id', 'name', 'price', 'description']
                    }
                ]
            }
        ];
    }

    async getWishlistItems(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as AuthRequest).user;
            if (!user) {
                throw new AppError('Unauthorized', 401);
            }
    
            const {
                page = 1,
                limit = 10,
                sortBy = 'added_at',
                sortOrder = 'DESC',
                brand,
                category,
                minPrice,
                maxPrice,
            } = req.query;
    
            const wishlist = await Wishlist.findOne({ where: { user_id: user.id } });
            if (!wishlist) {
                throw new AppError('Wishlist not found', 404);
            }
    
            const wishlist_id = wishlist.id;
            const offset = (Number(page) - 1) * Number(limit);
    
            const variantWhereClause: any = {};
            const productWhereClause: any = {};
    
            // Brand filtering
            if (brand) {
                variantWhereClause['$variant.product.brand_id'] = brand;
            }
    
            // Category filtering
            if (category) {
                variantWhereClause['$variant.product.category_id'] = category;
            }
    
            // Price filtering
            if (minPrice || maxPrice) {
                variantWhereClause['$variant.price$'] = {};
                if (minPrice) variantWhereClause['$variant.price$'][Op.gte] = minPrice;
                if (maxPrice) variantWhereClause['$variant.price$'][Op.lte] = maxPrice;
            }
    
            const validSortFields = ['priority', 'added_at', 'variant_price'];
            let actualSortBy = validSortFields.includes(sortBy as string) ? sortBy : 'added_at';
            let orderClause: any;
    
            if (actualSortBy === 'variant_price') {
                orderClause = [[{ model: ProductVariant, as: 'variant' }, 'price', sortOrder]];
            } else {
                orderClause = [[actualSortBy, sortOrder]];
            }
    
    
            const { count, rows: items } = await WishlistItem.findAndCountAll({
                where: { wishlist_id: wishlist_id, ...variantWhereClause },
                include: WishlistController.getWishlistIncludes(),
                order: orderClause, 
                limit: Number(limit),
                offset
            });
    
            res.status(200).json({
                success: true,
                items,
                total: count,
                page: Number(page),
                totalPages: Math.ceil(count / Number(limit)),
                itemsPerPage: Number(limit)
            });
        } catch (error) {
            next(error);
        }
    }
    
    async addItem(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as AuthRequest).user;
            if (!user) {
                throw new AppError('Unauthorized', 401);
            }
            const { variant_id, priority = 0 } = req.body; 

            const wishlist = await Wishlist.findOne({ where: { user_id: user.id } });

            if (!wishlist) {
                throw new AppError('Wishlist not found', 404);
            }

            const variant = await ProductVariant.findByPk(variant_id);
            if (!variant) {
                throw new AppError('Product variant not found', 404);
            }

            const [item, created] = await WishlistItem.findOrCreate({
                where: { wishlist_id: wishlist.id, variant_id },
                defaults: { wishlist_id: wishlist.id, variant_id, priority }
            });

            res.status(created ? 201 : 200).json({
                success: true,
                message: created ? 'Item added to wishlist successfully' : 'Item already exists in wishlist',
                item
            });
        } catch (error) {
            next(error);
        }
    }

    async updateItemPriority(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as AuthRequest).user;
            if (!user) {
                throw new AppError('Unauthorized', 401);
            }
            const { variant_id } = req.params;
            const { priority } = req.body;

            const wishlist = await Wishlist.findOne({ where: { user_id: user.id } });

            if (!wishlist) {
                throw new AppError('Wishlist not found', 404);
            }

            const item = await WishlistItem.findOne({
                where: { wishlist_id: wishlist.id, variant_id }
            });

            if (!item) {
                throw new AppError('Item not found in wishlist', 404);
            }

            await item.update({ priority });

            res.status(200).json({
                success: true,
                message: 'Wishlist item updated successfully',
                data: item
            });
        } catch (error) {
            next(error);
        }
    }

    async removeItem(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as AuthRequest).user;
            if (!user) {
                throw new AppError('Unauthorized', 401);
            }
            const { variant_id } = req.params;

            const wishlist = await Wishlist.findOne({ where: { user_id: user.id } });

            if (!wishlist) {
                throw new AppError('Wishlist not found', 404);
            }

            await WishlistItem.destroy({
                where: { wishlist_id: wishlist.id, variant_id }
            });

            res.status(200).json({
                success: true,
                message: 'Item removed from wishlist successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    async clearWishlist(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as AuthRequest).user;
            if (!user) {
                throw new AppError('Unauthorized', 401);
            }

            const wishlist = await Wishlist.findOne({ where: { user_id: user.id } });

            if (!wishlist) {
                throw new AppError('Wishlist not found', 404);
            }

            await WishlistItem.destroy({ where: { wishlist_id: wishlist.id } });

            res.status(200).json({
                success: true,
                message: 'Wishlist cleared successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new WishlistController();