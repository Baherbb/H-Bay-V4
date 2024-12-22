import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './user.model';

export type NotificationType = 'ORDER_UPDATE' | 'PRICE_DROP' | 'BACK_IN_STOCK' | 'NEW_PRODUCT' | 'PROMOTION';

interface NotificationAttributes {
    id: number;
    user_id: number;
    title: string;
    message: string;
    type: NotificationType;
    read: boolean;
    data?: object;
    subscription: object;
    created_at?: Date;
    updated_at?: Date;
}

interface NotificationCreationAttributes extends Omit<NotificationAttributes, 'id'> {}

class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> 
    implements NotificationAttributes {
    public id!: number;
    public user_id!: number;
    public title!: string;
    public message!: string;
    public type!: NotificationType;
    public read!: boolean;
    public data!: object;
    public subscription!: object;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

Notification.init(
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
                model: User,
                key: 'id',
            },
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('ORDER_UPDATE', 'PRICE_DROP', 'BACK_IN_STOCK', 'NEW_PRODUCT', 'PROMOTION'),
            allowNull: false,
        },
        read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        data: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        subscription: {
            type: DataTypes.JSONB,
            allowNull: false,
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
        tableName: 'notifications',
        timestamps: true,
        underscored: true,
    }
);

export default Notification;