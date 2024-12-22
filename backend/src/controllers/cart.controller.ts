import { Request, Response, NextFunction } from 'express';
import Cart from '../models/cart.model';
import CartItem from '../models/cart-items.model';
import ProductVariant from '../models/product-variant.model';
import Product from '../models/product.model';
import ProductImage from '../models/product-image.model';
import Brand from '../models/brand.model';
import { AppError } from '../middleware/error.middleware';
import User from '../models/user.model';

export interface AuthRequest extends Request {
    user: User;
}

class CartController {
    private static getCartIncludes() {
        return [
            {
                model: CartItem,
                as: 'cartItems',
                include: [
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
                                        limit: 1,
                                    },
                                    {
                                        model: Brand,
                                        as: 'brand',
                                        attributes: ['id', 'name'],
                                    },
                                ],
                                attributes: ['id', 'name', 'price', 'description'],
                            },
                        ],
                    },
                ],
            },
        ];
    }

    async getCart(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as AuthRequest).user;
            if (!user) {
                throw new AppError('Unauthorized', 401);
            }
    
            // Find or create cart
            const [cart, created] = await Cart.findOrCreate({
                where: { user_id: user.id },
                defaults: { user_id: user.id },
                include: CartController.getCartIncludes(),
            });
    
            const cartWithItems = created ? cart : await Cart.findOne({
                where: { user_id: user.id },
                include: CartController.getCartIncludes(),
            });
    
            res.status(200).json({
                success: true,
                data: cartWithItems,
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
    
            const { variant_id, quantity } = req.body;
    
            if (!quantity || quantity < 1) {
                throw new AppError('Invalid quantity', 400);
            }
    
            const variant = await ProductVariant.findByPk(variant_id);
            if (!variant) {
                throw new AppError('Product variant not found', 404);
            }
    
            let cart = await Cart.findOne({
                where: { user_id: user.id },
            });
    
            if (!cart) {
                cart = await Cart.create({ user_id: user.id });
            }
    
            const [item, created] = await CartItem.findOrCreate({
                where: { cart_id: cart.id, variant_id },
                defaults: {
                    cart_id: cart.id,
                    variant_id: variant_id,
                    quantity: quantity
                },
            });
    
            if (!created) {
                await item.update({ quantity: item.quantity + quantity });
            }
    
            res.status(201).json({
                success: true,
                message: created ? 'Item added to cart successfully' : 'Cart item quantity updated',
                data: item,
            });
        } catch (error) {
            next(error);
        }
    }
    

    async updateItemQuantity(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as AuthRequest).user;
            if (!user) {
                throw new AppError('Unauthorized', 401);
            }

            const { variant_id } = req.params;
            const { quantity } = req.body;

            if (!quantity || quantity < 1) {
                throw new AppError('Invalid quantity', 400);
            }

            const cart = await Cart.findOne({
                where: { user_id: user.id },
            });

            if (!cart) {
                throw new AppError('Cart not found', 404);
            }

            const item = await CartItem.findOne({
                where: { cart_id: cart.id, variant_id },
            });

            if (!item) {
                throw new AppError('Item not found in cart', 404);
            }

            await item.update({ quantity });

            res.status(200).json({
                success: true,
                message: 'Cart item quantity updated successfully',
                data: item,
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

            const cart = await Cart.findOne({
                where: { user_id: user.id },
            });

            if (!cart) {
                throw new AppError('Cart not found', 404);
            }

            const item = await CartItem.findOne({
                where: { cart_id: cart.id, variant_id },
            });

            if (!item) {
                throw new AppError('Item not found in cart', 404);
            }

            await item.destroy();

            res.status(200).json({
                success: true,
                message: 'Item removed from cart successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    async clearCart(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as AuthRequest).user;
            if (!user) {
                throw new AppError('Unauthorized', 401);
            }

            const cart = await Cart.findOne({
                where: { user_id: user.id },
            });

            if (cart) {
                await CartItem.destroy({
                    where: { cart_id: cart.id },
                });
            }

            res.status(200).json({
                success: true,
                message: 'Cart cleared successfully',
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new CartController();
