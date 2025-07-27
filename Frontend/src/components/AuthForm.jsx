import { useState, useEffect } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaClock,
  FaUser,
  FaEnvelope,
  FaSpinner,
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

export default function AuthForm({ isLogin = true, onToggle, onSuccess }) {
  const {
    sendVerificationOTP,
    verifyEmailOTP,
    resendVerificationOTP,
    register,
    loginWithPassword,
    sendSigninOTP,
    verifySigninOTP,
    resendSigninOTP,
    isEmailVerified,
    emailVerificationSent,
    isVerifyingOtp,
    signinMethod,
    setSigninMethod,
    signinOtpSent,
    signinOtpVerified,
    isVerifyingSigninOtp,
    resetSigninOtpStates,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [signinOtp, setSigninOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [signinEmail, setSigninEmail] = useState("");
  const [signinCountdown, setSigninCountdown] = useState(0);

  // Countdown timer effects
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    let timer;
    if (signinCountdown > 0) {
      timer = setTimeout(() => setSigninCountdown(signinCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [signinCountdown]);

  const handleSendVerification = async () => {
    if (email && email.includes("@")) {
      try {
        await sendVerificationOTP(email, username);
        setCountdown(60);
        setOtp("");
      } catch (error) {
        console.error("Failed to send verification OTP:", error);
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendVerificationOTP(email, username);
      setCountdown(60);
      setOtp("");
    } catch (error) {
      console.error("Failed to resend OTP:", error);
    }
  };

  const handleSendSigninOtp = async () => {
    if (signinEmail && signinEmail.includes("@")) {
      try {
        await sendSigninOTP(signinEmail);
        setSigninCountdown(60);
        setSigninOtp("");
      } catch (error) {
        console.error("Failed to send signin OTP:", error);
      }
    }
  };

  const handleResendSigninOtp = async () => {
    try {
      await resendSigninOTP(signinEmail);
      setSigninCountdown(60);
      setSigninOtp("");
    } catch (error) {
      console.error("Failed to resend signin OTP:", error);
    }
  };

  const handleVerifySigninOtp = async () => {
    if (signinOtp.length === 6) {
      try {
        await verifySigninOTP(signinEmail, signinOtp);
        // Signin successful - show success message in purple/ethesis style
        onSuccess?.(
          "login",
          "🎉 Signed In Successfully!",
          `Welcome back! You have been signed in via OTP.`,
          {
            color: "bg-gradient-to-r from-purple-600 to-indigo-500 text-white",
            border: "border-2 border-purple-400",
          }
        );
      } catch (error) {
        console.error("Failed to verify signin OTP:", error);
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length === 6) {
      try {
        await verifyEmailOTP(email, otp);
        // Email verified successfully - show success message
        onSuccess?.(
          "verification",
          "✅ Email Verified!",
          "Great! Your email has been verified successfully. You can now complete your registration."
        );
      } catch (error) {
        console.error("Failed to verify email OTP:", error);
      }
    }
  };

  const handleSignup = async () => {
    console.log("Frontend form data before registration:", {
      username,
      email,
      password: password.length > 0 ? "[PRESENT]" : "[MISSING]",
    });

    // Validate required fields
    if (!isEmailVerified || password.length < 6) {
      alert(
        "Please verify your email and ensure password is at least 6 characters long."
      );
      return;
    }

    // Prepare basic registration data - ONLY username, email, and password
    const registrationData = {
      username,
      email,
      password,
    };

    try {
      const response = await register(registrationData);

      console.log("Registration response:", response);

      // Check if registration was successful from backend
      if (response && (response.success === true || response.status === 201)) {
        // Registration successful - show success message
        onSuccess?.(
          "signup",
          "🎉 Registration Successful!",
          `Welcome ${username}! Your account has been created successfully. You can now login and complete your profile!`
        );
        console.log("Registration successful for user:", username);
      } else {
        console.error("Registration failed: No success response from backend");
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      // Show error message to user
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";
      alert(`Registration failed: ${errorMessage}`);
    }
  };

  const handleLoginWithPassword = async () => {
    if (signinMethod === "username" && password.length >= 1) {
      try {
        await loginWithPassword(username, password);
        // Login successful - show success message
        onSuccess?.(
          "login",
          "🚀 Welcome Back!",
          `Great to see you again, ${username}! You have successfully logged into your account.`
        );
      } catch (error) {
        console.error("Login failed:", error);
      }
    }
  };

  const isSignupEnabled = isLogin || (isEmailVerified && password.length >= 6);
  const isSigninEnabled =
    !isLogin ||
    (signinMethod === "username"
      ? password.length >= 1
      : signinMethod === "email"
      ? signinOtpVerified
      : false);

  return (
    <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6">
        {isLogin ? "Sign in" : "Sign up"}
      </h2>

      {/* Signin Method Selection */}
      {isLogin && !signinMethod && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-4 text-center">
            Choose your sign in method
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSigninMethod("username")}
              className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all group"
            >
              <FaUser
                className="text-gray-500 group-hover:text-gray-700 mb-2"
                size={20}
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                Username/Email
              </span>
              <span className="text-xs text-gray-500">
                Use credentials & password
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSigninMethod("email")}
              className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all group"
            >
              <FaEnvelope
                className="text-gray-500 group-hover:text-gray-700 mb-2"
                size={20}
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                Email ID
              </span>
              <span className="text-xs text-gray-500">Use email & OTP</span>
            </button>
          </div>
        </div>
      )}

      {/* Username or Email */}
      {(!isLogin || signinMethod === "username") && (
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Username or Email
          </label>
          <input
            type="text"
            placeholder="@john_doe or example@mail.com"
            value={username}
            onChange={(e) => {
              console.log("Username/Email changed:", e.target.value);
              setUsername(e.target.value);
            }}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
      )}

      {/* Signin Email (only for email signin method) */}
      {isLogin && signinMethod === "email" && (
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Email ID
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="example@mail.com"
              value={signinEmail}
              onChange={(e) => setSigninEmail(e.target.value)}
              disabled={signinOtpVerified}
              className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                signinOtpVerified ? "bg-green-50 border-green-300" : ""
              }`}
            />
            {!signinOtpSent && (
              <button
                type="button"
                onClick={handleSendSigninOtp}
                disabled={!signinEmail || !signinEmail.includes("@")}
                className="px-4 py-2 bg-gradient-to-b from-gray-900 to-gray-700 text-white rounded-lg hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed transition text-sm whitespace-nowrap"
              >
                Send OTP
              </button>
            )}
            {signinOtpVerified && (
              <div className="flex items-center px-3 py-2 bg-green-100 rounded-lg">
                <FaCheck className="text-green-600" size={16} />
              </div>
            )}
          </div>

          {/* Signin email verification status */}
          {signinOtpSent && !signinOtpVerified && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <FaClock size={12} />
                OTP sent! Check your inbox.
              </p>
              {signinCountdown > 0 ? (
                <p className="text-xs text-gray-500 mt-1">
                  Resend OTP in 0:{signinCountdown.toString().padStart(2, "0")}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendSigninOtp}
                  className="text-xs text-blue-600 hover:text-blue-800 hover:underline mt-1 cursor-pointer font-medium bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-all"
                >
                  Didn't receive OTP? Resend
                </button>
              )}
            </div>
          )}
          {signinOtpVerified && (
            <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
              <FaCheck size={12} />
              Email verified successfully!
            </p>
          )}
        </div>
      )}

      {/* Signin OTP Input */}
      {isLogin &&
        signinMethod === "email" &&
        signinOtpSent &&
        !signinOtpVerified && (
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Enter OTP
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="123456"
                value={signinOtp}
                onChange={(e) =>
                  setSigninOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                maxLength={6}
              />
              <button
                type="button"
                onClick={handleVerifySigninOtp}
                disabled={signinOtp.length !== 6 || isVerifyingSigninOtp}
                className="px-4 py-2 bg-gradient-to-b from-gray-900 to-gray-700 text-white rounded-lg hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed transition text-sm whitespace-nowrap flex items-center gap-1"
              >
                {isVerifyingSigninOtp ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
            <p className="text-xs text-black mt-1">
              Enter the 6-digit code sent to your email
            </p>
          </div>
        )}

      {/* Email (only for register) */}
      {!isLogin && (
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => {
                console.log("Email changed:", e.target.value);
                setEmail(e.target.value);
              }}
              disabled={isEmailVerified}
              className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                isEmailVerified ? "bg-green-50 border-green-300" : ""
              }`}
            />
            {!emailVerificationSent && (
              <button
                type="button"
                onClick={handleSendVerification}
                disabled={!email || !email.includes("@")}
                className="px-4 py-2 bg-gradient-to-b from-gray-900 to-gray-700 text-white rounded-lg hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed transition text-sm whitespace-nowrap"
              >
                Verify Email
              </button>
            )}
            {isEmailVerified && (
              <div className="flex items-center px-3 py-2 bg-green-100 rounded-lg">
                <FaCheck className="text-green-600" size={16} />
              </div>
            )}
          </div>

          {/* Email verification status */}
          {emailVerificationSent && !isEmailVerified && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <FaClock size={12} />
                Verification email sent! Check your inbox.
              </p>
              {countdown > 0 ? (
                <p className="text-xs text-gray-500 mt-1">
                  Resend OTP in 0:{countdown.toString().padStart(2, "0")}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-xs text-blue-600 hover:text-blue-800 hover:underline mt-1 cursor-pointer font-medium bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-all"
                >
                  Didn't receive OTP? Resend
                </button>
              )}
            </div>
          )}
          {isEmailVerified && (
            <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
              <FaCheck size={12} />
              Email verified successfully!
            </p>
          )}
        </div>
      )}

      {/* OTP Input (only when verification email is sent and not yet verified) */}
      {!isLogin && emailVerificationSent && !isEmailVerified && (
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Enter OTP
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              maxLength={6}
            />
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={otp.length !== 6 || isVerifyingOtp}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition text-sm whitespace-nowrap flex items-center gap-1"
            >
              {isVerifyingOtp ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter the 6-digit code sent to your email
          </p>
        </div>
      )}

      {/* Password */}
      {((!isLogin && isEmailVerified) ||
        (isLogin && signinMethod === "username")) && (
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            {/* Forgot password removed as requested */}
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>
          {!isLogin && password && (
            <div className="mt-2">
              <div className="flex text-xs gap-4">
                <span
                  className={
                    password.length >= 6 ? "text-green-600" : "text-gray-400"
                  }
                >
                  ✓ At least 6 characters
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      {(!isLogin ||
        (isLogin &&
          signinMethod &&
          (signinMethod === "username" || signinOtpVerified))) && (
        <button
          disabled={isLogin ? !isSigninEnabled : !isSignupEnabled}
          onClick={isLogin ? handleLoginWithPassword : handleSignup}
          className={`w-full py-2 rounded-lg transition ${
            (isLogin ? isSigninEnabled : isSignupEnabled)
              ? "bg-gradient-to-b from-gray-900 to-gray-700 text-white hover:opacity-90"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isLogin ? "Sign in" : "Sign up"}
        </button>
      )}

      {/* Back button for signin method selection */}
      {isLogin && signinMethod && (
        <button
          type="button"
          onClick={() => {
            setSigninMethod(null);
            setSigninEmail("");
            setSigninOtp("");
            resetSigninOtpStates();
            setSigninCountdown(0);
            setPassword("");
          }}
          className="w-full mt-3 py-2 text-gray-600 hover:text-gray-800 transition text-sm"
        >
          ← Back to sign in options
        </button>
      )}

      <p className="text-center mt-4 text-sm text-gray-600">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={onToggle}
          className="text-gray-700 hover:text-gray-900 font-medium hover:underline"
        >
          {isLogin ? "Sign up" : "Sign in"}
        </button>
      </p>
    </div>
  );
}
