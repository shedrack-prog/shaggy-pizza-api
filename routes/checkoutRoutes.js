import { Router } from 'express';
import { checkoutController } from '../controllers/checkoutController.js';
import { authMiddleware } from '../middleware/authmiddleware.js';
const router = Router();

router.route('/checkout').post(checkoutController);

export default router;
