import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});

const sendVerificationLink = async (email) => {
    const token = jwt.sign({ email: email, type: "emailVerification" }, process.env.JWT_SECRET, { expiresIn: "14d" });
    const link = `${process.env.HOST}:${process.env.PORT}/api/auth/verify-email/${token}`;

    try {
        await transport.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: "Verify email",
            html: `<a href="${link}">verify</a>`
        });
    } catch (error) {
        throw new Error("Error sending verification link")
    }
}

const sendPasswordResetLink = async (email) => {
    const token = jwt.sign({ email: email, type: "passwordReset" }, process.env.JWT_SECRET, { expiresIn: "14d" });
    const link = `${process.env.HOST}:${process.env.PORT}/api/auth/password-reset/${token}`;

    try {
        await transport.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: "Reset password",
            html: `<a href="${link}">reset</a>`
        });
    } catch (error) {
        throw new Error("Error sending password reset link")
    }
}

export { sendVerificationLink, sendPasswordResetLink };
