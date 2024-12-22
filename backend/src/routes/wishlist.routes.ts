import express from 'express';
import WishlistController from '../controllers/wishlist.controller';
import { authMiddleware } from '../middleware/auth.middleware';



const router = express.Router();

router.use(authMiddleware); 

router.get('/', WishlistController.getWishlistItems); 
router.post('/items', WishlistController.addItem);     
router.put('/items/:variant_id', WishlistController.updateItemPriority); 
router.delete('/items/:variant_id', WishlistController.removeItem);     
router.delete('/', WishlistController.clearWishlist);                   


export default router;