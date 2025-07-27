import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { profileAPI } from "../services/api";
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
  Store,
  Edit3,
  Trash2,
  Search,
  Menu,
  X,
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
  const [activeTab, setActiveTab] = useState("profile");
  const [showExchangeCode, setShowExchangeCode] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Financial data - will be populated from backend
  const [financialData, setFinancialData] = useState({
    totalRevenue: 0,
    totalExpenditure: 0,
    netBalance: 0,
    salesCount: 0,
    orderCount: 0,
  });

  // Profile data - will be populated from backend
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
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

  // Sample product listings data
  const [myListings, setMyListings] = useState([
    {
      id: 1,
      name: "Organic Tomatoes",
      category: "Vegetables",
      price: 50,
      unit: "per kg",
      stock: 100,
      description: "Fresh organic tomatoes grown without pesticides",
      image: "/api/placeholder/150/150",
      status: "active",
      dateAdded: "2024-01-10",
      views: 45,
      inquiries: 8,
    },
    {
      id: 2,
      name: "Fresh Onions",
      category: "Vegetables",
      price: 30,
      unit: "per kg",
      stock: 80,
      description: "High quality red onions from local farm",
      image: "/api/placeholder/150/150",
      status: "active",
      dateAdded: "2024-01-08",
      views: 32,
      inquiries: 5,
    },
    {
      id: 3,
      name: "Wheat Seeds",
      category: "Seeds",
      price: 120,
      unit: "per kg",
      stock: 0,
      description: "Premium wheat seeds for planting",
      image: "/api/placeholder/150/150",
      status: "out_of_stock",
      dateAdded: "2024-01-05",
      views: 18,
      inquiries: 3,
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
    { id: "myListings", label: "My Listings", icon: Store },
    { id: "ordersToFulfill", label: "Orders to Fulfill", icon: Package },
    { id: "ordersPlaced", label: "Orders I Placed", icon: ShoppingBag },
    { id: "reviewable", label: "Add Reviews", icon: Star },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user profile with statistics
        const profileResponse = await profileAPI.getUserProfile();

        if (profileResponse.success) {
          const { user, statistics } = profileResponse.data;

          // Update profile data
          setProfileData({
            fullName: user.fullname || `${user.name}`,
            email: user.email || "",
            phone: user.phone || "",
            businessType: user.isSupplier
              ? "Supplier"
              : user.isVendor
              ? "Vendor"
              : "Farmer",
            address: user.address
              ? `${user.address.city}, ${user.address.state}`
              : "",
            rating: user.rating || 0,
            memberSince: new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            }),
          });

          // Update financial data from statistics
          setFinancialData({
            totalRevenue: statistics.totalRevenue || 0,
            totalExpenditure: statistics.totalExpenditure || 0,
            netBalance:
              (statistics.totalRevenue || 0) -
              (statistics.totalExpenditure || 0),
            salesCount: statistics.completedOrdersAsSeller || 0,
            orderCount: statistics.totalOrdersAsBuyer || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

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

  // Handle profile update
  const handleProfileUpdate = async (updatedData) => {
    try {
      setLoading(true);
      const response = await profileAPI.updateUserProfile(updatedData);

      if (response.success) {
        // Update local state with the response data
        setProfileData((prev) => ({
          ...prev,
          ...updatedData,
        }));
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle between vendor invitation and listings for demo
  const toggleVendorMode = () => {
    if (myListings.length === 0) {
      // Restore sample listings
      setMyListings([
        {
          id: 1,
          name: "Organic Tomatoes",
          category: "Vegetables",
          price: 50,
          unit: "per kg",
          stock: 100,
          description: "Fresh organic tomatoes grown without pesticides",
          image: "/api/placeholder/150/150",
          status: "active",
          dateAdded: "2024-01-10",
          views: 45,
          inquiries: 8,
        },
        {
          id: 2,
          name: "Fresh Onions",
          category: "Vegetables",
          price: 30,
          unit: "per kg",
          stock: 80,
          description: "High quality red onions from local farm",
          image: "/api/placeholder/150/150",
          status: "active",
          dateAdded: "2024-01-08",
          views: 32,
          inquiries: 5,
        },
        {
          id: 3,
          name: "Wheat Seeds",
          category: "Seeds",
          price: 120,
          unit: "per kg",
          stock: 0,
          description: "Premium wheat seeds for planting",
          image: "/api/placeholder/150/150",
          status: "out_of_stock",
          dateAdded: "2024-01-05",
          views: 18,
          inquiries: 3,
        },
      ]);
    } else {
      // Clear listings to show vendor invitation
      setMyListings([]);
    }
  };

  // Sidebar Navigation Component
  const Sidebar = () => (
    <>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        initial={{ x: -250, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <motion.div
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Home className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold text-gray-800">
                  RawConnect
                </span>
              </motion.div>

              {/* Mobile Close Button */}
              <motion.button
                className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
                onClick={() => setIsMobileSidebarOpen(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 py-6">
            <nav className="px-4 space-y-2">
              {navigationItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileSidebarOpen(false); // Close mobile sidebar on selection
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    activeTab === item.id
                      ? "bg-orange-100 text-orange-600 border-l-4 border-orange-500"
                      : "text-gray-600 hover:text-orange-600 hover:bg-gray-50"
                  }`}
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              ))}
            </nav>
          </div>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <motion.button
              className="w-full flex items-center space-x-3 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );

  // Profile Tab Component
  const ProfileTab = () => {
    if (loading) {
      return (
        <motion.div
          className="space-y-6"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-gray-600">Loading profile...</span>
          </div>
        </motion.div>
      );
    }

    if (error) {
      return (
        <motion.div
          className="space-y-6"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5 }}
        >
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <motion.button
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              onClick={() => window.location.reload()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Retry
            </motion.button>
          </div>
        </motion.div>
      );
    }

    return (
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
          My Profile
        </motion.h1>

        {/* Financial Summary Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-lg shadow-lg"
            variants={fadeInUp}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Sales Revenue</p>
                <p className="text-2xl font-bold">
                  ₹{financialData.totalRevenue.toLocaleString()}
                </p>
              </div>
              <TrendingUp size={32} className="text-green-200" />
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-lg shadow-lg"
            variants={fadeInUp}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Expenditure</p>
                <p className="text-2xl font-bold">
                  ₹{financialData.totalExpenditure.toLocaleString()}
                </p>
              </div>
              <TrendingDown size={32} className="text-blue-200" />
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-purple-400 to-purple-600 text-white p-6 rounded-lg shadow-lg"
            variants={fadeInUp}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Net Profit</p>
                <p className="text-2xl font-bold">
                  ₹
                  {(
                    financialData.totalRevenue - financialData.totalExpenditure
                  ).toLocaleString()}
                </p>
              </div>
              <DollarSign size={32} className="text-purple-200" />
            </div>
          </motion.div>
        </motion.div>

        {/* User Profile Information */}
        <motion.div
          className="bg-white border border-gray-200 rounded-lg p-6"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.3 }}
          whileHover={{ boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Profile Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Full Name
                </label>
                <p className="text-gray-800 font-medium">
                  {profileData.fullName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <p className="text-gray-800">{profileData.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Phone
                </label>
                <p className="text-gray-800">{profileData.phone}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Business Type
                </label>
                <p className="text-gray-800">{profileData.businessType}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Location
                </label>
                <p className="text-gray-800">{profileData.address}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Member Since
                </label>
                <p className="text-gray-800">
                  {profileData.memberSince || "January 2024"}
                </p>
              </div>
            </div>
          </div>

          <motion.button
            className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // This could open a modal or navigate to an edit page
              alert("Edit profile functionality would open here");
            }}
          >
            Edit Profile
          </motion.button>
        </motion.div>
      </motion.div>
    );
  };

  // My Listings Tab Component
  const MyListingsTab = () => (
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
          My Listings
        </motion.h1>

        <div className="flex items-center space-x-3">
          <motion.button
            className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} />
            <span>Add New Product</span>
          </motion.button>

          {/* Demo button to toggle vendor mode */}
          <motion.button
            className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleVendorMode}
          >
            <Eye size={16} />
            <span>Demo: Toggle View</span>
          </motion.button>
        </div>
      </div>

      {myListings.length === 0 ? (
        // Empty state for no listings
        <motion.div
          className="text-center py-16"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Store size={48} className="text-orange-500" />
          </motion.div>

          <motion.h3
            className="text-xl font-semibold text-gray-800 mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Want to become a Vendor?
          </motion.h3>

          <motion.p
            className="text-gray-600 mb-8 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Start selling your products on RawConnect and reach thousands of
            potential buyers. List your items, manage inventory, and grow your
            business with us.
          </motion.p>

          <motion.button
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(251, 146, 60, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={toggleVendorMode}
          >
            <span className="flex items-center space-x-2">
              <Search size={20} />
              <span>Explore Opportunities</span>
            </span>
          </motion.button>
        </motion.div>
      ) : (
        // Listings grid
        <>
          {/* Summary Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="bg-white border border-gray-200 rounded-lg p-4"
              variants={fadeInUp}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {myListings.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package size={20} className="text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white border border-gray-200 rounded-lg p-4"
              variants={fadeInUp}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold text-green-600">
                    {
                      myListings.filter((item) => item.status === "active")
                        .length
                    }
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white border border-gray-200 rounded-lg p-4"
              variants={fadeInUp}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {myListings.reduce((sum, item) => sum + item.views, 0)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Eye size={20} className="text-purple-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white border border-gray-200 rounded-lg p-4"
              variants={fadeInUp}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Inquiries</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {myListings.reduce((sum, item) => sum + item.inquiries, 0)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <MessageSquare size={20} className="text-orange-600" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Products Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {myListings.map((product, index) => (
              <motion.div
                key={product.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Product Image */}
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <Package size={48} className="text-gray-400" />
                </div>

                <div className="p-4">
                  {/* Product Header */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {product.name}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.status === "active" ? "Active" : "Out of Stock"}
                    </span>
                  </div>

                  {/* Category and Price */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-500">
                      {product.category}
                    </span>
                    <span className="text-lg font-bold text-orange-600">
                      ₹{product.price} {product.unit}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Stats */}
                  <div className="flex justify-between items-center mb-4 text-xs text-gray-500">
                    <span>Stock: {product.stock} kg</span>
                    <span>{product.views} views</span>
                    <span>{product.inquiries} inquiries</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <motion.button
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Edit3 size={14} />
                      <span>Edit</span>
                    </motion.button>

                    <motion.button
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </motion.div>
  );

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
      case "myListings":
        return <MyListingsTab />;
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
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      {/* Mobile Menu Button */}
      <motion.button
        className="fixed top-4 left-4 z-40 lg:hidden bg-white border border-gray-200 rounded-lg p-2 shadow-md"
        onClick={() => setIsMobileSidebarOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Menu size={20} className="text-gray-600" />
      </motion.button>

      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        <div className="mt-16 lg:mt-0">
          <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
        </div>
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
