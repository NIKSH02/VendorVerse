import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Truck, 
  ShoppingCart, 
  TestTube, 
  Bell, 
  LogOut, 
  DollarSign, 
  ShoppingBag,
  Menu,
  X,
  MessageCircle,
  Check,
  Clock
} from 'lucide-react';

const RawConnectDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: 'Rajesh Kumar',
    email: 'rajesh.kumar@gmail.com',
    phone: '+91 9876543210',
    businessType: 'Street Food Vendor',
    address: 'Shop 15, Sector 18 Market, Noida, Uttar Pradesh 201301'
  });

  const [notifications, setNotifications] = useState({
    orderAlerts: true,
    chatAlerts: true,
    supplierOffers: false
  });

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const slideInLeft = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const scaleOnHover = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 }
  };
  const navItems = [
    { id: 'profile', label: 'Your Profile', icon: User },
    { id: 'delivered', label: 'Orders Delivered', icon: Truck },
    { id: 'received', label: 'Orders Received', icon: ShoppingCart },
    { id: 'samples', label: 'Sample Requests', icon: TestTube },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  const ordersDelivered = [
    {
      product: 'Fresh Tomatoes',
      quantity: '10 kg',
      buyer: 'Priya Sharma',
      delivered: 'Dec 20, 2024',
      status: 'Delivered'
    },
    {
      product: 'Basmati Rice',
      quantity: '25 kg',
      buyer: 'Amit Singh',
      delivered: 'Dec 18, 2024',
      status: 'Delivered'
    },
    {
      product: 'Garam Masala',
      quantity: '2 packets',
      buyer: 'Sunita Devi',
      delivered: 'Dec 15, 2024',
      status: 'Delivered'
    }
  ];

  const ordersReceived = [
    {
      product: 'Cooking Oil',
      supplier: 'Green Valley Supplies',
      price: '₹850 for 5 liters',
      ordered: 'Dec 22, 2024',
      status: 'Processing'
    },
    {
      product: 'Onions',
      supplier: 'Farm Fresh Co.',
      price: '₹300 for 15 kg',
      ordered: 'Dec 19, 2024',
      status: 'Delivered'
    }
  ];

  const sampleRequests = [
    {
      name: 'Ravi Gupta',
      product: 'Organic Turmeric Powder',
      purpose: 'Quality testing for bulk order'
    },
    {
      name: 'Meera Patel',
      product: 'Red Chili Powder',
      purpose: 'Spice level testing for restaurant'
    }
  ];

  const recentNotifications = [
    {
      message: 'Order #12345 has been delivered successfully',
      time: '2 hours ago',
      type: 'success',
      icon: Check
    },
    {
      message: 'New message from Priya Sharma',
      time: '4 hours ago',
      type: 'info',
      icon: MessageCircle
    },
    {
      message: 'New order received for Basmati Rice',
      time: '1 day ago',
      type: 'order',
      icon: ShoppingCart
    }
  ];

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationToggle = (setting) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const Sidebar = ({ className = '' }) => (
    <motion.div 
      className={`bg-white border-r border-gray-200 ${className}`}
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div 
        className="p-6 border-b border-gray-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center space-x-3">
          <motion.div 
            className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-white font-bold text-lg">R</span>
          </motion.div>
          <span className="text-xl font-bold text-gray-800">RawConnect</span>
        </div>
      </motion.div>
      
      <nav className="p-4 space-y-2">
        <motion.div variants={staggerContainer} animate="animate">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                variants={slideInLeft}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === item.id 
                    ? 'bg-orange-50 text-orange-600 border border-orange-200' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={activeTab === item.id ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon size={20} />
                </motion.div>
                <span className="font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </motion.div>
        
        <div className="pt-4 border-t border-gray-200">
          <motion.button 
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
            whileHover={{ x: 5, backgroundColor: "rgba(254, 226, 226, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </motion.button>
        </div>
      </nav>
    </motion.div>
  );

  const ProfileTab = () => (
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
        Your Profile
      </motion.h1>
      
      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div 
          className="bg-green-50 border border-green-200 rounded-lg p-6"
          variants={fadeInUp}
          {...scaleOnHover}
          whileHover={{ boxShadow: "0 10px 25px rgba(34, 197, 94, 0.1)" }}
        >
          <div className="flex items-center space-x-4">
            <motion.div 
              className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <DollarSign className="text-white" size={24} />
            </motion.div>
            <div>
              <p className="text-sm font-medium text-green-600">Total Revenue</p>
              <motion.p 
                className="text-2xl font-bold text-green-700"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                ₹45,280
              </motion.p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-blue-50 border border-blue-200 rounded-lg p-6"
          variants={fadeInUp}
          {...scaleOnHover}
          whileHover={{ boxShadow: "0 10px 25px rgba(59, 130, 246, 0.1)" }}
        >
          <div className="flex items-center space-x-4">
            <motion.div 
              className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <ShoppingBag className="text-white" size={24} />
            </motion.div>
            <div>
              <p className="text-sm font-medium text-blue-600">Total Expenditure</p>
              <motion.p 
                className="text-2xl font-bold text-blue-700"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                ₹23,150
              </motion.p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Profile Form */}
      <motion.div 
        className="bg-white border border-gray-200 rounded-lg p-6"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.3 }}
        whileHover={{ boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="flex flex-col md:flex-row md:space-x-6">
          <motion.div 
            className="flex-shrink-0 mb-6 md:mb-0"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
              <User size={32} className="text-gray-600" />
            </div>
          </motion.div>
          
          <div className="flex-1 space-y-6">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={fadeInUp}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <motion.input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(251, 146, 60, 0.1)" }}
                />
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <motion.input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(251, 146, 60, 0.1)" }}
                />
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <motion.input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(251, 146, 60, 0.1)" }}
                />
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                <motion.select
                  value={profileData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(251, 146, 60, 0.1)" }}
                >
                  <option>Street Food Vendor</option>
                  <option>Grocery Supplier</option>
                  <option>Spice Merchant</option>
                  <option>Vegetable Vendor</option>
                </motion.select>
              </motion.div>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <motion.textarea
                value={profileData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(251, 146, 60, 0.1)" }}
              />
            </motion.div>
            
            <motion.button 
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(251, 146, 60, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              variants={fadeInUp}
            >
              Update Profile
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  const OrdersDeliveredTab = () => (
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
        Orders Delivered
      </motion.h1>
      
      <motion.div 
        className="space-y-4"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {ordersDelivered.map((order, index) => (
          <motion.div 
            key={index} 
            className="bg-white border border-gray-200 rounded-lg p-6"
            variants={fadeInUp}
            {...scaleOnHover}
            whileHover={{ 
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              y: -2
            }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <h3 className="text-lg font-semibold text-gray-800">{order.product}</h3>
                <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                <p className="text-sm text-gray-600">Buyer: {order.buyer}</p>
                <p className="text-sm text-gray-600">Delivered: {order.delivered}</p>
              </motion.div>
              <motion.div 
                className="mt-4 md:mt-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <motion.span 
                  className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  whileHover={{ scale: 1.05 }}
                >
                  {order.status}
                </motion.span>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );

const OrdersReceivedTab = () => (
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
        Orders Received
      </motion.h1>
      
      <motion.div 
        className="space-y-4"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {ordersReceived.map((order, index) => (
          <motion.div 
            key={index} 
            className="bg-white border border-gray-200 rounded-lg p-6"
            variants={fadeInUp}
            {...scaleOnHover}
            whileHover={{ 
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              y: -2
            }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <h3 className="text-lg font-semibold text-gray-800">{order.product}</h3>
                <p className="text-sm text-gray-600">Supplier: {order.supplier}</p>
                <p className="text-sm text-gray-600">Price: {order.price}</p>
                <p className="text-sm text-gray-600">Ordered: {order.ordered}</p>
              </motion.div>
              <motion.div 
                className="mt-4 md:mt-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <motion.span 
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'Processing' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {order.status}
                </motion.span>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );

  const SampleRequestsTab = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Sample Requests</h1>
      
      <div className="space-y-4">
        {sampleRequests.map((request, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">{request.name}</h3>
                <p className="text-sm text-gray-600">Product: {request.product}</p>
                <p className="text-sm text-gray-600">Purpose: {request.purpose}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center space-x-2">
                  <MessageCircle size={16} />
                  <span>Message</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const NotificationsTab = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
      
      {/* Notification Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Notification Settings</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Order Alerts</span>
            <button
              onClick={() => handleNotificationToggle('orderAlerts')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.orderAlerts ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.orderAlerts ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Chat Alerts</span>
            <button
              onClick={() => handleNotificationToggle('chatAlerts')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.chatAlerts ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.chatAlerts ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Supplier Offers</span>
            <button
              onClick={() => handleNotificationToggle('supplierOffers')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.supplierOffers ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.supplierOffers ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Notifications</h2>
        
        <div className="space-y-4">
          {recentNotifications.map((notification, index) => {
            const Icon = notification.icon;
            return (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  notification.type === 'success' ? 'bg-green-100' :
                  notification.type === 'info' ? 'bg-blue-100' : 'bg-orange-100'
                }`}>
                  <Icon size={16} className={
                    notification.type === 'success' ? 'text-green-600' :
                    notification.type === 'info' ? 'text-blue-600' : 'text-orange-600'
                  } />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{notification.message}</p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />;
      case 'delivered':
        return <OrdersDeliveredTab />;
      case 'received':
        return <OrdersReceivedTab />;
      case 'samples':
        return <SampleRequestsTab />;
      case 'notifications':
        return <NotificationsTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">R</span>
            </div>
            <span className="text-lg font-bold text-gray-800">RawConnect</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-gray-600"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 min-h-screen">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
            <div className="w-64 h-full">
              <Sidebar className="h-full" />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default RawConnectDashboard;