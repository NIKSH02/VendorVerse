// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { profileAPI } from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.1 } },
};

const Profile = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  const [financialData, setFinancialData] = useState({
    totalRevenue: 0,
    totalExpenditure: 0,
    netBalance: 0,
    salesCount: 0,
    orderCount: 0,
  });

  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        const profileResponse = await profileAPI.getUserProfile();

        if (profileResponse.success) {
          const { user, statistics } = profileResponse.data;

          const completeProfile = {
            fullName: user.fullname || user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            businessType: user.isSupplier
              ? "Supplier"
              : user.isVendor
              ? "Vendor"
              : "Farmer",
            // Combined address for backward compatibility
            address: user.address
              ? `${user.address.city}, ${user.address.state}`
              : "",
            // Individual address fields
            street: user.address?.street || "",
            city: user.address?.city || "",
            state: user.address?.state || "",
            pincode: user.address?.pincode || "",
            rating: user.rating || 0,
            memberSince: new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            }),
          };

          // Check profile completeness - show warning instead of redirecting
          // since we're already on the profile page
          if (!completeProfile.fullName || !completeProfile.email) {
            setError("Please complete your profile information.");
          }

          setProfileData(completeProfile);

          setFinancialData({
            totalRevenue: statistics.totalRevenue || 0,
            totalExpenditure: statistics.totalExpenditure || 0,
            netBalance:
              (statistics.totalRevenue || 0) -
              (statistics.totalExpenditure || 0),
            salesCount: statistics.completedOrdersAsSeller || 0,
            orderCount: statistics.totalOrdersAsBuyer || 0,
          });
        } else {
          setError("Failed to load profile data.");
        }
      } catch (err) {
        console.error("Fetch error:", err);

        // Check if it's an authentication error
        if (err.response && err.response.status === 401) {
          // Only redirect to auth if we're not already loading the profile for the first time
          // This prevents unnecessary redirects on page refresh
          console.log("Authentication error - token may have expired");
          toast.error("Session expired. Please login again.", {
            duration: 4000,
            position: "top-center",
          });
          setTimeout(() => navigate("/auth"), 2000);
        } else {
          setError("Something went wrong. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleEditProfile = () => {
    // Extract address components if address is an object, otherwise use empty strings
    let street = "",
      city = "",
      state = "",
      pincode = "";

    if (profileData.address) {
      if (typeof profileData.address === "object") {
        // If address is already an object (from backend)
        street = profileData.address.street || "";
        city = profileData.address.city || "";
        state = profileData.address.state || "";
        pincode = profileData.address.pincode || "";
      } else {
        // If address is a string, try to parse it
        const addressParts = profileData.address.split(", ");
        city = addressParts[0] || "";
        state = addressParts[1] || "";
      }
    }

    setEditFormData({
      fullName: profileData.fullName,
      email: profileData.email,
      phone: profileData.phone,
      businessType: profileData.businessType,
      address: profileData.address,
      // Individual address fields
      street: street,
      city: city,
      state: state,
      pincode: pincode,
      lat: 0, // Default latitude - you might want to get this from user's address if available
      lng: 0, // Default longitude - you might want to get this from user's address if available
    });
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Add validation for pincode
    if (name === "pincode") {
      // Only allow numbers and limit to 6 digits
      const numericValue = value.replace(/\D/g, "").slice(0, 6);
      setEditFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Transform the form data to match backend expectations
      const transformedData = {
        fullname: editFormData.fullName?.trim(), // Backend expects 'fullname'
        email: editFormData.email?.trim(),
        phone: editFormData.phone?.trim(),
      };

      // Handle business type transformation - set flags based on selection
      if (editFormData.businessType) {
        transformedData.isSupplier =
          editFormData.businessType === "Supplier" ||
          editFormData.businessType === "Farmer & Supplier";
        transformedData.isVendor = editFormData.businessType === "Vendor";
      }

      // Handle address - create proper address object with all required fields
      // Only include address if at least city is provided
      if (editFormData.city?.trim()) {
        transformedData.address = {
          street: editFormData.street?.trim() || "",
          city: editFormData.city?.trim() || "",
          state: editFormData.state?.trim() || "",
          pincode: editFormData.pincode?.trim() || "",
          geolocation: {
            lat: parseFloat(editFormData.lat) || 0,
            lng: parseFloat(editFormData.lng) || 0,
          },
        };
      }

      console.log("Original form data:", editFormData);
      console.log("Sending transformed data:", transformedData);

      // Show loading toast
      const loadingToast = toast.loading("Updating profile...");

      const response = await profileAPI.updateUserProfile(transformedData);
      console.log("Update response:", response);

      if (response.success) {
        // Dismiss loading toast and show success
        toast.dismiss(loadingToast);
        toast.success("Profile updated successfully! 🎉", {
          duration: 4000,
          position: "top-center",
        });

        // Update local state with the form data
        const updatedProfile = {
          ...profileData,
          fullName: editFormData.fullName,
          email: editFormData.email,
          phone: editFormData.phone,
          businessType: editFormData.businessType,
          // Update individual address fields
          street: editFormData.street || "",
          city: editFormData.city || "",
          state: editFormData.state || "",
          pincode: editFormData.pincode || "",
          // Update combined address for backward compatibility
          address:
            editFormData.city && editFormData.state
              ? `${editFormData.city}, ${editFormData.state}`
              : profileData.address,
        };

        setProfileData(updatedProfile);
        setIsEditModalOpen(false);
      } else {
        console.error("Update failed:", response);
        toast.dismiss(loadingToast);
        toast.error("Failed to update profile. Please try again.", {
          duration: 4000,
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Update error:", error);

      // More detailed error handling with toast notifications
      if (error.response) {
        // Server responded with error status
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.message || error.message;

        if (statusCode === 400) {
          toast.error(`Validation Error: ${errorMessage}`, {
            duration: 5000,
            position: "top-center",
          });
        } else if (statusCode === 401) {
          toast.error("Authentication failed. Please login again.", {
            duration: 4000,
            position: "top-center",
          });
          setTimeout(() => navigate("/auth"), 2000);
        } else if (statusCode === 500) {
          toast.error(`Server Error: ${errorMessage}`, {
            duration: 5000,
            position: "top-center",
          });
        } else {
          toast.error(`Error ${statusCode}: ${errorMessage}`, {
            duration: 4000,
            position: "top-center",
          });
        }
      } else {
        toast.error(
          "Network error. Please check your connection and try again.",
          {
            duration: 4000,
            position: "top-center",
          }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <span className="ml-4 text-gray-600">Loading profile...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Add null check for profileData
  if (!profileData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <span className="ml-4 text-gray-600">Loading profile data...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-gray-700 border-b pb-2">
                Personal Information
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Full Name
                </label>
                <p className="text-gray-800 font-medium">
                  {profileData.fullName || "Not provided"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <p className="text-gray-800">
                  {profileData.email || "Not provided"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Phone
                </label>
                <p className="text-gray-800">
                  {profileData.phone || "Not provided"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Business Type
                </label>
                <p className="text-gray-800">
                  {profileData.businessType || "Not specified"}
                </p>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-gray-700 border-b pb-2">
                Address Details
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Street Address
                </label>
                <p className="text-gray-800">
                  {profileData.street || "Not provided"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  City
                </label>
                <p className="text-gray-800">
                  {profileData.city || "Not provided"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  State
                </label>
                <p className="text-gray-800">
                  {profileData.state || "Not provided"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Pincode
                </label>
                <p className="text-gray-800">
                  {profileData.pincode || "Not provided"}
                </p>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-gray-700 border-b pb-2">
                Account Information
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Member Since
                </label>
                <p className="text-gray-800">
                  {profileData.memberSince || "January 2024"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Rating
                </label>
                <div className="flex items-center">
                  <p className="text-gray-800 mr-2">
                    {profileData.rating || 0}/5
                  </p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-4 h-4 ${
                          star <= (profileData.rating || 0)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Profile Status
                </label>
                <p
                  className={`text-sm font-medium ${
                    profileData.fullName &&
                    profileData.email &&
                    profileData.phone &&
                    profileData.city
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {profileData.fullName &&
                  profileData.email &&
                  profileData.phone &&
                  profileData.city
                    ? "Complete"
                    : "Incomplete - Please update missing fields"}
                </p>
              </div>
            </div>
          </div>

          <motion.button
            className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEditProfile}
          >
            Edit Profile
          </motion.button>
        </motion.div>
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {[
                  { label: "Full Name", name: "fullName", required: true },
                  {
                    label: "Email",
                    name: "email",
                    type: "email",
                    required: true,
                  },
                  {
                    label: "Phone",
                    name: "phone",
                    type: "tel",
                    required: false,
                  },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm text-gray-600 mb-1">
                      {field.label}{" "}
                      {field.required && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={editFormData[field.name] || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required={field.required}
                    />
                  </div>
                ))}

                {/* Address fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={editFormData.street || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter street address"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={editFormData.city || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter city"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={editFormData.state || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter state"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={editFormData.pincode || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter 6-digit pincode"
                      maxLength="6"
                      pattern="[0-9]{6}"
                      title="Please enter a valid 6-digit pincode"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Business Type
                  </label>
                  <select
                    name="businessType"
                    value={editFormData.businessType || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Farmer">Farmer</option>
                    <option value="Supplier">Supplier</option>
                    <option value="Vendor">Vendor</option>
                    <option value="Farmer & Supplier">Farmer & Supplier</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Profile"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Toast Notifications */}
      <Toaster />
    </DashboardLayout>
  );
};

export default Profile;
