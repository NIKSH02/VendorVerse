import { useState } from "react";
import FeatureList from "../components/FeatureList";
import AuthForm from "../components/AuthForm";
import SuccessMessage from "../components/SuccessMessage";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [successMessage, setSuccessMessage] = useState({
    show: false,
    type: "signup",
    title: "",
    message: "",
    onCompleteCallback: null,
  });

  const showSuccessMessage = (type, title, message, onCompleteCallback = null) => {
    setSuccessMessage({
      show: true,
      type,
      title,
      message,
      onCompleteCallback,
    });
  };

  const hideSuccessMessage = () => {
    setSuccessMessage((prev) => ({ ...prev, show: false }));

    // Execute callback if provided (e.g., switch to login or redirect)
    if (successMessage.onCompleteCallback) {
      successMessage.onCompleteCallback();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Desktop Layout */}
      <div className="hidden md:flex justify-center items-center min-h-screen py-4">
        <div className="flex flex-row gap-10 items-center justify-center max-w-6xl w-full px-4 md:px-6">
          <FeatureList />
          <AuthForm
            isLogin={isLogin}
            onToggle={() => setIsLogin((prev) => !prev)}
            onSuccess={showSuccessMessage}
          />
        </div>
      </div>
      
      {/* Mobile Layout - Centered with proper spacing */}
      <div className="flex md:hidden flex-col justify-center items-center min-h-screen py-8 px-4">
        <div className="flex flex-col gap-8 items-center justify-center w-full max-w-md mt-32">
          <AuthForm
            isLogin={isLogin}
            onToggle={() => setIsLogin((prev) => !prev)}
            onSuccess={showSuccessMessage}
          />
          <FeatureList />
        </div>
      </div>

      {/* Success Message Modal */}
      <SuccessMessage
        show={successMessage.show}
        type={successMessage.type}
        title={successMessage.title}
        message={successMessage.message}
        onClose={hideSuccessMessage}
      />
    </div>
  );
}
