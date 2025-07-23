# Environment Setup Guide

## Image Upload Issue Resolution

The "Main image upload failed" error occurs because the `CLOUDINARY_API_KEY` environment variable is not configured. Here's how to fix it:

### 1. Create Environment File

Create a `.env.local` file in the root directory of your project with the following variables:

```env
# Cloudinary Configuration (Required for image uploads)
CLOUDINARY_API_KEY=your_cloudinary_api_key_here

# MongoDB Configuration
MONGODBURL=your_mongodb_connection_string_here

# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
PAYPAL_WEBHOOK_ID=your_paypal_webhook_id_here
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here

# Email Configuration
SMTP_HOST=smtp.hostinger.com
SMTP_USERNAME=your_smtp_username_here
SMTP_PASSWORD=your_smtp_password_here
SMTP_PORT=587
SMTP_SECURE=false
IMAP_HOST=imap.hostinger.com
IMAP_PORT=993
NODEMAILER_EMAIL=your_email_here
NODEMAILER_PW=your_email_password_here
NODEMAILER_PUBLIC_EMAIL=your_public_email_here

# Contact Form Configuration
CONTACT_FORM_EMAIL=your_contact_email_here
REGISTRATION_FORM_EMAIL=your_registration_email_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### 2. Get Cloudinary API Key

1. Go to [Cloudinary Console](https://cloudinary.com/console)
2. Sign in to your account
3. Go to Settings > Access Keys
4. Copy your API Key
5. Replace `your_cloudinary_api_key_here` in the `.env.local` file

### 3. Restart Development Server

After creating the `.env.local` file, restart your development server:

```bash
npm run dev
# or
yarn dev
```

### 4. Test Image Upload

Try uploading an image in the course edit form. The upload should now work properly.

## What Was Fixed

- **Issue**: The original code tried to access `process.env.CLOUDINARY_API_KEY` on the client side, but environment variables without `NEXT_PUBLIC_` prefix are only available on the server side in Next.js.

- **Solution**: Created a new API route (`/api/upload`) that handles file uploads on the server side where environment variables are accessible, and updated the client-side upload functions to use this API route.

## Files Modified

1. `src/app/api/upload/route.ts` - New API route for handling uploads
2. `src/functions/cloudinary.ts` - Updated to use the API route instead of direct Cloudinary calls

## Additional Notes

- The `.env.local` file should be added to `.gitignore` to keep sensitive information out of version control
- Make sure to restart the development server after adding environment variables
- If you're deploying to production, make sure to set these environment variables in your hosting platform 