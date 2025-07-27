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
import { useNavigate } from "react-router-dom";



export default function AuthForm({ isLogin = true, onToggle, onSuccess }) {
  const {
    sendVerificationOTP,
    verifyEmailOTP,
    resendVerificationOTP,
    register,
    loginWithPassword,
    isEmailVerified,
    emailVerificationSent,
    isVerifyingOtp,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [registrationInProgress, setRegistrationInProgress] = useState(false);

  let navigate = useNavigate();

  // Countdown timer effects
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendVerification = async () => {
    if (email && email.includes("@")) {
      try {
        await sendVerificationOTP(email, username);
        setCountdown(60);
        setOtp("");
        setRegistrationInProgress(true); // Mark registration as in progress
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
      fullname: username,
    });

    // Validate required fields
    if (!isEmailVerified || password.length < 6 || !username.trim()) {
      alert(
        "Please verify your email, provide a username, and ensure password is at least 6 characters long."
      );
      return;
    }

    // Prepare basic registration data (no location during registration)
    const registrationData = {
      username,
      email,
      password,
      fullname: username,
      name: username, // Display name
      phone: "", // Will be completed in profile later
    };

    try {
      const response = await register(registrationData);

      console.log("Registration response:", response);

      // Check if registration was successful from backend
      if (response && (response.success === true || response.status === 201)) {
        // Registration successful - show success message and switch to login
        setRegistrationInProgress(false); // Reset registration progress
        onSuccess?.(
          "signup",
          "🎉 Registration Successful!",
          `Welcome ${username}! Your account has been created successfully. You can now login and complete your profile!`,
          () => onToggle() // Switch to login form after success message
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
    if (username && password.length >= 1) {
      try {
        await loginWithPassword(username, password);
        // Login successful - show success message with redirect callback
        onSuccess?.(
          "login",
          "🚀 Welcome Back!",
          `Great to see you again, ${username}! You have successfully logged into your account.`,
          () => navigate('/locationchat') // Redirect to profile after timeout
        );
      } catch (error) {
        console.error("Login failed:", error);
      }
    }
  };

  const handleToggleAuth = () => {
    // Prevent toggling if registration is in progress and email is verified but password not set
    if (registrationInProgress && isEmailVerified && !password) {
      alert("Please complete your registration by setting a password before switching to login.");
      return;
    }
    
    // Reset all states when switching
    setRegistrationInProgress(false);
    setEmail("");
    setUsername("");
    setOtp("");
    setPassword("");
    setCountdown(0);
    
    onToggle();
  };

  const isSignupEnabled = !isLogin && (isEmailVerified && password.length >= 6);
  const isSigninEnabled = isLogin ? (username && password.length >= 1) : false;

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 md:p-8 w-full max-w-md border border-orange-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center md:text-left">
        {isLogin ? "Sign in" : "Sign up"}
      </h2>

      {/* Username or Email (always shown for login) */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {isLogin ? "Username or Email" : "Username"}
        </label>
        <input
          type="text"
          placeholder={isLogin ? "@john_doe or example@mail.com" : "@john_doe"}
          value={username}
          onChange={(e) => {
            console.log("Username/Email changed:", e.target.value);
            setUsername(e.target.value);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

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
              className={`flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                isEmailVerified ? "bg-green-50 border-green-300" : ""
              }`}
            />
            {!emailVerificationSent && (
              <button
                type="button"
                onClick={handleSendVerification}
                disabled={!email || !email.includes("@")}
                className="px-3 md:px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition text-xs md:text-sm whitespace-nowrap"
              >
                Verify
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
                  className="text-xs text-orange-600 hover:text-orange-800 hover:underline mt-1 cursor-pointer font-medium bg-orange-50 hover:bg-orange-100 px-2 py-1 rounded transition-all"
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
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              maxLength={6}
            />
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={otp.length !== 6 || isVerifyingOtp}
              className="px-3 md:px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition text-xs md:text-sm whitespace-nowrap flex items-center gap-1"
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
      {((!isLogin && isEmailVerified) || isLogin) && (
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Password {!isLogin && isEmailVerified && !password && (
                <span className="text-orange-600 font-normal">(Required to complete registration)</span>
              )}
            </label>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
          {!isLogin && isEmailVerified && !password && (
            <p className="text-sm text-orange-600 mt-2 flex items-center gap-1">
              <FaClock size={12} />
              Please set a password to complete your registration
            </p>
          )}
        </div>
      )}

      {/* Submit Button */}
      <button
        disabled={isLogin ? !isSigninEnabled : !isSignupEnabled}
        onClick={isLogin ? handleLoginWithPassword : handleSignup}
        className={`w-full py-3 rounded-lg transition font-medium ${
          (isLogin ? isSigninEnabled : isSignupEnabled)
            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transform hover:scale-[1.02]"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {isLogin ? "Sign in" : "Sign up"}
      </button>

		<p className="text-center mt-4 text-sm text-gray-600">
		{isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
		<button
			onClick={handleToggleAuth}
			className="text-orange-600 hover:text-orange-800 font-medium hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
			disabled={isVerifyingOtp || (registrationInProgress && emailVerificationSent && !isEmailVerified)}
		>
			{isLogin ? "Sign up" : "Sign in"}
		</button>
		</p>
    </div>
  );
}
