import { Request, Response, NextFunction } from "express";
import Category from "../models/category.model";
import { AppError } from "../middleware/error.middleware";


class CategoryController{

    async create(req: Request, res:Response, next:NextFunction){
        try{
            const {name, description,image_url, parent_category_id} = req.body;

            if (parent_category_id){
                const parentExists = await Category.findByPk(parent_category_id);
                if(!parentExists){
                    throw new AppError('Parent Category not Found', 404);
                }
            }

            const category = await Category.create({
                name,
                description,
                image_url,
                parent_category_id,
            });
            
            res.status(201).json(category);
        }
        catch(error){
            if(error instanceof Error && error.name === 'SequelizeUniqueConstraintError' ){
                next(new AppError('Category name already exists', 400));
            }
            else {
                next(error);
            }
        }
    }

    async update(req:Request, res:Response, next:NextFunction){
        try{
            const category = await Category.findByPk(req.params.id);
            if (!category) {
                throw new AppError('Category not found', 404);
            }

            const {name, description, parent_category_id} = req.body;

            if (parent_category_id) {
                const parentExists = await Category.findByPk(parent_category_id);
                if (!parentExists) {
                    throw new AppError('Parent category not found', 404);
                }
            }
            await category.update({
                name,
                description,
                parent_category_id,
            });
            res.json(category);
        }
        catch(error){
            if(error instanceof Error && error.name === 'SequelizeUniqueConstraintError' ){
                next(new AppError('Category name already exists', 400));
            }
            else {
                next(error);
            }
        }
    }

    async delete(req:Request, res:Response, next:NextFunction){
        try{
            const category = await Category.findByPk(req.params.id, {
                include:[{
                    model:Category,
                    as: 'children'}
                ],
            });
            if (!category) {
                throw new AppError('Category not found', 404);
            }

            if (category.children && category.children.length > 0) {
                throw new AppError('Cannot delete category with subcategories', 400);
            }
            await category.destroy();
            res.status(204);
        }
        catch(error){
            next(error);
        }
    }

    async getAll(req:Request, res:Response, next:NextFunction){
        try{
            const categories = await Category.findAll({
                include:[
                    {
                        model:Category,
                        as: 'parent',
                        attributes: ['id', 'name'],
                    },
                    {
                        model: Category,
                        as: 'children',
                        attributes: ['id', 'name'],
                    },
                ],
                order:[['name', 'ASC']],
            });

            res.json(categories);
        }
        catch(error){
            next(error);
        }
    }

    async getById(req:Request, res:Response, next:NextFunction){
        try{
            const category = await Category.findByPk(req.params.id, {
                include:[
                    {
                        model:Category,
                        as: 'parent',
                        attributes:['id', 'name'],
                    },
                    {
                        model:Category,
                        as: 'children',
                        attributes:['id', 'name'],
                    },
                ],
            });

            if(!category){
                throw new AppError('Category not Found',404);
            }
            res.json(category);
        }
        catch(error){
            next(error);
        }
        
    }
}

export default CategoryController;