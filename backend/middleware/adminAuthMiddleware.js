import jwt, { decode } from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

import Admin from '../models/adminModel.js';

const protect = asyncHandler(async (req, res, next) => {
    let token;

    token = req.cookies.adminJwt;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await Admin.findById(decoded.userId).select('-password');

            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, invalid token');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, not token');
    }
});

export { protect };