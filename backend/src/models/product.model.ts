import { Model, DataTypes, Optional, Association } from 'sequelize';
import sequelize from '../config/database';

interface ProductAttributes {
    id: number;
    name: string;
    description: string | null;
    price: number;
    category_id: number;
    brand_id: number;
    model_number: string | null;
    release_date: Date | null;
    warranty_info: string | null;
    tech_category: string | null; 
    weight: number | null;
    dimensions: string | null;
    created_at?: Date;
    updated_at?: Date;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'model_number' | 'release_date' | 'warranty_info' | 'tech_category' | 'weight' | 'dimensions'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    public id!: number;
    public name!: string;
    public description!: string | null;
    public price!: number;
    public category_id!: number;
    public brand_id!: number;
    public model_number!: string | null;
    public release_date!: Date | null;
    public warranty_info!: string | null;
    public tech_category!: string | null;
    public weight!: number | null;
    public dimensions!: string | null;

    public readonly created_at?: Date;
    public readonly updated_at?: Date;
}

Product.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                isDecimal: true,
                min: 0,
            },
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'categories',
                key: 'id',
            },
        },
        brand_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'brands',
                key: 'id',
            },
        },
        model_number: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        release_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        warranty_info: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        tech_category: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        weight: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: true,
        },
        dimensions: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'products',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

export default Product;