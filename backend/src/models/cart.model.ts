import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CartAttributes {
    id: number;
    user_id: number;
    created_at?: Date;
    updated_at?: Date;
}

interface CartCreationAttributes extends Optional<CartAttributes, 'id'>{}

class Cart extends Model<CartAttributes, CartCreationAttributes>
    implements CartAttributes {
        id!: number;
        user_id!: number;

        public readonly created_at!: Date;
        public readonly updated_at!: Date;
}

Cart.init(
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
    },    
    {
        sequelize,
        tableName: 'shopping_carts',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
)
export default Cart;