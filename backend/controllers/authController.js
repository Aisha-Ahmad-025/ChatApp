import otpGenerate from "../utils/otpGenerator.js";
import User from '../models/User.model.js'
import response from "../utils/resonseHandle.js";
import { use } from "react";

// step 1 send otp to user
const sendOtp = async (req, res) => {
    try {
        const { phoneNumber, phoneSuffix, email } = req.body;
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

            return response(res, 200, 'Otp send to your email', { email })
        }

        if (!phoneNumber || !phoneSuffix) {
            return response(res, 400, 'Phone number and phone suffix are required')
        }
        
        const fullPhoneNum = `${phoneSuffix}${phoneNumber}`
        user = await User.findOne({phoneNumber})
        if(!user){
            user = await new User({phoneNumber,phoneSuffix})
        }

        await user.save()

        return response(res, 200, "Otp send successfully", user)
    }
    catch (error) {
        console.log(error)
        return response(res, 500, 'internal server error')
    }

}