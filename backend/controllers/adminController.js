import asyncHandler from "express-async-handler";
import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";


const authAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (admin && (await admin.matchPassword(password))) {
        generateToken(res, admin._id, 'adminJwt');

        res.status(201).json({
            _id: admin._id,
            email: admin.email,
            name: admin.name
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});


const logoutAdmin = asyncHandler(async (req, res) => {
    res.cookie('adminJwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Admin logged out' });
});


const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json({ users });
});


const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


getUserProfile

export { 
    authAdmin,
    getAllUsers,
    logoutAdmin,
    getUserProfile
}