import { Router } from 'express';
import {
  createCheese,
  createSauce,
  createVeggie,
  editOrderStatus,
  getAllCheese,
  getAllOrders,
  getAllSauces,
  getAllUsers,
  getAllVeggies,
  getGraphRevenue,
  getTotalPizzas,
  getTotalRevenue,
  getTotalSales,
} from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/authmiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = Router();
router.route('/users').get(authMiddleware, adminMiddleware, getAllUsers);

router
  .route('/sauces')
  .get(authMiddleware, getAllSauces)
  .post(authMiddleware, adminMiddleware, createSauce);
router
  .route('/veggies')
  .get(authMiddleware, getAllVeggies)
  .post(authMiddleware, adminMiddleware, createVeggie);
router
  .route('/cheeses')
  .get(authMiddleware, getAllCheese)
  .post(authMiddleware, createCheese);
router.route('/orders').get(authMiddleware, adminMiddleware, getAllOrders);

router
  .route('/get-total-revenue')
  .get(authMiddleware, adminMiddleware, getTotalRevenue);

router
  .route('/get-total-sales')
  .get(authMiddleware, adminMiddleware, getTotalSales);

router
  .route('/get-graph-revenue')
  .get(authMiddleware, adminMiddleware, getGraphRevenue);
router
  .route('/get-total-pizzas')
  .get(authMiddleware, adminMiddleware, getTotalPizzas);
router
  .route('/orders/:orderId')
  .post(authMiddleware, adminMiddleware, editOrderStatus);

export default router;
