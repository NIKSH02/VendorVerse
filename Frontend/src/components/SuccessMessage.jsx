import { useState, useEffect } from 'react';
import { FaCheckCircle, FaStar, FaRocket, FaTimes } from 'react-icons/fa';

export default function SuccessMessage({ 
  show, 
  onClose, 
  title = "Welcome Aboard!", 
  message = "Your account has been created successfully!",
  type = "signup" // "signup", "login", "verification"
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState([]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Generate floating particles
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
        left: Math.random() * 100,
        size: 8 + Math.random() * 8
      }));
      setParticles(newParticles);

      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onClose();
        }, 300);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'login':
        return <FaRocket className="text-6xl text-green-500" />;
      case 'verification':
        return <FaCheckCircle className="text-6xl text-blue-500" />;
      default:
        return <FaCheckCircle className="text-6xl text-green-500" />;
    }
  };

  const getGradient = () => {
    switch (type) {
      case 'login':
        return 'from-blue-600 via-purple-600 to-blue-800';
      case 'verification':
        return 'from-indigo-600 via-purple-600 to-pink-600';
      default:
        return 'from-green-600 via-emerald-600 to-teal-600';
    }
  };

  if (!show) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Floating Particles */}
      {particles.map((particle) => (
        <FaStar
          key={particle.id}
          className="absolute text-yellow-300 animate-ping"
          style={{
            left: `${particle.left}%`,
            top: `${20 + Math.random() * 60}%`,
            fontSize: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`
          }}
        />
      ))}

      {/* Success Card */}
      <div className={`relative transform transition-all duration-500 ${isVisible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-8'}`}>
        <div className={`bg-gradient-to-br ${getGradient()} p-1 rounded-2xl shadow-2xl`}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative overflow-hidden">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <FaTimes className="text-xl" />
            </button>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Icon with Animation */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="animate-bounce">
                    {getIcon()}
                  </div>
                  <div className="absolute inset-0 animate-ping">
                    <FaCheckCircle className="text-6xl text-green-300 opacity-30" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
                {title}
              </h2>

              {/* Message */}
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                {message}
              </p>

              {/* Success Indicators */}
              <div className="flex justify-center gap-2 mb-6">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleClose}
                className={`w-full py-3 px-6 bg-gradient-to-r ${getGradient()} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-300`}
              >
                Continue
              </button>

              {/* Fun Message */}
              <div className="mt-4 text-sm text-gray-500">
                🎉 Get ready for an amazing experience!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
