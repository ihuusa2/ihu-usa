'use server'

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mongo";
import { Collection } from "mongodb";
import { CourseForm, PaymentStatus, RegisterForm } from "@/Types/Form";
import { Donation, DonationStatus } from "@/Types/Donation";
import handleMail from "../mail";
import RegistrationMailTemplate, { CourseMailTemplate, RegistrationMailTemplateForStudent } from "@/Template";
const CourseRegForm: Collection<CourseForm> = db.collection("CourseRegForm")
const Registration: Collection<RegisterForm> = db.collection("Registration")
const Donate: Collection<Donation> = db.collection("Donate")

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID as string;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET as string;
const YOUR_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID as string;

export async function POST(req: NextRequest) {
    const rawBody = await req.text(); // Required for signature verification
    const headers = req.headers;

    async function getAccessToken() {
        const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

        const res = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'grant_type=client_credentials',
        });

        const data = await res.json();
        return data.access_token;
    }

    async function verifyWebhook(rawBody: string, headers: Headers) {
        const accessToken = await getAccessToken();

        const verificationRes = await fetch('https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                auth_algo: headers.get('paypal-auth-algo'),
                cert_url: headers.get('paypal-cert-url'),
                transmission_id: headers.get('paypal-transmission-id'),
                transmission_sig: headers.get('paypal-transmission-sig'),
                transmission_time: headers.get('paypal-transmission-time'),
                webhook_id: YOUR_WEBHOOK_ID,
                webhook_event: JSON.parse(rawBody),
            }),
        });

        const result = await verificationRes.json();

        const event = JSON.parse(rawBody);
        const verificationStatus = result.verification_status;

        if (verificationStatus === 'SUCCESS') {
            switch (event.event_type) {
                case 'PAYMENT.SALE.COMPLETED':
                    console.log('💰 Processing PAYMENT.SALE.COMPLETED for orderId:', event.resource.id);
                    
                    // Update payment status for completed payments
                    const courseUpdateResult = await CourseRegForm.updateMany({ orderId: event.resource.id }, {
                        $set: {
                            status: PaymentStatus.COMPLETED,
                            transactionId: event.resource.id,
                        }
                    });
                    console.log('📚 CourseRegForm update result:', courseUpdateResult);

                    const regUpdateResult = await Registration.updateMany({ orderId: event.resource.id }, {
                        $set: {
                            paymentStatus: PaymentStatus.COMPLETED
                        }
                    });
                    console.log('📝 Registration update result:', regUpdateResult);

                    // Also update by registration number if orderId doesn't match
                    if (regUpdateResult.matchedCount === 0) {
                        console.log('⚠️ No Registration found with orderId, trying to find by registration number...');
                        const courseData = await CourseRegForm.find({ orderId: event.resource.id }).toArray();
                        if (courseData.length > 0) {
                            const registrationNumbers = courseData.map(course => course.registrationNumber);
                            const regByNumberResult = await Registration.updateMany(
                                { registrationNumber: { $in: registrationNumbers } },
                                { $set: { paymentStatus: PaymentStatus.COMPLETED } }
                            );
                            console.log('📝 Registration update by registration number result:', regByNumberResult);
                        }
                    }

                    // Handle donation payments
                    const donationUpdateResult1 = await Donate.updateMany({ transactionId: event.resource.id }, {
                        $set: {
                            status: DonationStatus.COMPLETED,
                            transactionId: event.resource.id,
                        }
                    });
                    console.log('💝 Donation update result:', donationUpdateResult1);
                    break;

                case 'PAYMENT.SALE.DENIED':
                    // Notify user of failure
                    await CourseRegForm.updateMany({ orderId: event.resource.id }, {
                        $set: {
                            status: PaymentStatus.FAILED
                        }
                    })

                    // Handle failed donation payments
                    await Donate.updateMany({ transactionId: event.resource.id }, {
                        $set: {
                            status: DonationStatus.FAILED
                        }
                    })
                    break;

                case 'CHECKOUT.ORDER.APPROVED':
                    console.log('✅ Processing CHECKOUT.ORDER.APPROVED for orderId:', event.resource.id);
                    
                    const course = await CourseRegForm.updateMany({ orderId: event.resource.id }, {
                        $set: {
                            status: PaymentStatus.COMPLETED,
                            transactionId: event.resource.id,
                        }
                    });
                    console.log('📚 CourseRegForm update result:', course);

                    if (course.matchedCount > 0 && course.modifiedCount > 0 && course.acknowledged) {
                        const courseData = await CourseRegForm.find({ orderId: event.resource.id }).toArray()
                        const regData = await Registration.findOne({ registrationNumber: courseData[0]?.registrationNumber }) as RegisterForm

                        await handleMail({
                            email: process.env.NODEMAILER_PUBLIC_EMAIL as string,
                            html: CourseMailTemplate({ data: courseData, userData: regData }),
                            sub: "New Course Registration",
                        })
                    }

                    const reg = await Registration.updateMany({ orderId: event.resource.id }, {
                        $set: {
                            paymentStatus: PaymentStatus.COMPLETED
                        }
                    });
                    console.log('📝 Registration update result:', reg);

                    // Also update by registration number if orderId doesn't match
                    if (reg.matchedCount === 0) {
                        console.log('⚠️ No Registration found with orderId, trying to find by registration number...');
                        const courseData = await CourseRegForm.find({ orderId: event.resource.id }).toArray();
                        if (courseData.length > 0) {
                            const registrationNumbers = courseData.map(course => course.registrationNumber);
                            const regByNumberResult = await Registration.updateMany(
                                { registrationNumber: { $in: registrationNumbers } },
                                { $set: { paymentStatus: PaymentStatus.COMPLETED } }
                            );
                            console.log('📝 Registration update by registration number result:', regByNumberResult);
                        }
                    }

                    if (reg.matchedCount > 0 && reg.modifiedCount > 0 && reg.acknowledged) {
                        const regData = await Registration.findOne({ orderId: event.resource.id }) as RegisterForm

                        await handleMail({
                            email: process.env.NODEMAILER_PUBLIC_EMAIL as string,
                            html: RegistrationMailTemplate({ data: regData }),
                            sub: "New Course Registration",
                        })

                        await handleMail({
                            email: regData.emailAddress as string,
                            html: RegistrationMailTemplateForStudent({ data: regData }),
                            sub: "Registration Confirmation",
                        })

                        console.log("📧 Mail sent to student")
                    }

                    // Handle donation payments
                    const donationUpdateResult2 = await Donate.updateMany({ orderId: event.resource.id }, {
                        $set: {
                            status: DonationStatus.COMPLETED,
                            transactionId: event.resource.id,
                        }
                    });
                    console.log('💝 Donation update result:', donationUpdateResult2);

                    break;

                default:
                    console.log('Unhandled event:', event.event_type);
            }
        } else {
            console.warn('⚠️ Invalid webhook signature received!');
        }

        return result.verification_status === 'SUCCESS';
    }

    const isVerified = await verifyWebhook(rawBody, headers);

    if (isVerified) {
        console.log('Webhook verified successfully!');
        return NextResponse.json({ status: 'success' });
    } else {
        console.error('Webhook verification failed!');
        return NextResponse.json({ status: 'error' }, { status: 400 });
    }
}