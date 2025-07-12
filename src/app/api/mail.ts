"use server";
import nodemailer from "nodemailer";

type Params = {
    email: string | string[],
    html: string,
    sub: string
}

const handleMail = async ({ email, html, sub }: Params) => {
    // Check if email configuration is available (support both old and new variable names)
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpUsername = process.env.SMTP_USERNAME || process.env.NODEMAILER_EMAIL;
    const smtpPassword = process.env.SMTP_PASSWORD || process.env.NODEMAILER_PW;
    
    if (!smtpUsername || !smtpPassword) {
        console.error('Email configuration missing: SMTP_USERNAME/NODEMAILER_EMAIL or SMTP_PASSWORD/NODEMAILER_PW not set');
        return;
    }

    try {
        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: smtpUsername,
                pass: smtpPassword,
            },
        });

        const mailOptions = {
            from: smtpUsername || "noreply@ihu-usa.org",
            to: email,
            subject: sub || "Mail",
            html,
        };

        await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(response);
                }
            });
        });
    } catch (error) {
        console.error('Failed to send email notification:', error)
        // Don't throw error, just silently fail so the form submission doesn't fail
    }
}

export default handleMail