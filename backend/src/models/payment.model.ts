import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import Order from './order.model';
import OrderItem from './order-items.model';


export enum PaymentMethod {
    STRIPE = 'stripe',
    PAYPAL = 'paypal'
}

export enum PaymentStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
    REFUNDED = 'refunded'
}

interface PaymentAttributes {
    id: number;
    order_id: number;
    amount: number;
    method: PaymentMethod;
    transaction_id?: string;
    stripe_payment_intent_id?: string;
    payment_status: PaymentStatus;
    payment_date?: Date;
    created_at: Date;
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id' | 'created_at'> {}

class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
    public id!: number;
    public order_id!: number;
    public amount!: number;
    public method!: PaymentMethod;
    public transaction_id?: string;
    public stripe_payment_intent_id?: string;
    public payment_status!: PaymentStatus;
    public payment_date?: Date;
    public created_at!: Date;
}

Payment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'orders',
                key: 'id',
            },
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        method: {
            type: DataTypes.ENUM(...Object.values(PaymentMethod)),
            allowNull: false,
        },
        transaction_id: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        stripe_payment_intent_id: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        payment_status: {
            type: DataTypes.ENUM(...Object.values(PaymentStatus)),
            allowNull: false,
        },
        payment_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'payments',
        timestamps: true,
        updatedAt: false,
        createdAt: 'created_at',
    }
);

// Set up associations
// Order.belongsTo(User, { foreignKey: 'user_id' });
// Order.belongsTo(Coupon, { foreignKey: 'coupon_id' });
Order.hasMany(OrderItem, { foreignKey: 'order_id' });
Order.hasOne(Payment, { foreignKey: 'order_id' });

// OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
// Payment.belongsTo(Order, { foreignKey: 'order_id' });

export { Order, OrderItem, Payment };