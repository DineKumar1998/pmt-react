import z from "zod";

export const emailValidation = z.string().email({
  message: "Invalid email",
});

export const passwordValidation = z.string().min(6, {
  message: "Password must be at least 6 characters",
});

export const otpValidation = z.string().min(5, {
  message: "Enter Valid OTP",
});

export const captchaValidation = z.string().min(1, { message: "CAPTCHA verification is required" });

export const dynamicLoginSchema = (isOtpStep: boolean) => {
  return isOtpStep
    ? z.object({
        otp: otpValidation,
      })
    : z.object({
        email: emailValidation,
        password: passwordValidation,
        captcha: captchaValidation,
      });
};

export const forgotPasswordSchema = (step: "email" | "password") => {
  if (step === "email") {
    return z.object({
      email: emailValidation,
      otp: z.string(),
      password: z.string(),
      confirmPassword: z.string(),
    });
  }

  return z
    .object({
      email: emailValidation,
      otp: otpValidation,
      password: passwordValidation,
      confirmPassword: z.string(),
    })
    .refine((data: any) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
};
