import { Router } from 'express';
import {
  getCurrentUser,
  getUserOrders,
} from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authmiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = Router();

router.route('/get-current-user').get(authMiddleware, getCurrentUser);
router.route('/orders').get(authMiddleware, getUserOrders);

export default router;
