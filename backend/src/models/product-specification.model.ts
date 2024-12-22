import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ProductSpecificationAttributes {
    id: number;
    product_id: number;
    processor: string | null;
    ram: string | null;
    storage: string | null;
    display_size: string | null;
    display_resolution: string | null;
    battery_capacity: string | null;
    operating_system: string | null;
    camera_specs: string | null;
    connectivity: string | null;
    created_at?: Date;
    updated_at?: Date;
}

interface ProductSpecificationCreationAttributes extends Optional<ProductSpecificationAttributes, 'id'> {}

class ProductSpecification extends Model<ProductSpecificationAttributes, ProductSpecificationCreationAttributes> 
    implements ProductSpecificationAttributes {
    public id!: number;
    public product_id!: number;
    public processor!: string | null;
    public ram!: string | null;
    public storage!: string | null;
    public display_size!: string | null;
    public display_resolution!: string | null;
    public battery_capacity!: string | null;
    public operating_system!: string | null;
    public camera_specs!: string | null;
    public connectivity!: string | null;

    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

ProductSpecification.init(
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
        processor: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        ram: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        storage: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        display_size: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        display_resolution: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        battery_capacity: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        operating_system: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        camera_specs: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        connectivity: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'product_specifications',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

export default ProductSpecification;