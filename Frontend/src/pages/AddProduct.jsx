import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import { productsAPI } from "../services/productsAPI";
import {
  Package,
  Upload,
  DollarSign,
  MapPin,
  Truck,
  ArrowLeft,
  Plus,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    itemName: "", // Backend expects itemName
    category: "",
    type: "raw_material",
    description: "",
    pricePerUnit: "",
    unit: "",
    quantityAvailable: "",
    deliveryAvailable: false,
    deliveryFee: "",
    location: {
      lat: 0,
      lng: 0,
      address: "Default location",
    },
    image: null, // Single image file
  });

  const categories = [
    "Grains & Cereals",
    "Vegetables",
    "Fruits",
    "Spices & Herbs",
    "Dairy Products",
    "Meat & Poultry",
    "Seafood",
    "Oils & Fats",
    "Beverages",
    "Processed Foods",
    "Other",
  ];

  // Mapping from frontend display names to backend enum values
  const categoryMapping = {
    "Grains & Cereals": "grains",
    Vegetables: "vegetables",
    Fruits: "fruits",
    "Spices & Herbs": "spices",
    "Dairy Products": "dairy",
    "Meat & Poultry": "meat",
    Seafood: "meat", // Map to 'meat' as seafood isn't in backend enum
    "Oils & Fats": "sauces", // Map to 'sauces' as closest match
    Beverages: "other",
    "Processed Foods": "other",
    Other: "other",
  };

  const units = ["kg", "grams", "liters", "ml", "pieces", "dozens", "packets"];

  // Mapping from frontend display names to backend enum values
  const unitMapping = {
    kg: "kg",
    grams: "grams",
    g: "grams", // Map 'g' to 'grams'
    liters: "liters",
    liter: "liters", // Map 'liter' to 'liters'
    ml: "ml",
    pieces: "pieces",
    piece: "pieces", // Map 'piece' to 'pieces'
    dozens: "dozens",
    dozen: "dozens", // Map 'dozen' to 'dozens'
    packets: "packets",
    quintal: "kg", // Map to kg as closest
    ton: "kg", // Map to kg as closest
    bag: "packets", // Map to packets as closest
    box: "packets", // Map to packets as closest
  };

  const productTypes = [
    { value: "raw_material", label: "Raw Material" },
    { value: "processed", label: "Processed" },
    { value: "semi_processed", label: "Semi Processed" },
  ];

  // Mapping from frontend values to backend enum values
  const typeMapping = {
    raw_material: "raw",
    processed: "complete",
    semi_processed: "half-baked",
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const loadingToast = toast.loading("Adding product...");

      // Create FormData for file upload
      const submitData = new FormData();

      // Handle each field with proper transformation
      Object.keys(formData).forEach((key) => {
        if (key === "category") {
          // Map category to backend enum value
          const backendCategory =
            categoryMapping[formData[key]] || formData[key].toLowerCase();
          submitData.append(key, backendCategory);
        } else if (key === "unit") {
          // Map unit to backend enum value
          const backendUnit = unitMapping[formData[key]] || formData[key];
          submitData.append(key, backendUnit);
        } else if (key === "type") {
          // Map type to backend enum value
          const backendType = typeMapping[formData[key]] || formData[key];
          submitData.append(key, backendType);
        } else if (key === "location") {
          // Handle location object properly by sending as JSON string
          submitData.append("location", JSON.stringify(formData[key]));
        } else if (key === "image") {
          // Skip image here - will be handled separately
          return;
        } else if (formData[key] !== null && formData[key] !== "") {
          submitData.append(key, formData[key]);
        }
      });

      // Handle image file - send as images field for backend
      if (formData.image) {
        console.log("Image file to upload:", formData.image);
        console.log("Image file name:", formData.image.name);
        console.log("Image file size:", formData.image.size);
        console.log("Image file type:", formData.image.type);

        // Send the single image as 'images' to match backend expectation
        submitData.append("images", formData.image);
      }

      // Debug: Log FormData contents before sending
      console.log("FormData contents before sending:");
      for (let pair of submitData.entries()) {
        console.log(pair[0], pair[1]);
        // If it's a file, log additional details
        if (pair[1] instanceof File) {
          console.log(
            `  File details - name: ${pair[1].name}, size: ${pair[1].size}, type: ${pair[1].type}`
          );
        }
      }

      const response = await productsAPI.createProduct(submitData);

      if (response.success) {
        toast.dismiss(loadingToast);
        toast.success("Product added successfully! 🎉");
        navigate("/dashboard/my-listings");
      } else {
        throw new Error(response.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.dismiss(); // Dismiss any existing toasts

      // Show specific error messages
      if (error.code === "ECONNABORTED") {
        toast.error(
          "Upload timeout. Please check your internet connection and try again."
        );
      } else if (error.response) {
        // Server responded with error
        const errorMessage =
          error.response.data?.message || "Server error occurred";
        toast.error(`Failed to add product: ${errorMessage}`);
      } else if (error.request) {
        // Request was made but no response received
        toast.error("Network error. Please check your connection.");
      } else {
        // Something else happened
        toast.error("Failed to add product. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        className="max-w-4xl mx-auto space-y-6"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard/my-listings")}
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Add New Product
              </h1>
              <p className="text-gray-600">
                List your product for buyers to discover
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <motion.div
          className="bg-white rounded-lg border border-gray-200 p-6"
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>
              <div className="flex flex-col items-center justify-center w-full">
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG or JPEG (MAX. 5MB)
                      </p>
                    </div>
                  )}
                  <input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter product name"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  {productTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="locationAddress"
                  value={formData.location.address}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: {
                        ...prev.location,
                        address: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter location"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Unit (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="pricePerUnit"
                  value={formData.pricePerUnit}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit <span className="text-red-500">*</span>
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Unit</option>
                  {units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantityAvailable"
                  value={formData.quantityAvailable}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter quantity"
                  min="0"
                  required
                />
              </div>

              {/* Delivery Fee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Fee (₹)
                </label>
                <input
                  type="number"
                  name="deliveryFee"
                  value={formData.deliveryFee}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter delivery fee (optional)"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Describe your product..."
              />
            </div>

            {/* Delivery Available */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="deliveryAvailable"
                name="deliveryAvailable"
                checked={formData.deliveryAvailable}
                onChange={handleInputChange}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label
                htmlFor="deliveryAvailable"
                className="ml-2 block text-sm text-gray-900"
              >
                Delivery available
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <motion.button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                <Plus size={20} />
                <span>{loading ? "Adding Product..." : "Add Product"}</span>
              </motion.button>

              <motion.button
                type="button"
                onClick={() => navigate("/dashboard/my-listings")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>

      <Toaster />
    </DashboardLayout>
  );
};

export default AddProduct;
