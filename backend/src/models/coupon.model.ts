import { Model, DataTypes, Sequelize } from 'sequelize';

interface CouponAttributes {
    id: number;
    code: string;
    discount_value: number;
    discount_type: string;
    minimum_purchase: number;
    expiry_date: Date;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

interface CouponCreationAttributes extends Omit<CouponAttributes, 'id' | 'created_at' | 'updated_at'> { }

class Coupon extends Model<CouponAttributes, CouponCreationAttributes> implements CouponAttributes {
    public id!: number;
    public code!: string;
    public discount_value!: number;
    public discount_type!: string;
    public minimum_purchase!: number;
    public expiry_date!: Date;
    public is_active!: boolean;
    public created_at!: Date;
    public updated_at!: Date;
}

export const initCouponModel = (sequelize: Sequelize) => {
    Coupon.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            code: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true,
            },
            discount_value: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: false,
                validate: {
                    isGreaterThanZero(value: number) {
                        if (value <= 0) {
                            throw new Error('Discount value must be greater than 0');
                        }
                    },
                },
            },
            discount_type: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            minimum_purchase: {
                type: DataTypes.DECIMAL(10, 2),
                defaultValue: 0,
            },
            expiry_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
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
            tableName: 'coupons',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            indexes: [
                {
                    name: 'idx_coupons_code',
                    fields: ['code'],
                },
            ],
        }
    );

    return Coupon;
};

export default Coupon;
