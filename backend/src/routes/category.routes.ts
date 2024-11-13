import { Router } from 'express';
import CategoryController from '../controllers/category.controller';
import { validateCategory } from '../middleware/validation.middleware';

const router = Router();
const categoryController = new CategoryController();

// Get all categories
router.get('/', categoryController.getAll);

// Get category by ID
router.get('/:id', categoryController.getById);

// Create new category
router.post('/', validateCategory, categoryController.create);

// Update existing category
router.put('/:id', validateCategory, categoryController.update);

// Delete category
router.delete('/:id', categoryController.delete);

export default router;