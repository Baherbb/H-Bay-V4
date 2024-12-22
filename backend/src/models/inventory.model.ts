import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface InventoryAttributes {
    id: number;
    variant_id: number;
    quantity: number;
    low_stock_threshold: number;
    last_restock_date: Date | null;
    created_at?: Date;
    updated_at?: Date;
}

interface InventoryCreationAttributes extends Optional<InventoryAttributes, 'id'> {}

class Inventory extends Model<InventoryAttributes, InventoryCreationAttributes>
    implements InventoryAttributes {
    public id!: number;
    public variant_id!: number;
    public quantity!: number;
    public low_stock_threshold!: number;
    public last_restock_date!: Date | null;

    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

Inventory.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        variant_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: 'product_variants',
                key: 'id',
            },
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        low_stock_threshold: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 10,
            validate: {
                min: 0,
            },
        },
        last_restock_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'inventory',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                name: 'idx_inventory_variant',
                fields: ['variant_id'],
            },
        ],
    }
);

export default Inventory;