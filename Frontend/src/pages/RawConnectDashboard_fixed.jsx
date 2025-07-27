import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import locationService from "../services/locationService";
import {
  Bell,
  Package,
  Star,
  Users,
  Home,
  User,
  LogOut,
  Settings,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  MessageSquare,
  Plus,
  ArrowRight,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileText,
  Truck,
  Camera,
  ShoppingBag,
  CreditCard,
  Save,
  Shield,
  Edit3,
} from "lucide-react";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scaleOnHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
};

const RawConnectDashboard = () => {
  const {
    user,
    updateAccountDetails,
    changePassword,
    logout,
    isLoading,
    error,
    clearError,
  } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");
  const [showExchangeCode, setShowExchangeCode] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isProfileCompleted, setIsProfileCompleted] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullname: "",
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    lat: "",
    lng: "",
    isSupplier: false,
    isVendor: false,
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Location-related states
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [locationData, setLocationData] = useState(null);

  // Check if profile is completed
  useEffect(() => {
    if (user) {
      const isCompleted =
        user.fullname &&
        user.phone &&
        user.address?.street &&
        user.address?.city &&
        user.address?.state &&
        user.address?.pincode;
      setIsProfileCompleted(isCompleted);

      // Set form data with user data
      setProfileForm({
        fullname: user.fullname || "",
        name: user.name || "",
        phone: user.phone || "",
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        pincode: user.address?.pincode || "",
        lat: user.address?.geolocation?.lat || "",
        lng: user.address?.geolocation?.lng || "",
        isSupplier: user.isSupplier || false,
        isVendor: user.isVendor || false,
      });
    }
  }, [user]);

  // Sample financial data
  const [financialData, setFinancialData] = useState({
    totalRevenue: 156750,
    totalExpenditure: 89250,
    netBalance: 67500,
    salesCount: 42,
    orderCount: 28,
  });

  // Sample profile data
  const [profileData, setProfileData] = useState({
    fullName: "John Doe",
    email: "john.doe@email.com",
    phone: "+91 9876543210",
    businessType: "Farmer & Supplier",
    address: "Maharashtra, India",
  });

  // Sample orders data
  const [ordersToFulfill, setOrdersToFulfill] = useState([
    {
      id: 1,
      product: "Organic Tomatoes",
      quantity: "50 kg",
      buyer: "Restaurant ABC",
      buyerPhone: "+91 9876543210",
      totalPrice: 2500,
      status: "confirmed",
      orderDate: "2024-01-15",
      deliveryType: "pickup",
      exchangeCode: null,
    },
    {
      id: 2,
      product: "Fresh Onions",
      quantity: "30 kg",
      buyer: "Hotel XYZ",
      buyerPhone: "+91 9876543211",
      totalPrice: 1800,
      status: "processing",
      orderDate: "2024-01-14",
      deliveryType: "delivery",
      deliveryAddress: "123 Main St, Mumbai",
      exchangeCode: "ABC123",
    },
  ]);

  const [ordersPlaced, setOrdersPlaced] = useState([
    {
      id: 3,
      product: "Wheat Seeds",
      quantity: "10 kg",
      supplier: "Seeds Co.",
      supplierPhone: "+91 9876543212",
      totalPrice: 1200,
      status: "shipped",
      orderDate: "2024-01-12",
      exchangeCode: "XYZ789",
    },
  ]);

  const [reviewableOrders, setReviewableOrders] = useState([
    {
      id: 4,
      product: "Fertilizer",
      quantity: "25 kg",
      supplier: "Farm Supply",
      totalPrice: 3500,
      status: "completed",
      orderDate: "2024-01-10",
    },
  ]);

  // Sample notifications
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    priceAlerts: false,
    newRequests: true,
    supplierOffers: true,
  });

  const [recentNotifications] = useState([
    {
      message: "New order request from Restaurant ABC",
      time: "2 hours ago",
      type: "info",
      icon: Package,
    },
    {
      message: "Order #1234 has been delivered successfully",
      time: "1 day ago",
      type: "success",
      icon: CheckCircle2,
    },
    {
      message: "Price alert: Tomato prices increased by 15%",
      time: "2 days ago",
      type: "warning",
      icon: TrendingUp,
    },
  ]);

  // Navigation items for the new workflow
  const navigationItems = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "ordersToFulfill", label: "Orders to Fulfill", icon: Package },
    { id: "ordersPlaced", label: "Orders I Placed", icon: ShoppingBag },
    { id: "reviewable", label: "Add Reviews", icon: Star },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "shipped":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getNextAction = (order, userType) => {
    const { status } = order;

    if (userType === "seller") {
      switch (status) {
        case "confirmed":
          return {
            action: "processing",
            label: "Mark as Processing",
            icon: Clock,
          };
        case "processing":
          return { action: "shipped", label: "Mark as Shipped", icon: Truck };
        case "shipped":
          return {
            action: "complete",
            label: "Complete Order",
            icon: CheckCircle2,
          };
        default:
          return null;
      }
    } else {
      // buyer
      switch (status) {
        case "processing":
          return { action: "viewCode", label: "View Exchange Code", icon: Eye };
        case "shipped":
          return { action: "viewCode", label: "View Exchange Code", icon: Eye };
        case "completed":
          return { action: "review", label: "Add Review", icon: Star };
        default:
          return null;
      }
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrdersToFulfill((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedOrder = { ...order, status: newStatus };
          if (newStatus === "processing") {
            updatedOrder.exchangeCode = Math.random()
              .toString(36)
              .substr(2, 6)
              .toUpperCase();
          }
          return updatedOrder;
        }
        return order;
      })
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Exchange code copied to clipboard!");
  };

  const handleNotificationToggle = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Handle tab navigation with profile completion check
  const handleTabClick = (tabId) => {
    if (tabId === "profile") {
      setActiveTab(tabId);
      return;
    }

    // Check if profile is completed before allowing access to other tabs
    if (!isProfileCompleted) {
      setProfileError(
        "Please complete your profile first to access other features."
      );
      setActiveTab("profile");
      return;
    }

    setActiveTab(tabId);
    setProfileError(""); // Clear any errors
  };

  // Navigation Component
  const Navigation = () => (
    <motion.div
      className="bg-white border-b border-gray-200 shadow-sm"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Home className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-gray-800">RawConnect</span>
          </motion.div>

          <div className="flex items-center space-x-6">
            {navigationItems.map((item, index) => {
              const isDisabled = item.id !== "profile" && !isProfileCompleted;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors relative ${
                    activeTab === item.id
                      ? "bg-orange-100 text-orange-600"
                      : isDisabled
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:text-orange-600"
                  }`}
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: isDisabled ? 1 : 1.05 }}
                  whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                  disabled={isDisabled}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                  {isDisabled && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                  )}
                </motion.button>
              );
            })}
          </div>

          <motion.button
            onClick={() => logout()}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </motion.button>
        </div>
      </nav>
    </motion.div>
  );

  // Profile Tab Component
  // Handle profile form changes
  const handleProfileFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle password form changes
  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Location handling functions
  const handleCityChange = async (e) => {
    const cityValue = e.target.value;
    setProfileForm((prev) => ({ ...prev, city: cityValue }));
    setLocationError("");

    // Auto-fetch coordinates when city is entered (debounced)
    if (cityValue.trim().length >= 3) {
      if (window.citySearchTimeout) {
        clearTimeout(window.citySearchTimeout);
      }

      window.citySearchTimeout = setTimeout(async () => {
        await fetchCityCoordinates(cityValue, profileForm.state);
      }, 1000);
    } else {
      setLocationData(null);
    }
  };

  const handleStateChange = (e) => {
    const stateValue = e.target.value;
    setProfileForm((prev) => ({ ...prev, state: stateValue }));

    // Re-fetch coordinates if city is already entered
    if (profileForm.city.trim().length >= 3) {
      setTimeout(async () => {
        await fetchCityCoordinates(profileForm.city, stateValue);
      }, 500);
    }
  };

  const fetchCityCoordinates = async (cityName, stateName = "") => {
    const validation = locationService.validateIndianCity(cityName);
    if (!validation.valid) {
      setLocationError(validation.error);
      return;
    }

    setIsLocationLoading(true);
    setLocationError("");

    try {
      const result = await locationService.getCityCoordinates(
        cityName,
        stateName,
        "India"
      );

      if (result.success) {
        setLocationData(result);
        setProfileForm((prev) => ({
          ...prev,
          state: result.state || stateName,
          lat: result.lat,
          lng: result.lng,
        }));
        setLocationError("");
      } else {
        setLocationError(
          result.error || "City not found. Please check the spelling."
        );
        setLocationData(null);
      }
    } catch (error) {
      setLocationError("Failed to fetch location data. Please try again.");
      setLocationData(null);
    } finally {
      setIsLocationLoading(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    setIsLocationLoading(true);
    setLocationError("");

    try {
      const position = await locationService.getCurrentLocation();

      if (position.success) {
        const address = await locationService.getAddressFromCoordinates(
          position.lat,
          position.lng
        );

        if (address.success) {
          setProfileForm((prev) => ({
            ...prev,
            city: address.city,
            state: address.state,
            lat: position.lat,
            lng: position.lng,
          }));
          setLocationData({
            lat: position.lat,
            lng: position.lng,
            city: address.city,
            state: address.state,
            country: address.country,
            displayName: address.displayName,
            success: true,
          });
        } else {
          setLocationError("Could not get address from your location");
        }
      }
    } catch (error) {
      setLocationError(error.message || "Failed to get your current location");
    } finally {
      setIsLocationLoading(false);
    }
  };

  // Submit profile update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProfileError("");
    setSuccess("");

    try {
      // Prepare the data according to backend model
      const updateData = {
        fullname: profileForm.fullname,
        name: profileForm.name,
        phone: profileForm.phone,
      };

      // Only include address if all required fields are filled
      if (
        profileForm.street &&
        profileForm.city &&
        profileForm.state &&
        profileForm.pincode
      ) {
        updateData.address = {
          street: profileForm.street,
          city: profileForm.city,
          state: profileForm.state,
          pincode: profileForm.pincode,
        };

        // Include geolocation if provided
        if (profileForm.lat && profileForm.lng) {
          updateData.address.geolocation = {
            lat: parseFloat(profileForm.lat),
            lng: parseFloat(profileForm.lng),
          };
        }
      }

      // Include supplier/vendor flags
      updateData.isSupplier = profileForm.isSupplier;
      updateData.isVendor = profileForm.isVendor;

      await updateAccountDetails(updateData);
      setSuccess("Profile updated successfully!");
      setIsEditingProfile(false);

      // Check if profile is now completed
      const isCompleted =
        profileForm.fullname &&
        profileForm.phone &&
        profileForm.street &&
        profileForm.city &&
        profileForm.state &&
        profileForm.pincode;
      setIsProfileCompleted(isCompleted);
    } catch (error) {
      setProfileError(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  // Submit password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProfileError("");
    setSuccess("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setProfileError("New passwords do not match");
      setLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setProfileError("New password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      await changePassword(passwordForm.oldPassword, passwordForm.newPassword);
      setSuccess("Password changed successfully!");
      setIsChangingPassword(false);
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setProfileError(
        error.response?.data?.message || "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  // Profile completion percentage
  const calculateProfileCompletion = () => {
    const fields = [
      profileForm.fullname,
      profileForm.name,
      profileForm.phone,
      profileForm.street,
      profileForm.city,
      profileForm.state,
      profileForm.pincode,
    ];
    const completedFields = fields.filter(
      (field) => field && field.trim() !== ""
    ).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const ProfileTab = () => {
    const completionPercentage = calculateProfileCompletion();
    const showCompletionPrompt =
      !isProfileCompleted && completionPercentage < 100;

    return (
      <motion.div
        className="space-y-6"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center">
          <motion.h1
            className="text-2xl font-bold text-gray-800"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            My Profile
          </motion.h1>

          {isProfileCompleted && (
            <div className="flex gap-2">
              <motion.button
                onClick={() => setIsEditingProfile(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Edit3 size={16} />
                Edit Profile
              </motion.button>
              <motion.button
                onClick={() => setIsChangingPassword(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Shield size={16} />
                Change Password
              </motion.button>
            </div>
          )}
        </div>

        {/* Show success/error messages */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
            >
              {success}
            </motion.div>
          )}

          {(profileError || error) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
            >
              {profileError || error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Completion Banner */}
        {showCompletionPrompt && (
          <motion.div
            className="bg-gradient-to-r from-orange-100 to-orange-200 border border-orange-300 rounded-lg p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-orange-800 mb-2">
                  Complete Your Profile
                </h3>
                <p className="text-orange-700 mb-3">
                  Complete your profile to unlock all features and start
                  exploring activities.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-orange-300 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-orange-800 font-semibold">
                    {completionPercentage}%
                  </span>
                </div>
              </div>
              <motion.button
                onClick={() => setIsEditingProfile(true)}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Complete Now
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Profile Form - Edit Mode */}
        <AnimatePresence>
          {isEditingProfile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  {isProfileCompleted
                    ? "Update Profile"
                    : "Complete Your Profile"}
                </h2>
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle size={20} />
                </button>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullname"
                      value={profileForm.fullname}
                      onChange={handleProfileFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div className="border-t pt-6">
                  <h3 className="text-md font-semibold text-gray-800 mb-4">
                    Address Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={profileForm.street}
                        onChange={handleProfileFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            name="city"
                            value={profileForm.city}
                            onChange={handleCityChange}
                            placeholder="Enter your city"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pr-10"
                            required
                          />
                          {isLocationLoading && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <div className="animate-spin h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={handleUseCurrentLocation}
                          disabled={isLocationLoading}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition text-sm whitespace-nowrap flex items-center gap-1"
                          title="Use current location"
                        >
                          📍 {isLocationLoading ? "..." : "Auto"}
                        </button>
                      </div>

                      {/* Location Status */}
                      {locationError && (
                        <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                          <span>⚠️</span>
                          {locationError}
                        </p>
                      )}

                      {locationData && locationData.success && (
                        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-700 flex items-center gap-2">
                            <span>✅</span>
                            <span className="font-medium">Location found:</span>
                          </p>
                          <p className="text-sm text-green-600 mt-1">
                            {locationData.city}
                            {locationData.state
                              ? `, ${locationData.state}`
                              : ""}
                          </p>
                          <p className="text-xs text-green-500 mt-1">
                            Coordinates: {locationData.lat?.toFixed(4)},{" "}
                            {locationData.lng?.toFixed(4)}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={profileForm.state}
                        onChange={handleStateChange}
                        placeholder="Enter your state"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        💡 We use your location to show relevant products and
                        services in your area
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={profileForm.pincode}
                        onChange={handleProfileFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Geolocation (Optional) */}
                <div className="border-t pt-6">
                  <h3 className="text-md font-semibold text-gray-800 mb-4">
                    Location Coordinates (Optional)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        name="lat"
                        value={profileForm.lat}
                        onChange={handleProfileFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        name="lng"
                        value={profileForm.lng}
                        onChange={handleProfileFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Business Type */}
                <div className="border-t pt-6">
                  <h3 className="text-md font-semibold text-gray-800 mb-4">
                    Business Type
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isSupplier"
                        checked={profileForm.isSupplier}
                        onChange={handleProfileFormChange}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        I am a Supplier
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isVendor"
                        checked={profileForm.isVendor}
                        onChange={handleProfileFormChange}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        I am a Vendor
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                    whileHover={{ scale: loading ? 1 : 1.05 }}
                    whileTap={{ scale: loading ? 1 : 0.95 }}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Profile
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Password Change Form */}
        <AnimatePresence>
          {isChangingPassword && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  Change Password
                </h2>
                <button
                  onClick={() => setIsChangingPassword(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle size={20} />
                </button>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={passwordForm.oldPassword}
                    onChange={handlePasswordFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                    minLength={6}
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                    whileHover={{ scale: loading ? 1 : 1.05 }}
                    whileTap={{ scale: loading ? 1 : 0.95 }}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Shield size={16} />
                        Update Password
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Display - View Mode */}
        {isProfileCompleted && !isEditingProfile && (
          <motion.div
            className="bg-white border border-gray-200 rounded-lg p-6"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.3 }}
            whileHover={{ boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-green-500" size={20} />
              Profile Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Full Name
                  </label>
                  <p className="text-gray-800 font-medium">
                    {user?.fullname || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Display Name
                  </label>
                  <p className="text-gray-800">
                    {user?.name || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <p className="text-gray-800">{user?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Phone
                  </label>
                  <p className="text-gray-800">
                    {user?.phone || "Not provided"}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Address
                  </label>
                  <p className="text-gray-800">
                    {user?.address
                      ? `${user.address.street}, ${user.address.city}, ${user.address.state} - ${user.address.pincode}`
                      : "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Business Type
                  </label>
                  <div className="flex gap-2">
                    {user?.isSupplier && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                        Supplier
                      </span>
                    )}
                    {user?.isVendor && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                        Vendor
                      </span>
                    )}
                    {!user?.isSupplier && !user?.isVendor && (
                      <span className="text-gray-500">Not specified</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Member Since
                  </label>
                  <p className="text-gray-800">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Username
                  </label>
                  <p className="text-gray-800">@{user?.username}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Restricted Access Message */}
        {!isProfileCompleted && !isEditingProfile && (
          <motion.div
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="text-yellow-600 mb-4">
              <FileText size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Profile Incomplete
            </h3>
            <p className="text-yellow-700 mb-4">
              Please complete your profile to access all dashboard features and
              start exploring activities.
            </p>
            <motion.button
              onClick={() => setIsEditingProfile(true)}
              className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Complete Profile Now
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    );
  };

  // Orders to Fulfill Tab
  const OrdersToFulfillTab = () => (
    <motion.div
      className="space-y-6"
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <motion.h1
          className="text-2xl font-bold text-gray-800"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          Orders to Fulfill
        </motion.h1>
        <div className="text-sm text-gray-500">
          Limit:{" "}
          {
            ordersToFulfill.filter((o) =>
              ["pending", "confirmed", "processing", "shipped"].includes(
                o.status
              )
            ).length
          }
          /3 pending orders
        </div>
      </div>

      <motion.div
        className="space-y-4"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {ordersToFulfill.map((order, index) => {
          const nextAction = getNextAction(order, "seller");
          return (
            <motion.div
              key={order.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
              {...scaleOnHover}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {order.product}
                  </h3>
                  <p className="text-gray-600">Quantity: {order.quantity}</p>
                  <p className="text-gray-600">Buyer: {order.buyer}</p>
                  <p className="text-gray-600">Phone: {order.buyerPhone}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    ₹{order.totalPrice}
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
              </div>

              {order.deliveryType === "delivery" && order.deliveryAddress && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Delivery Address:</strong> {order.deliveryAddress}
                  </p>
                </div>
              )}

              {order.exchangeCode && (
                <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-700">
                    <strong>Exchange Code:</strong> {order.exchangeCode}
                    <span className="text-xs text-purple-500 ml-2">
                      (Buyer has this code)
                    </span>
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Ordered: {order.orderDate}
                </p>
                {nextAction && (
                  <motion.button
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      nextAction.action === "complete"
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                    onClick={() => {
                      if (nextAction.action === "complete") {
                        const code = prompt("Enter exchange code from buyer:");
                        if (code === order.exchangeCode) {
                          updateOrderStatus(order.id, "complete");
                        } else {
                          alert("Invalid exchange code!");
                        }
                      } else {
                        updateOrderStatus(order.id, nextAction.action);
                      }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <nextAction.icon size={16} />
                    <span>{nextAction.label}</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );

  // Orders Placed Tab
  const OrdersPlacedTab = () => (
    <motion.div
      className="space-y-6"
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-2xl font-bold text-gray-800"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        Orders I Placed
      </motion.h1>

      <motion.div
        className="space-y-4"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {ordersPlaced.map((order, index) => {
          const nextAction = getNextAction(order, "buyer");
          return (
            <motion.div
              key={order.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
              {...scaleOnHover}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {order.product}
                  </h3>
                  <p className="text-gray-600">Quantity: {order.quantity}</p>
                  <p className="text-gray-600">Supplier: {order.supplier}</p>
                  <p className="text-gray-600">Phone: {order.supplierPhone}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">
                    ₹{order.totalPrice}
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
              </div>

              {order.exchangeCode && (
                <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-purple-700">
                      <strong>Your Exchange Code:</strong> {order.exchangeCode}
                    </p>
                    <motion.button
                      className="text-purple-600 hover:text-purple-800"
                      onClick={() => copyToClipboard(order.exchangeCode)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Copy size={16} />
                    </motion.button>
                  </div>
                  <p className="text-xs text-purple-500 mt-1">
                    Share this code with seller upon delivery
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Ordered: {order.orderDate}
                </p>
                {nextAction && (
                  <motion.button
                    className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                    onClick={() => {
                      if (nextAction.action === "viewCode") {
                        setSelectedOrder(order);
                        setShowExchangeCode(true);
                      } else if (nextAction.action === "review") {
                        setActiveTab("reviewable");
                      }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <nextAction.icon size={16} />
                    <span>{nextAction.label}</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );

  // Reviewable Orders Tab
  const ReviewableOrdersTab = () => (
    <motion.div
      className="space-y-6"
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-2xl font-bold text-gray-800"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        Add Reviews
      </motion.h1>

      {reviewableOrders.length === 0 ? (
        <motion.div className="text-center py-12" variants={fadeInUp}>
          <Star size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No completed orders to review yet</p>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-4"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {reviewableOrders.map((order, index) => (
            <motion.div
              key={order.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
              {...scaleOnHover}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {order.product}
                  </h3>
                  <p className="text-gray-600">Supplier: {order.supplier}</p>
                  <p className="text-gray-600">Quantity: {order.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    ₹{order.totalPrice}
                  </p>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-800 border-green-200">
                    Completed
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Completed: {order.orderDate}
                </p>
                <motion.button
                  className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Star size={16} />
                  <span>Add Review</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );

  // Notifications Tab
  const NotificationsTab = () => (
    <motion.div
      className="space-y-6"
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-2xl font-bold text-gray-800"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        Notifications
      </motion.h1>

      {/* Notification Settings */}
      <motion.div
        className="bg-white border border-gray-200 rounded-lg p-6"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.2 }}
        whileHover={{ boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Notification Settings
        </h2>

        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value], index) => (
            <motion.div
              key={key}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <span className="text-gray-700 font-medium capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </span>
              <motion.button
                onClick={() => handleNotificationToggle(key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? "bg-orange-500" : "bg-gray-300"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform"
                  animate={{ x: value ? 24 : 4 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Notifications */}
      <motion.div
        className="bg-white border border-gray-200 rounded-lg p-6"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.4 }}
        whileHover={{ boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Notifications
        </h2>

        <div className="space-y-4">
          {recentNotifications.map((notification, index) => {
            const Icon = notification.icon;
            return (
              <div
                key={index}
                className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    notification.type === "success"
                      ? "bg-green-100"
                      : notification.type === "info"
                      ? "bg-blue-100"
                      : "bg-orange-100"
                  }`}
                >
                  <Icon
                    size={16}
                    className={
                      notification.type === "success"
                        ? "text-green-600"
                        : notification.type === "info"
                        ? "text-blue-600"
                        : "text-orange-600"
                    }
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );

  // Main render content function
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab />;
      case "ordersToFulfill":
        return <OrdersToFulfillTab />;
      case "ordersPlaced":
        return <OrdersPlacedTab />;
      case "reviewable":
        return <ReviewableOrdersTab />;
      case "notifications":
        return <NotificationsTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </main>

      {/* Exchange Code Modal */}
      <AnimatePresence>
        {showExchangeCode && selectedOrder && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Exchange Code
              </h3>

              <div className="text-center py-6">
                <div className="text-3xl font-bold text-purple-600 bg-purple-50 rounded-lg p-4 mb-4">
                  {selectedOrder.exchangeCode}
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Share this code with the seller when receiving your order
                </p>

                <motion.button
                  className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  onClick={() => copyToClipboard(selectedOrder.exchangeCode)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Copy Code
                </motion.button>
              </div>

              <motion.button
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => {
                  setShowExchangeCode(false);
                  setSelectedOrder(null);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RawConnectDashboard;
