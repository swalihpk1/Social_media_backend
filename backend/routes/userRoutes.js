import express from 'express';
import { protect } from '../middleware/authMiddleware.js'
import {
    verifyLogin,
    registerUser,
    getProfile,
    editProfile,
    logoutUser,
    getLogin,
    handleGoogleCallback,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/login', getLogin);
router.get('/auth/google', verifyLogin);
router.get('/auth/google/callback', handleGoogleCallback);
router.post('/register', registerUser);
router.post('/logout', protect, logoutUser);
router.get('/profile/:id', protect, getProfile);
router.post('/editProfile', protect, editProfile);


export default router;
