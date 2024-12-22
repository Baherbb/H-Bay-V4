import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface WishlistAttributes {
    id: number;
    user_id: number;
    name: string | null;
    created_at?: Date;
    updated_at?: Date;
}

interface WishlistCreationAttributes extends Optional<WishlistAttributes, 'id'> {}

class Wishlist extends Model<WishlistAttributes, WishlistCreationAttributes> 
    implements WishlistAttributes {
    public id!: number;
    public user_id!: number;
    public name!: string | null;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

Wishlist.init(
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
        name: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: 'My Wishlist'
        }
        
    },
    {
        sequelize,
        tableName: 'wishlists',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

export default Wishlist;