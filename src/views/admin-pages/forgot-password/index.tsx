import { useState } from "react";
import TextBox from "@/views/components/TextBox";
import Button from "@/views/components/button";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword, resetPassword } from "@/apis/auth";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/validations/authValidator";
import "./forgot.scss";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema(step)),
    defaultValues: {
      email: "",
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Send OTP mutation
  const { mutateAsync: sendOtpMutate, isPending: isSendingOtp } = useMutation({
    mutationFn: (email: string) => forgotPassword(email),
    onSuccess: (data) => {
      console.log(data,'data')
      toast.success(data?.message || "OTP sent to your email");
      setEmail(watch("email"));
      setStep("password");
    },
    onError: (error: any) => {
      console.log(error,'error')
      toast.error(error.message || "Failed to send OTP");
    },
  });

  // Reset password mutation (with OTP)
  const { mutate: resetPasswordMutate, isPending: isResetting } = useMutation({
    mutationFn: (data: { email: string; otp: string; password: string }) =>
      resetPassword(data),
    onSuccess: () => {
      toast.success("Password reset successfully");
      navigate("/login");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reset password");
    },
  });

  const handleEmailSubmit = async (data: { email: string }) => {
    await sendOtpMutate(data.email);
  };

  const handlePasswordSubmit = async (data: {
    otp: string;
    password: string;
    confirmPassword: string;
  }) => {
    console.log(data,'data')
    resetPasswordMutate({
      email,
      otp: data.otp,
      password: data.password
    });

  };

  return (
    <div className="login-container">
      <div className="login-welcome-section">
        <h2 style={{ marginBottom: 20 }}>Reset Password</h2>
        <p>
          Enter your email to receive an OTP, then set a new password.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(
          step === "email" ? handleEmailSubmit : handlePasswordSubmit
        )}
        className="login-form-section"
      >
        <h1 style={{ marginBottom: 35, fontSize: "2.5em" }}>PI3 - PMT</h1>

        {step === "email" ? (
          <>
            <p>Enter your email to receive OTP</p>
            <div className="form-fields">
              <TextBox
                label="Email"
                name="email"
                type="email"
                placeholder="Enter your email"
                errors={errors}
                control={control}
              />

              <div style={{ marginTop: 10 }}>
                <Button
                onClick={()=>{}}
                  text={isSendingOtp ? "Sending..." : "Send OTP"}
                  type="submit"
                  disabled={isSendingOtp}
                />
              </div>

              <div style={{ marginTop: 20 }}>
                <Link to="/login" className="forgot-password text-primary">
                  Back to Login
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <p>Enter OTP and set new password for {email}</p>
            <div className="form-fields">
              <TextBox
                label="OTP"
                name="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                errors={errors}
                control={control}
              />

              <TextBox
                label="New Password"
                name="password"
                type="password"
                placeholder="Enter new password"
                errors={errors}
                control={control}
              />

              <TextBox
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                errors={errors}
                control={control}
              />

              <div style={{ marginTop: 10 }}>
                <Button
                onClick={()=>{}}

                  text={isResetting ? "Resetting..." : "Reset Password"}
                  type="submit"
                  disabled={isResetting}
                />
              </div>

                <button
                  type="button"
                  className="back-email-btn text-primary"
                  onClick={() => setStep("email")}
                >
                  Back to Email
                </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;