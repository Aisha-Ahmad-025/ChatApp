import otpGenerate from "../utils/otpGenerator.js";
import { User } from '../models/User.model.js'
import response from "../utils/resonseHandle.js";
import sendOtpToEmail from "../services/emailService.js";
import generateToken from "../utils/generateToken.js";

// step 1 send otp to user
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const otp = otpGenerate()
        const expiry = new Date(Date.now() + 5 * 60 * 1000)
        let user;
        if (email) {
            user = await User.findOne({ email })

            // if there is no user then create it 
            if (!user) {
                user = new User({ email })
            }

            user.emailOtp = otp
            user.emailOtpExpire = expiry
            await user.save();
            await sendOtpToEmail(email, otp);
            return response(res, 200, 'Otp send to your email', { email })
        }
    }
    catch (error) {
        console.log(error)
        return response(res, 500, 'internal server error')
    }
}

// step 2 verify otp that has been send to the user
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        let user;
        if (email) {
            user = await User.findOne({ email })

            if (!user) {
                return response(res, 404, "User not found")
            }
            const now = new Date()
            if (!user.emailOtp || String(user.emailOtp) !== String(otp) || now > new Date(user.emailOtpExpire)) {
                return response(res, 400, 'invalid or expired otp')
            }
            user.isVerified = true
            user.emailOtp = null
            user.emailOtpExpire = null
            await user.save()
        }
        let token = generateToken(user?._id);
        res.cookie("auth_token", token, {
            httponly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365
        })
        return response(res, 200, 'Otp verified successfully', { token, user })
    }
    catch (error) {
        console.log(error)
        return response(res, 500, 'internal server error')
    }
}

export {
    sendOtp,
    verifyOtp
}