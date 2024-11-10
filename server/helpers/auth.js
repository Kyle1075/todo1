//auth.js
import jwt from 'jsonwebtoken';

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

export const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ error: 'Authorization header missing or malformed' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const user = verifyToken(token); // Verify the token here
        req.user = user;  // Attach the decoded user info to the request object
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};
