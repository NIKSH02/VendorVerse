import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AuthPage from "./pages/AuthPage";
import CommunityRequests from './pages/CommunityRequests';
import { FaProductHunt } from 'react-icons/fa';
import ProductDetail from './pages/ProductDetail';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AllItemsPage from './pages/AllItemsPage';
import AboutPage from './pages/AboutPage';
import SpecialItemsPage from './pages/SpecialItemsPage';


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
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">Please refresh the page to try again.</p>
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
        <Router >
          <Routes>
            <Route path="/authpage" element={ <AuthPage />} />
            <Route path="/Global" element={<CommunityRequests />  } />
            <Route path="/productdetail" element={<ProductDetail /> } />
            <Route path="/all-items" element={<AllItemsPage />} />
            <Route path="/special-items" element={<SpecialItemsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/" element={<LandingPage /> } />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;