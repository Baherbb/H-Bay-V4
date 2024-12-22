import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface WishlistItemAttributes {
    id: number;
    wishlist_id: number;
    variant_id: number;
    added_at?: Date;
    priority?: number; 
}

interface WishlistItemCreationAttributes extends Optional<WishlistItemAttributes, 'id'> {}

class WishlistItem extends Model<WishlistItemAttributes, WishlistItemCreationAttributes> 
    implements WishlistItemAttributes {
    public id!: number;
    public wishlist_id!: number;
    public variant_id!: number;
    public priority!: number;
    
    public readonly added_at!: Date;
}

WishlistItem.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        wishlist_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'wishlists',
                key: 'id',
            },
        },
        variant_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'product_variants',
                key: 'id',
            },
        },
        priority: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0, 
        },
    },
    {
        sequelize,
        tableName: 'wishlist_items',
        timestamps: true,
        createdAt: 'added_at',
        updatedAt: false,
        indexes: [
            {
                unique: true,
                fields: ['wishlist_id', 'variant_id'],
                name: 'wishlist_item_unique'
            }
        ]
    }
);


export default WishlistItem;