import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ProductImageAttributes {
    id: number;
    product_id: number;
    variant_id: number | null;
    image_url: string;
    is_primary: boolean;
    display_order: number;
    created_at?: Date;
}

interface ProductImageCreationAttributes extends Optional<ProductImageAttributes, 'id'> {}

class ProductImage extends Model<ProductImageAttributes, ProductImageCreationAttributes>
    implements ProductImageAttributes {
    public id!: number;
    public product_id!: number;
    public variant_id!: number | null;
    public image_url!: string;
    public is_primary!: boolean;
    public display_order!: number;
    public readonly created_at!: Date;
}

ProductImage.init(
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
        variant_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'product_variants',
                key: 'id',
            },
        },
        image_url: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                customUrlValidator(value: string) {
                    // Allow both regular URLs and data URLs (base64)
                    const urlPattern = /^(https?:\/\/.*|data:image\/.*)/i;
                    if (!urlPattern.test(value)) {
                        throw new Error('Invalid image URL format. Must be a valid HTTP/HTTPS URL or data URL');
                    }
                }
            },
        },
        is_primary: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        display_order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
            },
        },
    },
    {
        sequelize,
        tableName: 'product_images',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
    }
);

export default ProductImage;
