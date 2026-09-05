import otpGenerate from "../utils/otpGenerator.js";
import { User } from '../models/User.model.js'
import response from "../utils/resonseHandle.js";
import sendOtpToEmail from "../services/emailService.js";
import generateToken from "../utils/generateToken.js";
import { uploadFileToCloudinary } from "../config/cloudinary.js";
import { Conversation } from "../models/Conversation.model.js";

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

// step 3 if user is verified then updare the profile of the user
const updateProfile = async (req, res) => {
    const { agreed, userName, about } = req.body;
    const userId = req.user.userId;
    try {
        const user = await User.findById(userId);
        const file = req.file;
        if (file) {
            const uploadResult = await uploadFileToCloudinary(file);
            console.log(uploadResult)
            user.profilePicture = uploadResult?.secure_url;
        } else if (req.body.profilePicture) {
            user.profilePicture = req.body.profilePicture;
        }

        if (userName) {
            user.userName = userName;
        }
        if (agreed) {
            user.agreed = agreed;
        }
        if (about) {
            user.about = about;
        }

        await user.save();
        // console.log(user)
        return response(res, 200, 'Profile updated successfully', { user })

    } catch (error) {
        console.log(error)
        return response(res, 500, 'internal server error')
    }
}

// step 4 logout the user
const logout = (req, res) => {
    try {
        res.cookie("auth_token", "", { expiry: new Date(0) })
        return response(res, 200, 'User Logout successfully')
    } catch (error) {
        console.log(error)
        return response(res, 500, 'internal server error')
    }
}

// check the authentication of the user
const checkAuthenticated = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return response(res, 401, 'User not authenticated ! please login first')
        }

        const user = await User.findById(userId);
        if (!user) {
            return response(res, 404, 'User not found')
        }

        return response(res, 200, 'User authenticated and allow to use the application', { user })

    } catch (error) {
        console.log(error)
        return response(res, 500, 'internal server error')
    }
}

// get all the users except you
const getAllUsers = async (req, res) => {
    const loggedInUser = req.user.userId;

    try {
        const users = await User.find({ _id: { $ne: loggedInUser } }).select('userName profilePicture about lastSeen isOnline').lean();

        const userWithConversation = await Promise.all(users.map(async (user) => {
            const conversation = await Conversation.findOne({
                participants: { $all: [loggedInUser, user._id] }
            }).populate({
                path:'lastMessage',
                select:'content createdAt sender receiver'
            }).lean();

            return {
                ...user, 
                conversation:conversation || null
            }
        }))

        return response(res, 200, 'All users fetched successfully', { users: userWithConversation })

    } catch (error) {
        console.log(error)
        return response(res, 500, 'internal server error')
    }
}

export {
    sendOtp,
    verifyOtp,
    updateProfile,
    logout,
    checkAuthenticated,
    getAllUsers
}