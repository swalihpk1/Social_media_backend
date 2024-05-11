import jwt from 'jsonwebtoken';

const generateToken = async(res, userId, name) => {
    const value = name;
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    await res.cookie(value, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return token; 
}

export default generateToken;
