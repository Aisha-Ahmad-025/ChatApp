import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

//gmail services ko verify karna
transporter.verify((error, success) => {
    if (error) {
        console.error("Gmail services connection error")
    } else {
        console.log('Gmail configured properly and ready to send email')
    }
})

const sendOtpToEmail = async (email, otp) => {
    const message = 'u8u8'
    await sendMail({
        from: `watsapp web${process.env.EMAIL_USER}`,
        to: email,
        subject: 'Your chatApp verification',
        message: message
    })
}


export default sendOtpToEmail;