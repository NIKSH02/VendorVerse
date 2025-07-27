import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FeatureList from "../components/FeatureList";
import AuthForm from "../components/AuthForm";
import SuccessMessage from "../components/SuccessMessage";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [successMessage, setSuccessMessage] = useState({
    show: false,
    type: "signup",
    title: "",
    message: "",
  });

  const showSuccessMessage = (type, title, message) => {
    setSuccessMessage({
      show: true,
      type,
      title,
      message,
    });
  };

  const hideSuccessMessage = () => {
    setSuccessMessage((prev) => ({ ...prev, show: false }));

    // Navigate to profile after successful login to complete profile
    if (successMessage.type === "login") {
      navigate("/LocationChat");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex justify-center items-center">
      <div className="flex flex-col md:flex-row gap-10 items-center justify-center max-w-6xl w-full px-6">
        <FeatureList />
        <AuthForm
          isLogin={isLogin}
          onToggle={() => setIsLogin((prev) => !prev)}
          onSuccess={showSuccessMessage}
        />
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
