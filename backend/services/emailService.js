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
    const message = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ChatApp Verification</title>
</head>

<body style="
    margin: 0;
    padding: 0;
    background-color: #f4f6fb;
    font-family: Arial, Helvetica, sans-serif;
">

    <div style="
        width: 100%;
        padding: 50px 15px;
        box-sizing: border-box;
        background-color: #f4f6fb;
    ">

        <!-- Main Card -->
        <div style="
            max-width: 520px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
        ">

            <!-- Header -->
            <div style="
                padding: 38px 30px;
                text-align: center;
                background: linear-gradient(135deg, #6c4cff, #8f6cff);
            ">

                <!-- Logo -->
                <div style="
                    width: 58px;
                    height: 58px;
                    margin: 0 auto 15px auto;
                    background-color: rgba(255,255,255,0.18);
                    border: 1px solid rgba(255,255,255,0.35);
                    border-radius: 18px;
                    line-height: 58px;
                    font-size: 27px;
                ">
                    💬
                </div>

                <h1 style="
                    margin: 0;
                    color: #ffffff;
                    font-size: 30px;
                    font-weight: 700;
                    letter-spacing: -0.5px;
                ">
                    ChatApp
                </h1>

                <p style="
                    margin: 9px 0 0 0;
                    color: rgba(255,255,255,0.85);
                    font-size: 14px;
                ">
                    Simple. Private. Connected.
                </p>

            </div>


            <!-- Content -->
            <div style="
                padding: 42px 38px;
                text-align: center;
            ">

                <p style="
                    margin: 0 0 10px 0;
                    color: #8a8fa3;
                    font-size: 13px;
                    font-weight: 600;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                ">
                    Email Verification
                </p>

                <h2 style="
                    margin: 0 0 15px 0;
                    color: #20222c;
                    font-size: 25px;
                    font-weight: 700;
                ">
                    Welcome to ChatApp ✨
                </h2>

                <p style="
                    margin: 0 auto;
                    max-width: 390px;
                    color: #707586;
                    font-size: 15px;
                    line-height: 1.7;
                ">
                    We're almost ready to get you connected.
                    Use the verification code below to complete
                    your registration.
                </p>


                <!-- OTP Section -->
                <div style="
                    margin: 30px auto 25px auto;
                    padding: 25px 20px;
                    max-width: 350px;
                    background-color: #f7f5ff;
                    border: 1px solid #e9e4ff;
                    border-radius: 18px;
                ">

                    <p style="
                        margin: 0 0 12px 0;
                        color: #85899a;
                        font-size: 12px;
                        font-weight: 600;
                        letter-spacing: 1px;
                        text-transform: uppercase;
                    ">
                        Your Verification Code
                    </p>

                    <div style="
                        color: #6c4cff;
                        font-size: 34px;
                        font-weight: 700;
                        letter-spacing: 9px;
                        padding-left: 9px;
                    ">
                        ${otp}
                    </div>

                </div>


                <!-- Expiry -->
                <div style="
                    display: inline-block;
                    padding: 8px 14px;
                    background-color: #fff8e8;
                    border-radius: 20px;
                ">

                    <span style="
                        color: #a47718;
                        font-size: 12px;
                    ">
                        ⏱ This code expires soon
                    </span>

                </div>


                <!-- Security Message -->
                <div style="
                    margin-top: 30px;
                    padding: 18px;
                    background-color: #fafafa;
                    border-radius: 14px;
                    text-align: left;
                ">

                    <p style="
                        margin: 0;
                        color: #666b7a;
                        font-size: 12px;
                        line-height: 1.7;
                    ">
                        🔐 <strong style="color: #454856;">
                        Security tip:
                        </strong>
                        Never share this verification code with anyone.
                        ChatApp will never ask you for your OTP.
                    </p>

                </div>


                <p style="
                    margin: 30px 0 0 0;
                    color: #a0a4b2;
                    font-size: 12px;
                    line-height: 1.6;
                ">
                    If you didn't request this verification code,
                    you can safely ignore this email.
                </p>

            </div>


            <!-- Footer -->
            <div style="
                padding: 25px 20px;
                text-align: center;
                background-color: #fafaff;
                border-top: 1px solid #eeeeF5;
            ">

                <p style="
                    margin: 0 0 7px 0;
                    color: #6c4cff;
                    font-size: 14px;
                    font-weight: 700;
                ">
                    ChatApp
                </p>

                <p style="
                    margin: 0;
                    color: #a5a8b5;
                    font-size: 11px;
                ">
                    Making conversations simple & meaningful.
                </p>

                <p style="
                    margin: 14px 0 0 0;
                    color: #c0c2cb;
                    font-size: 10px;
                ">
                    © ${new Date().getFullYear()} ChatApp. All rights reserved.
                </p>

            </div>

        </div>

    </div>

</body>
</html>
`;

    await transporter.sendMail({
        from: `Watsapp web ${process.env.EMAIL_USER}`,
        to: email,
        subject: 'Your chatApp verification',
        html: message
    })
}

export default sendOtpToEmail;