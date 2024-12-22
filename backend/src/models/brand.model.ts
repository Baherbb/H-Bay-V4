import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface BrandAttributes {
    id: number;
    name: string;
    logo_url: string | null;
    description: string | null;
    created_at?: Date;
    updated_at?: Date;
}

interface BrandCreationAttributes extends Optional<BrandAttributes, 'id'> {}

class Brand extends Model<BrandAttributes, BrandCreationAttributes> implements BrandAttributes {
    public id!: number;
    public name!: string;
    public logo_url!: string | null;
    public description!: string | null;

    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

Brand.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                len: [2, 100],
            },
        },
        logo_url: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'brands',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

export default Brand;