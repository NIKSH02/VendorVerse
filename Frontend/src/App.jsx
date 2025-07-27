import React, { useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import CommunityRequests from "./pages/CommunityRequests";
import ProductDetail from "./pages/ProductDetail";
import LocationChat from "./pages/LocationChat";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AllItemsPage from "./pages/AllItemsPage";
import AboutPage from "./pages/AboutPage";
// import SpecialItemsPage from "./pages/SpecialItemsPage";
// import RawConnectDashboard from "./pages/RawConnectDashboard";
import { useAuth } from "./hooks/useAuth";
import PersonalChatUI from "./pages/PersonalChatUi";

// App Routes Component - Contains all the routing logic
const AppRoutes = () => {
  // Protected Route Component - Now properly inside the provider
  const ProtectedRoute = ({ children }) => {
    const authContext = useAuth();
    const { isAuthenticated, isLoading, user } = authContext;

    useEffect(() => {
      console.log("ProtectedRoute authContext changed:", { 
        isAuthenticated, 
        isLoading, 
        user: user ? 'USER_EXISTS' : 'NO_USER'
      });
    }, [isAuthenticated, isLoading, user]);

    console.log("ProtectedRoute render:", { 
      isAuthenticated, 
      isLoading, 
      user: user ? 'USER_EXISTS' : 'NO_USER',
      authContext: authContext ? 'CONTEXT_EXISTS' : 'NO_CONTEXT'
    });

    if (isLoading) {
      console.log("ProtectedRoute: Showing loading spinner");
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      console.log("ProtectedRoute: Redirecting to /authpage");
      return <Navigate to="/authpage" replace />;
    }

    console.log("ProtectedRoute: Rendering protected content");
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes - No authentication required */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<PersonalChatUI />} />
        <Route path="/authpage" element={<AuthPage />} />
        <Route path="/global" element={<CommunityRequests />} />
        <Route path="/productdetail" element={<ProductDetail />} />
        {/* Protected Routes - Authentication required */}
        <Route
          path="/locationchat"
          element={
            <ProtectedRoute>
              <LocationChat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Global"
          element={
            <ProtectedRoute>
              <CommunityRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/productdetail"
          element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/all-items"
          element={
            <ProtectedRoute>
              <AllItemsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

// Simple Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">
              Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ErrorBoundary>
  );
}
export default App;
