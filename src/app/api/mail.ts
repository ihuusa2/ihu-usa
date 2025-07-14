"use server";
import nodemailer from "nodemailer";
import imaps from "imap-simple";
import MailComposer from "nodemailer/lib/mail-composer";

type Params = {
  email: string | string[];
  html: string;
  sub: string;
};

const handleMail = async ({ email, html, sub }: Params) => {
  const smtpHost = process.env.SMTP_HOST || "smtp.hostinger.com";
  const smtpUsername =
    process.env.SMTP_USERNAME || process.env.NODEMAILER_EMAIL;
  const smtpPassword = process.env.SMTP_PASSWORD || process.env.NODEMAILER_PW;
  const imapHost = process.env.IMAP_HOST || "imap.hostinger.com";
  const imapPort = Number(process.env.IMAP_PORT) || 993;

  if (!smtpUsername || !smtpPassword) {
    console.error("Email configuration missing");
    return;
  }

  try {
    // Step 1: Build raw email content
    const mail = new MailComposer({
      from: smtpUsername,
      to: email,
      subject: sub || "Mail",
      html,
      text: html.replace(/<[^>]+>/g, ""), // basic plain text fallback
    });

    const raw = await mail.compile().build(); // returns a Buffer

    // Step 2: Send mail using nodemailer
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: smtpUsername,
        pass: smtpPassword,
      },
    });

    await transporter.sendMail({
      from: smtpUsername,
      to: email,
      subject: sub || "Mail",
      html,
    });

    // Step 3: Connect to IMAP and append to "Sent"
    const imapConfig = {
      imap: {
        user: smtpUsername,
        password: smtpPassword,
        host: imapHost,
        port: imapPort,
        tls: true,
        authTimeout: 5000,
      },
    };

    const connection = await imaps.connect(imapConfig);

    // Try different folder names if needed:
    const sentFolder = "INBOX.Sent"; // or "Sent", "Sent Items", etc.
    await connection.openBox(sentFolder);

    await connection.append(raw, {
      mailbox: sentFolder,
      flags: ["\\Seen"],
      date: new Date(),
    });

    await connection.end();
    console.log("Email sent and appended to Sent folder");
  } catch (error) {
    console.error("Failed to send email or append to Sent:", error);
  }
};

export default handleMail;
