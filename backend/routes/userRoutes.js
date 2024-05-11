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

// ============Authentication===============
router.post('/register', registerUser);
router.get('/login', getLogin);
router.get('/auth/google', verifyLogin);
router.get('/auth/google/callback', handleGoogleCallback);
router.post('/logout', protect, logoutUser);

// ==============User profiles=============
router.get('/profile/:id', protect, getProfile);
router.put('/editProfile/:id', protect, editProfile);
router.get('/showUserDetails/:userId', protect, showUserDetails);
router.get('/publicUsers', protect, showAllPublicUsers); 

// ==============Follow requests============
router.post('/follow/:userId', protect, sendFollowRequest);
router.post('/follow/accept/:userId/', protect, acceptFollowRequest); 





export default router;
