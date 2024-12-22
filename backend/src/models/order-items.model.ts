import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
interface OrderItemAttributes {
    order_id: number;
    variant_id: number;
    quantity: number;
    price_at_time: number;
}

class OrderItem extends Model<OrderItemAttributes> implements OrderItemAttributes {
    public order_id!: number;
    public variant_id!: number;
    public quantity!: number;
    public price_at_time!: number;
}

OrderItem.init(
    {
        order_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'orders',
                key: 'id',
            },
        },
        variant_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
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
        price_at_time: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'order_items',
        timestamps: false,
    }
);
export default OrderItem;