import express from 'express';
import cartController from '../controllers/cart.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authMiddleware);

router.get('/', cartController.getCart);
router.post('/items', cartController.addItem);
router.put('/items/:variant_id', cartController.updateItemQuantity);
router.delete('/items/:variant_id', cartController.removeItem);
router.delete('/', cartController.clearCart);

export default router;
