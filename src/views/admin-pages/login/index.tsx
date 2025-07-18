import { useContext, useState } from "react";
import TextBox from "@/views/components/TextBox";
import Button from "@/views/components/button";

import type { FieldValues, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dynamicLoginSchema } from "@/validations/authValidator";
import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { loginUser, verifyOtp } from "@/apis/auth";
import { ToastContainer, toast } from "react-toastify";

// import { AUTH } from "@/utils/constants";
import AuthContext from "@/context/AuthContext";
import ReCAPTCHA from 'react-google-recaptcha';
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
import "./login.scss"; // Assuming a CSS file for styling

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [state, setState] = useState({
    showOtpView: false,
    otp: null as string | null,
  });

  const [storedEmail, setStoredEmail] = useState<string>("");

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue
  } = useForm<{ email?: string; password?: string; otp?: string; captcha?: string }>({
    resolver: zodResolver(dynamicLoginSchema(state.showOtpView) as any),
    defaultValues: state.showOtpView
      ? { otp: "" }
      : { email: "", password: "", captcha: "123" },
  });

  console.log("RECAPTCHA_SITE_KEY=", RECAPTCHA_SITE_KEY)

  const { mutateAsync: loginMutate, isPending } = useMutation({
    mutationFn: (body: { email: string; password: string }) => loginUser(body),
    onSuccess: (data: any) => {
      if (data?.error) {
        return toast.error(data.error, {
          hideProgressBar: true,
        });
      }

      setState((prev) => ({
        ...prev,
        showOtpView: true,
        otp: data.otp,
      }));
    },
  });

  //todo
  const { mutate: otpMutate, isPending: otpPending } = useMutation({
    mutationFn: (body: any) => verifyOtp(body),
    onSuccess: (data) => {
      console.log("otp success data=", data);
      if (data?.error) {
        return toast.error(data.error, {
          hideProgressBar: true,
        });
      }

      // localStorage.setItem(AUTH.TOKEN_KEY, data.authToken);
      // localStorage.setItem(AUTH.USER_ID, data.user?.id);

      // localStorage.setItem(
      //   AUTH.USER_NAME,
      //   [data.user?.first_name, data.user?.last_name].filter(Boolean).join(" ")
      // );
      // localStorage.setItem(AUTH.USER_TYPE, data.user?.user_type);

      // if (data.user?.profile_img) {
      //   localStorage.setItem(AUTH.PROFILE_IMG, data.user.profile_img);
      // }



      login(
        data.authToken,
        data.user?.id,
        data.user?.first_name,
        data.user?.last_name,
        data.user?.profile_img,
        data.user?.user_type
      );


      navigate("/dashboard");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong.";
      console.error("Otp error =", message);

      // Fix for toast not working
      alert(message); // Fallback to alert
    },
  });


  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      if (data.email && data.password) {
        console.log("Email:", data.email);
        console.log("Password:", data.password);
        setStoredEmail(data.email);

        //API Call
        await loginMutate({ email: data.email, password: data.password });
      } else {
        if (data.otp) {
          console.log("Email from state:", storedEmail);
          //API Call
          otpMutate({
            email: storedEmail,
            otp: data.otp,
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      // Fix for toast not working
      alert("An error occurred during login. Please try again.");
    }
  };

  const handleCaptchaChange = (value: string | null) => {
    console.log("Captcha value:", value);
    setValue("captcha", value || "");
  };

  return (
    <div className="login-container">
      <ToastContainer /> {/* Add ToastContainer to display toasts */}
      <div className="login-welcome-section">
        <h2 style={{ marginBottom: 20 }}>Welcome</h2>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="login-form-section">
        <h1 style={{ marginBottom: 35, fontSize: "2.5em" }}>P-I cube</h1>

        <p className="text-primary" style={{ fontSize: "1.5em" }}>
          Greetings
        </p>

        {state.showOtpView ? (
          <>
            <p>An OTP has been shared on your registered email</p>
            <div className="form-fields">
              <TextBox
                label="OTP"
                name="otp"
                type={"number"}
                placeholder="Enter OTP"
                errors={errors}
                control={control}
              />

              {state.otp && (
                <p>
                  OTP (Testing purpose only): <strong>{state.otp}</strong>
                </p>
              )}

              <div style={{ marginTop: 10 }}>
                <Button
                  text={otpPending ? "Verifying" : "Login"}
                  type="submit"
                  onClick={() => null}
                  disabled={otpPending}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <p>Please Enter your details to login</p>
            <div className="form-fields">
              <TextBox
                name="email"
                placeholder="Enter your email"
                errors={errors}
                control={control}
              />

              <TextBox
                label="Password"
                name="password"
                type={"password"}
                placeholder="Password"
                errors={errors}
                control={control}
              />

              <ReCAPTCHA
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={handleCaptchaChange}
              />
              {errors?.captcha && (
                <p className="form-error">{errors.captcha.message}</p>
              )}
              <div style={{ marginTop: 10 }}>
                <Button
                  text={isPending ? "Verifying" : "Submit"}
                  type="submit"
                  onClick={() => null}
                  disabled={isPending}
                />
              </div>
              <Link
                to={"/forgot-password"}
                className="forgot-password text-primary"
              >
                Forgot Password?
              </Link>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default Login;
