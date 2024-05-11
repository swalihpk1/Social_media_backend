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
    sendFollowRequest,
    acceptFollowRequest,
    showUserDetails,
    showAllPublicUsers
} from '../controllers/userController.js';

const router = express.Router();
router.get('/login', getLogin);
router.get('/auth/google', verifyLogin);
router.get('/auth/google/callback', handleGoogleCallback);
router.post('/register', registerUser);
router.post('/logout', protect, logoutUser);
router.get('/profile/:id', protect, getProfile);
router.put('/editProfile/:id', protect, editProfile);
router.post('/follow/:userId', protect, sendFollowRequest);
router.post('/follow/:userId/accept', protect, acceptFollowRequest); 
router.get('/user/:userId', protect, showUserDetails); 
router.get('/publicUsers', protect, showAllPublicUsers); 




export default router;
