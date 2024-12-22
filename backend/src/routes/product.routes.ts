import express from 'express';
import ProductController from '../controllers/product.controller';
import { validateProduct } from '../middleware/validation.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { hasPermission, Permission } from '../middleware/permissions';

const router = express.Router();

router.get('/search', ProductController.searchProducts);
router.get('/', ProductController.getSortedProducts);
router.get('/:id', ProductController.getById);

router.use(authMiddleware);

router.post('/', 
  hasPermission(Permission.CREATE_PRODUCT),
  // validateProduct, 
  ProductController.create
);

router.put('/:id', 
  hasPermission(Permission.UPDATE_PRODUCT),
  // validateProduct, 
  ProductController.update
);

router.delete('/:id', 
  hasPermission(Permission.DELETE_PRODUCT),
  ProductController.delete
);

export default router;