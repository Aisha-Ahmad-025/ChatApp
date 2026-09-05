import express from 'express'
import { checkAuthenticated, logout, sendOtp, updateProfile, verifyOtp } from '../controllers/authController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import { multerMiddleware } from '../config/cloudinary.js'


const router = express.Router()

router.post('/send-otp', sendOtp)
router.post('/verify-otp', verifyOtp)
router.get('/logout', logout)

//protected route
router.put('/update-profile', authMiddleware, multerMiddleware, updateProfile)

// checkauth is to check that the user is authenticated or not and if the user is authenticated then it will return the user data
router.get("/check-auth",authMiddleware, checkAuthenticated)

export default router