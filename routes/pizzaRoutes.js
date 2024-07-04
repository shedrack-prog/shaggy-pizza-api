import { Router } from 'express';
const router = Router();
import {
  createPizza,
  deletePizzaById,
  getAllPizzas,
  getPizzaById,
  updatePizzaById,
} from '../controllers/pizzaController.js';
import { authMiddleware } from '../middleware/authmiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import { uploadImages } from '../controllers/uploadImageController.js';
import imageMiddleware from '../middleware/imgMiddleware.js';

router
  .route('/')
  .get(authMiddleware, getAllPizzas)
  .post(authMiddleware, adminMiddleware, createPizza);
router
  .route('/uploadImages')
  .post(authMiddleware, adminMiddleware, imageMiddleware, uploadImages);
router
  .route('/:id')
  .get(authMiddleware, getPizzaById)
  .patch(authMiddleware, adminMiddleware, updatePizzaById)
  .delete(authMiddleware, adminMiddleware, deletePizzaById);

export default router;
