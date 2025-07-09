"use server";
import nodemailer from "nodemailer";

type Params = {
    email: string | string[],
    html: string,
    sub: string
}

const handleMail = async ({ email, html, sub }: Params) => {
    const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
        });

    const mailOptions = {
        from: "d21350180@gmail.com",
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
}

export default handleMail