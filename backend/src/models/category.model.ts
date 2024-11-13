import {Model, DataTypes, Optional, Association} from 'sequelize';
import sequelize from '../config/database';


interface CategoryAttributes {
    id: number;
    name: string;
    description: string | null;
    parent_category_id: number | null;
}
//Making The id optional
interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id'>{}

class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
    public id!: number;
    public name!: string;
    public description!: string | null;
    public parent_category_id!: number | null;

    public readonly parent?: Category;
    public readonly children?: Category[];
    
    public static associations: {
        parent: Association<Category, Category>;
        children: Association<Category, Category>;
    };
}


Category.init(
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey:true,
        },
        name:{
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate:{
                len:[2,100],
            },
        },
        description:{
            type:DataTypes.TEXT,
            allowNull:true,
        },
        parent_category_id:{
            type:DataTypes.INTEGER,
            allowNull:true,
            references:{
                model: 'categories',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        tableName: 'categories',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);
//Many to One Relationship
Category.belongsTo(Category, {
    as: 'parent',
    foreignKey: 'parent_category_id',
});
//One to Many Relationship
Category.hasMany(Category, {
    as: 'children',
    foreignKey: 'parent_category_id',
});

export default Category;