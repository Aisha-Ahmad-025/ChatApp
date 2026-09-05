import response from "../utils/resonseHandle.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()


const authMiddleware = (req, res, next) => {
    const authToken = req.cookies.auth_token;
    if (!authToken) {
        return response(res, 401, 'Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
        req.user = decoded;
        // console.log(req.user)
        next();
    } catch (error) {
        return response(res, 400, 'Invalid token.');
    }
}

export default authMiddleware;