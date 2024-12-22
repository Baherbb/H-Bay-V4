import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './user.model';
import Coupon from './coupon.model';

export enum OrderStatus {
    PENDING = 'pending',
    PAID = 'paid',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled'
}

interface OrderAttributes {
    id: number;
    user_id: number;
    order_date: Date;
    expected_delivery_date: Date;
    status: OrderStatus;
    total_amount: number;
    coupon_id?: number;
    discount_amount: number;
    created_at: Date;
    updated_at: Date;
}

class Order extends Model<OrderAttributes> implements OrderAttributes {
    public id!: number;
    public user_id!: number;
    public order_date!: Date;
    public expected_delivery_date!: Date;
    public status!: OrderStatus;
    public total_amount!: number;
    public coupon_id?: number;
    public discount_amount!: number;
    public created_at!: Date;
    public updated_at!: Date;
}

Order.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        order_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        expected_delivery_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM,
            values: Object.values(OrderStatus),
            defaultValue: OrderStatus.PENDING,
            allowNull: false,
            validate: {
                isIn: [Object.values(OrderStatus)]
            }
        },
        total_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        coupon_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'coupons',
                key: 'id',
            },
        },
        discount_amount: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'orders',
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    }
);

export default Order;