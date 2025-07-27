import React from "react";
import { AuthProvider } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import CommunityRequests from "./pages/CommunityRequests";
import ProductDetail from "./pages/ProductDetail";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AllItemsPage from "./pages/AllItemsPage";
import AboutPage from "./pages/AboutPage";
// New modular dashboard components
import Profile from "./pages/Profile";
import MyListings from "./pages/MyListings";
import OrdersToFulfill from "./pages/OrdersToFulfill";
import OrdersPlaced from "./pages/OrdersPlaced";
import Reviews from "./pages/Reviews";
import Notifications from "./pages/Notifications";
import { useAuth } from "./hooks/useAuth";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/authpage" replace />;
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
        <Router>
          <Routes>
            {/* Public Routes - No authentication required */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/authpage" element={<AuthPage />} />

            {/* Protected Routes - Authentication required */}
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

            <Route
              path="/Profile"
              element={<Navigate to="/dashboard/profile" replace />}
            />

            {/* New Modular Dashboard Routes */}
            <Route
              path="/dashboard/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/listings"
              element={
                <ProtectedRoute>
                  <MyListings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/orders-to-fulfill"
              element={
                <ProtectedRoute>
                  <OrdersToFulfill />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/orders-placed"
              element={
                <ProtectedRoute>
                  <OrdersPlaced />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/reviews"
              element={
                <ProtectedRoute>
                  <Reviews />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
export default App;
