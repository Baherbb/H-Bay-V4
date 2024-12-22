import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ProductCompatibilityAttributes {
    id: number;
    product_id: number;
    compatible_with_id: number;
    created_at?: Date;
}

interface ProductCompatibilityCreationAttributes extends Optional<ProductCompatibilityAttributes, 'id'> {}

class ProductCompatibility extends Model<ProductCompatibilityAttributes, ProductCompatibilityCreationAttributes> 
    implements ProductCompatibilityAttributes {
    public id!: number;
    public product_id!: number;
    public compatible_with_id!: number;

    public readonly created_at!: Date;
}

ProductCompatibility.init(
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
        compatible_with_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'products',
                key: 'id',
            },
        }
    },
    {
        sequelize,
        tableName: 'product_compatibility',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        indexes: [
            {
                unique: true,
                fields: ['product_id', 'compatible_with_id']
            }
        ],
        validate: {
            notSameProduct() {
                if (this.product_id === this.compatible_with_id) {
                    throw new Error('A product cannot be compatible with itself');
                }
            }
        }
    }
);

export default ProductCompatibility;