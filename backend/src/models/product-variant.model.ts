import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { cleanupCartItems } from '../utils/database.utils';

interface ProductVariantAttributes {
    id: number;
    product_id: number;
    sku: string;
    color: string | null;
    storage_capacity: string | null;
    ram_size: string | null;
    cellular: string | null;
    price: number;
    stock_quantity: number;
    created_at?: Date;
    updated_at?: Date;
}

interface ProductVariantCreationAttributes extends Optional<ProductVariantAttributes, 'id'> {}

class ProductVariant extends Model<ProductVariantAttributes, ProductVariantCreationAttributes> 
    implements ProductVariantAttributes {
    public id!: number;
    public product_id!: number;
    public sku!: string;
    public color!: string | null;
    public storage_capacity!: string | null;
    public ram_size!: string | null;
    public cellular!: string | null;
    public price!: number;
    public stock_quantity!: number;

    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}


ProductVariant.init(
    
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'products',
                key: 'id',
            },
        },
        sku: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                len: [1, 50],
            },
        },
        color: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        storage_capacity: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        ram_size: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        cellular: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        stock_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
            },
        },
    },
    {
        sequelize,
        tableName: 'product_variants',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

ProductVariant.beforeDestroy(async (instance, options) => {
    await cleanupCartItems(instance.id, options.transaction || undefined);
});


export default ProductVariant;