import jwt from 'jsonwebtoken';

const generateToken = (res, userId, name) => {
    const value = name
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })

    res.cookie(value, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
    })
}



export default generateToken;