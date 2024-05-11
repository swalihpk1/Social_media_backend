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
router.post('/editProfile/:id', protect, editProfile);
router.post('/sendFollowRequest/:userId', protect, sendFollowRequest);
router.post('/acceptFollowRequest/:userId', protect, acceptFollowRequest) 
router.post('/showUserDetails/:userId', protect, showUserDetails);
router.get('/listPublicUsers', protect, showAllPublicUsers);




export default router;
