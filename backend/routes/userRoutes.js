import express from 'express';
import { protect } from '../middleware/authMiddleware.js'
import {
    loginUser,
    registerUser,
    getProfile,
    editProfile,
    logoutUser,
    // getLoginPage
} from '../controllers/userController.js';

const router = express.Router();

// router.get('/login', getLoginPage);
router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getProfile);
router.post('/editProfile', protect, editProfile);

export default router;
