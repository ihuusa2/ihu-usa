'use server'

import handleMail from "@/app/api/mail"
import { db } from "@/lib/mongo"
import { RegisterForm } from "@/Types/Form"
import { Collection, InsertOneResult } from "mongodb"
const Registration: Collection<RegisterForm> = db.collection("Registration")
const Otp = db.collection("Otp")


export const sendOtp = async (registrationNumber: string): Promise<{ message: string; otp?: string }> => {

    if (!registrationNumber) {
        return { message: "Registration number is required" }
    }

    const existingUser = await Registration.findOne({ registrationNumber })

    if (!existingUser) {
        return { message: "User not found" }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpData = {
        registrationNumber,
        otp,
        createdAt: new Date(),
    }

    await handleMail({
        email: existingUser.emailAddress,
        sub: "OTP Verification",
        html: `
            <h1>OTP Verification</h1>
            <p>Your OTP is: <strong>${otp}</strong></p>
            <p>This OTP is valid for 5 minutes.</p>
        `
    })

    const result: InsertOneResult = await Otp.insertOne(otpData)
    if (result.acknowledged) {
        return { message: "OTP sent successfully", otp }
    } else {
        return { message: "Failed to send OTP" }
    }
}


export const verifyOtp = async (registrationNumber: string, otp: string): Promise<{ message: string, isVerified: boolean }> => {
    if (!registrationNumber || !otp) {
        return { message: "Registration number and OTP are required", isVerified: false }
    }

    const otpData = await Otp.findOne({ registrationNumber, otp })

    if (!otpData) {
        return { message: "Invalid OTP", isVerified: false }
    }

    const currentTime = new Date()
    const otpTime = otpData.createdAt
    const timeDiff = Math.abs(currentTime.getTime() - otpTime.getTime()) / 1000 // in seconds

    if (timeDiff > 300) { // 5 minutes
        return { message: "OTP expired", isVerified: false }
    }

    await Otp.deleteOne({ registrationNumber, otp })
    return { message: "OTP verified successfully", isVerified: true }
}
