import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        phoneNumber: {
            type: String,
            unique: true,
            sparse: true
        },

        phoneSuffix: {
            type: String,
            unique: false
        },

        userName: {
            type: String
        },

        email: {
            type: String,
            lowercase: true,
            validate: {
                validator: function (value) {
                    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value);
                },
                message: "Invalid email address format"
            }
        },

        emailOtp: {
            type: String
        },

        emailOtpExpire: {
            type: Date
        },

        profilePicture: {
            type: String
        },

        about: {
            type: String
        },

        lastSeen: {
            type: Date
        },

        isOnline: {
            type: Boolean,
            default: false
        },

        isVerified: {
            type: Boolean,
            default: false
        },

        agreed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export const User = mongoose.model("User", userSchema);