import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
// import generateToken from "../utils/generateToken.js";
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv'
dotenv.config()

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import path from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const getLoginPage = (req, res) => {
//     res.render(path.join(__dirname, '../views/login'));
// };


//@desc  Auth user/set token
//route  POST /users/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id, 'userJwt');
        const response = {
            _id: user._id,
            name: user.name,
            email: user.email,
        };

        res.status(201).json(response);
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

//@desc  Register  a new user
//route  POST /users/register
//@access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password,bio,phone,image,isPrivate } = req.body
    console.log("res", req.body);
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    const user = await User.create({
        name,
        email,
        password
    });

    if (user) {
        generateToken(res, user._id, 'userJwt')
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        });
    } else {
        res.status(401);
        throw new Error('Invalid user data')
    }
})

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
//route  POST /users/withdraw
//@access Private
const getProfile = asyncHandler(async (req, res) => {
    res.status(200).json({ message: 'Profile' });
});

//@desc  deposite money
//route  POST /users/deposite
//@access Private
const editProfile = (async (req, res) => {
    res.status(200).json({ message: 'Edit profile' });
});




export {
    // getLoginPage,
    loginUser,
    registerUser,
    getProfile,
    editProfile,
    logoutUser
}