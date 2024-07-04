import { Router } from 'express';
import {
  activateAccount,
  adminLogin,
  changePassword,
  findUser,
  loginUser,
  logout,
  registerUser,
  sendResetPasswordCode,
  validateResetCode,
} from '../controllers/authController.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import { authMiddleware } from '../middleware/authmiddleware.js';

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logout);
router.route('/find-user').post(findUser);
router.route('/admin/login').post(adminLogin);
router.route('/send-reset-code').post(sendResetPasswordCode);
router.route('/validate-reset-code').post(validateResetCode);
router.route('/change-password').post(changePassword);
router.route('/activate-account').post(authMiddleware, activateAccount);

export default router;
