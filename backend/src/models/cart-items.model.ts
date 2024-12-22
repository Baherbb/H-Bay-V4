import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface CartItemAttributes {
    cart_id: number;
    variant_id: number;
    quantity: number;
    added_at?: Date;
}

class CartItem extends Model<CartItemAttributes> implements CartItemAttributes {
    cart_id!: number;
    variant_id!: number;
    quantity!: number;
    public readonly added_at!: Date;
}

CartItem.init(
    {
        cart_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'shopping_carts',
                key: 'id',
            },
        },
        variant_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'product_variants',
                key: 'id',
            },
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
        },
    },
    {
        sequelize,
        tableName: 'cart_items',
        timestamps: true,
        createdAt: 'added_at',
        updatedAt: false,
        indexes: [
            {
                unique: true,
                fields: ['cart_id', 'variant_id'],
            },
        ],
    }
);

export default CartItem;