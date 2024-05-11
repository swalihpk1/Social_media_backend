import express from 'express';
import {
    authAdmin, getUserProfile,
    getAllUsers, logoutAdmin
} from '../controllers/adminController.js';
import { protect } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

// ============Authentication===============
router.post('/auth', authAdmin);
router.post('/logout', logoutAdmin);

// ============ Users ===============
router.get('/usersList', protect, getAllUsers);
router.get('/userProfile/:id', protect, getUserProfile);


export default router;