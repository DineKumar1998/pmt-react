import { z } from "zod";

export const emailValidation = z
    .string({
        required_error: "Email is required",
    })
    .email({
        message: "Invalid email",
    });

export const passwordValidation = z
    .string({
        required_error: "Password is required",
    })
    .min(6, {
        message: "Password must be at least 6 characters",
    });

export const otpValidation = z
    .string({
        required_error: "OTP is required",
    }).min(1, {
        message: "OTP is required",
    })


export const dynamicLoginSchema = (isOtpStep: boolean) => {
    return isOtpStep
        ? z.object({
            otp: otpValidation,
        })
        : z.object({
            email: emailValidation,
            password: passwordValidation,
        });
};


