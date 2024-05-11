import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import dotenv from 'dotenv'
import cloudinary from 'cloudinary';
import fs from 'fs';
import passport from 'passport';
import '../config/auth.js';


dotenv.config()


cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true,
});

//@desc  Auth user/set token
//route   GET /users/login
//@access Public
const getLogin = asyncHandler(async (req, res) => {
    res.send('<a href ="/users/auth/google"> Sign in with google')
})

//@desc  Auth user/set token
//route  POST /users/login
//@access Public


const verifyLogin = asyncHandler(async (req, res, next) => {
    passport.authenticate('google', { scope: ['email', 'profile'] })(req, res, next);
});

const handleGoogleCallback = asyncHandler(async (req, res, next) => {

    passport.authenticate('google', async (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: "User not exist" });
        }
        const token = await generateToken(res, user._id, 'userJwt')
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            bio: user.bio,
            phone: user.phone,
            imageUrl: user.imageUrl,
            isPrivate: user.isPrivate,
            token: token
        })
    })(req, res, next);
});



//@desc  Register  a new user
//route  POST /users/register
//@access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, bio, phone, isPrivate } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: 'Invalid phone number (must be 10 digits)' });
    }


    if (name.length < 3) {
        return res.status(400).json({ message: 'Name must be at least 3 characters long' });
    }

    let imageUrl;
    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        imageUrl = result.secure_url;

        fs.unlinkSync(req.file.path);
    }

    const user = await User.create({
        name,
        email,
        password,
        bio,
        phone,
        imageUrl,
        isPrivate
    });

    if (user) {
        const token = generateToken(res, user._id, 'userJwt');
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            bio: user.bio,
            phone: user.phone,
            imageUrl: user.imageUrl,
            isPrivate: user.isPrivate,
            token: token
        });
    } else {
        res.status(401).json({ message: 'Invalid user data' });
    }
});


//@desc  logoutUser
//route  POST /users/logout
//@access Private
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('userJwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({ message: 'User Logged out' });
});


//@desc  
//route  GET /users/profile
//@access Private
const getProfile = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        phone: user.phone,
        imageUrl: user.imageUrl,
        isPrivate: user.isPrivate
    });
});

export default getProfile;




//@desc  Edit profile
//route  POST /users/editProfile
//@access Private
const editProfile = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;
    user.isPrivate = req.body.isPrivate || user.isPrivate;

    if (req.body.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        user.email = req.body.email;
    }

    if (req.body.phone) {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(req.body.phone)) {
            return res.status(400).json({ message: 'Invalid phone number (must be 10 digits)' });
        }
        user.phone = req.body.phone;
    }

    if (req.body.name && req.body.name.length < 3) {
        return res.status(400).json({ message: 'Name must be at least 3 characters long' });
    }

    if (req.body.password) {
        user.password = req.body.password;
    }

    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        user.imageUrl = result.secure_url;

        fs.unlinkSync(req.file.path);
    }

    const updatedUser = await user.save();

    res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        phone: updatedUser.phone,
        imageUrl: updatedUser.imageUrl,
        isPrivate: updatedUser.isPrivate
    });
});


//@desc  Edit profile
//route  POST /users/editProfile
//@access Private
const sendFollowRequest = (asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const currentUser = req.user;

    const requestedUser = await User.findById(userId);
    if (!requestedUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (!requestedUser.isPrivate) {
        return res.status(400).json({ message: 'User is not private' });
    }

    requestedUser.allowedFollowers.push(currentUser._id);
    await requestedUser.save();

    return res.status(200).json({ message: 'Follow request sent successfully' });
}));


//@desc  Edit profile
//route  POST /users/editProfile
//@access Private
const acceptFollowRequest = (asyncHandler(async (req, res) => {
    const { requesterId } = req.params;
    const currentUser = req.user;

    const user = await User.findById(currentUser._id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (!user.allowedFollowers.includes(requesterId)) {
        return res.status(400).json({ message: 'You have no follow request from this user' });
    }

    user.followers.push(requesterId);


    user.allowedFollowers = user.allowedFollowers.filter(id => id !== requesterId);

    await user.save();

    return res.status(200).json({ message: 'Follow request accepted successfully' });
}));


const showUserDetails = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const currentUser = req.user;

  const user = await User.findById(userId)
    .populate("followings", "name email") 
      .select("-password -allowedFollowers ") 
    .lean();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.isPrivate) {
    if (!user.followers.includes(currentUser._id)) {
      return res
        .status(401)
        .json({ message: "You are not authorized to view this user's profile" });
    }
  }

  res.status(200).json(user);
});



const showAllPublicUsers = asyncHandler(async (req, res) => {
    const currentUser = req.user;

    const publicUsers = await User.find({ isPrivate: false })
        .populate("followings", "name email") 
        .select("-password -allowedFollowers -isPrivate")
        .lean();


    publicUsers.forEach((user) => {
        if (user.followers.includes(currentUser._id)) {
            user.isFollowing = true;
        } else {
            user.isFollowing = false;
        }
    });

    res.status(200).json(publicUsers);
});



export {
    getLogin,
    verifyLogin,
    handleGoogleCallback,
    registerUser,
    getProfile,
    editProfile,
    sendFollowRequest,
    acceptFollowRequest,
    showUserDetails,
    logoutUser,
    showAllPublicUsers

}