
import Product from './product.model';
import Category from './category.model';
import Brand from './brand.model';
import ProductVariant from './product-variant.model';
import ProductImage from './product-image.model';
import ProductSpecification from './product-specification.model';
import ProductCompatibility from './product-compatibility.model';
import Wishlist from './wishlist.model';
import WishlistItem from './wishlist-items.model';
import User from './user.model';
import CartItem from './cart-items.model';
import Cart from './cart.model';
import Inventory from './inventory.model';

export function initAssociations() {
    Cart.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
    });
    Cart.hasMany(CartItem, {
        foreignKey: 'cart_id',
        as: 'cartItems'
    });
    
    ProductVariant.hasMany(CartItem, {
        foreignKey: 'variant_id',
        as: 'cartItems',
        onDelete: 'SET NULL'
    });
    
    User.hasMany(Cart, {
        foreignKey: 'user_id',
        as: 'carts'
    });
    
    Cart.belongsToMany(ProductVariant, {
        through: CartItem,
        foreignKey: 'cart_id',
        otherKey: 'variant_id',
        as: 'items'
    });
    
    ProductVariant.belongsToMany(Cart, {
        through: CartItem,
        foreignKey: 'variant_id',
        otherKey: 'cart_id',
        as: 'carts'
    });
    
    CartItem.belongsTo(Cart, {
        foreignKey: 'cart_id',
        as: 'cart'
    });
    
    CartItem.belongsTo(ProductVariant, {
        foreignKey: 'variant_id',
        as: 'variant'
    });
    
    Product.belongsTo(Category, {
        as: 'productCategory', 
        foreignKey: 'category_id',
        onDelete: 'RESTRICT'
    });

    Product.belongsTo(Brand, {
        as: 'brand',
        foreignKey: 'brand_id',
        onDelete: 'RESTRICT'
    });

    Product.hasOne(ProductSpecification, {
        as: 'specifications',
        foreignKey: 'product_id',
        onDelete: 'CASCADE'
    });

    Product.hasMany(ProductVariant, {
        as: 'variants',
        foreignKey: 'product_id',
        onDelete: 'CASCADE'
    });

    Product.hasMany(ProductImage, {
        as: 'images',
        foreignKey: 'product_id',
        onDelete: 'CASCADE'
    });

    Product.hasMany(ProductCompatibility, {
        as: 'compatibility',
        foreignKey: 'product_id',
        onDelete: 'CASCADE'
    });

    ProductVariant.belongsTo(Product, {
        foreignKey: 'product_id',
        as: 'product',
        onDelete: 'CASCADE'
    });

    ProductVariant.hasMany(ProductImage, {
        foreignKey: 'variant_id',
        as: 'images',
        onDelete: 'CASCADE'
    });

    ProductImage.belongsTo(Product, {
        foreignKey: 'product_id',
        as: 'product',
        onDelete: 'CASCADE'
    });

    ProductImage.belongsTo(ProductVariant, {
        foreignKey: 'variant_id',
        as: 'variant',
        onDelete: 'CASCADE'
    });

    ProductSpecification.belongsTo(Product, {
        foreignKey: 'product_id',
        as: 'product',
        onDelete: 'CASCADE'
    });

    ProductCompatibility.belongsTo(Product, {
        foreignKey: 'product_id',
        as: 'product',
        onDelete: 'CASCADE'
    });

    ProductCompatibility.belongsTo(Product, {
        foreignKey: 'compatible_with_id',
        as: 'compatibleWith',
        onDelete: 'CASCADE'
    });

    Brand.hasMany(Product, {
        foreignKey: 'brand_id',
        as: 'products',
        onDelete: 'RESTRICT'
    });
    Category.belongsTo(Category, {
        as: 'parent',
        foreignKey: 'parent_category_id',
        onDelete: 'SET NULL'
    });

    Category.hasMany(Category, {
        as: 'children',
        foreignKey: 'parent_category_id',
        onDelete: 'SET NULL'
    });
    ProductVariant.hasOne(Inventory, {
        foreignKey: 'variant_id',
        as: 'inventory',
        onDelete: 'CASCADE'
    });

    Inventory.belongsTo(ProductVariant, {
        foreignKey: 'variant_id',
        as: 'variant'
    });
    Wishlist.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
    });
    
    User.hasOne(Wishlist, {
        foreignKey: 'user_id',
        as: 'wishlist'
    });

    WishlistItem.belongsTo(ProductVariant, {
        foreignKey: 'variant_id',
        as: 'variant'
    });

    ProductVariant.hasMany(WishlistItem, {
        foreignKey: 'variant_id',
        as: 'wishlistItems'
    });

    Wishlist.belongsToMany(ProductVariant, {
        through: WishlistItem,
        foreignKey: 'wishlist_id',
        otherKey: 'variant_id',
        as: 'variants'
    });

    ProductVariant.belongsToMany(Wishlist, {
        through: WishlistItem,
        foreignKey: 'variant_id',
        otherKey: 'wishlist_id',
        as: 'wishlists'
    });
}
