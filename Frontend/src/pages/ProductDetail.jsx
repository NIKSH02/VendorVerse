import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductReviews from "../components/ProductReviews";
import {
  ChevronLeft,
  ChevronRight,
  Package,
  Tag,
  Calendar,
  MapPin,
  Truck,
  Star,
  ArrowLeft,
  User,
  Phone,
  Mail,
  Plus,
  Minus,
  ShoppingCart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useOrders } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";

const ProductDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { placeOrder, loading } = useOrders();

  // Get product data from navigation state
  const product = location.state?.item;

  // Set initial delivery type based on availability
  const initialDeliveryType = product?.deliveryAvailable
    ? "delivery"
    : "pickup";

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullReviews, setShowFullReviews] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [deliveryType, setDeliveryType] = useState(initialDeliveryType);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");

  // Redirect if no product data
  useEffect(() => {
    if (!product) {
      toast.error("Product not found");
      navigate("/");
    }
  }, [product, navigate]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Prepare images array
  const images = [];
  if (product.imageUrl)
    images.push({ url: product.imageUrl, alt: product.itemName });
  if (product.imageUrls && product.imageUrls.length > 0) {
    product.imageUrls.forEach((url, index) => {
      if (url !== product.imageUrl) {
        // Avoid duplicates
        images.push({ url, alt: `${product.itemName} - Image ${index + 1}` });
      }
    });
  }
  if (product.imageDetails && product.imageDetails.length > 0) {
    product.imageDetails.forEach((detail, index) => {
      if (!images.some((img) => img.url === detail.url)) {
        // Avoid duplicates
        images.push({
          url: detail.url,
          alt: `${product.itemName} - Detail ${index + 1}`,
        });
      }
    });
  }

  // Fallback image if no images available
  if (images.length === 0) {
    images.push({ url: "/placeholder-product.jpg", alt: product.itemName });
  }

  // Format price display
  const formatPrice = (price, unit) => {
    return `₹${price}/${unit}`;
  };

  // Calculate total price with delivery
  const totalPriceWithDelivery =
    product.pricePerUnit + (product.deliveryFee || 0);

  // Calculate order total based on selected quantity and delivery type
  const orderSubtotal = product.pricePerUnit * selectedQuantity;
  const orderDeliveryFee =
    deliveryType === "delivery" && product.deliveryAvailable
      ? product.deliveryFee || 0
      : 0;
  const orderTotal = orderSubtotal + orderDeliveryFee;

  // Generate preset quantity options based on product unit and available stock
  const generateQuantityPresets = () => {
    const maxStock = product.quantityAvailable || 100;
    const unit = product.unit || "kg";

    // Different presets based on unit type
    if (unit.toLowerCase().includes("kg")) {
      return [1, 5, 10, 25, 50].filter((qty) => qty <= maxStock);
    } else if (
      unit.toLowerCase().includes("piece") ||
      unit.toLowerCase().includes("pcs")
    ) {
      return [1, 12, 24, 50, 100].filter((qty) => qty <= maxStock);
    } else if (
      unit.toLowerCase().includes("liter") ||
      unit.toLowerCase().includes("litre")
    ) {
      return [1, 2, 5, 10, 20].filter((qty) => qty <= maxStock);
    } else {
      return [1, 5, 10, 20, 50].filter((qty) => qty <= maxStock);
    }
  };

  const quantityPresets = generateQuantityPresets();

  // Quantity selector functions
  const increaseQuantity = () => {
    const maxQuantity = product.quantityAvailable || 100;
    if (selectedQuantity < maxQuantity) {
      setSelectedQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (selectedQuantity > 1) {
      setSelectedQuantity((prev) => prev - 1);
    }
  };

  const selectPresetQuantity = (quantity) => {
    setSelectedQuantity(quantity);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePlaceOrder = async () => {
    console.log("🛒 Place Order clicked!");
    console.log("User:", user);
    console.log("Product:", product);
    console.log("Selected Quantity:", selectedQuantity);
    console.log("Delivery Type:", deliveryType);
    console.log("Delivery Address:", deliveryAddress);

    try {
      // Validation
      if (!user) {
        console.log("❌ No user found");
        toast.error("Please login to place an order");
        navigate("/login");
        return;
      }

      if (selectedQuantity <= 0) {
        console.log("❌ Invalid quantity");
        toast.error("Please select a valid quantity");
        return;
      }

      if (selectedQuantity > (product.quantityAvailable || 0)) {
        console.log("❌ Quantity exceeds stock");
        toast.error("Selected quantity exceeds available stock");
        return;
      }

      if (deliveryType === "delivery" && !deliveryAddress.trim()) {
        console.log("❌ No delivery address");
        toast.error("Please provide delivery address");
        return;
      }

      // Prepare order data
      const orderData = {
        productId: product._id,
        quantity: selectedQuantity,
        deliveryType,
        deliveryAddress:
          deliveryType === "delivery" ? deliveryAddress : undefined,
        pickupAddress:
          deliveryType === "pickup" ? product.location?.address : undefined,
        notes:
          orderNotes ||
          `Order for ${selectedQuantity} ${product.unit} of ${product.itemName}`,
      };

      console.log("📦 Order Data:", orderData);

      // Place the order
      console.log("🚀 Calling placeOrder...");
      await placeOrder(orderData);

      console.log("✅ Order placed successfully!");
      // Navigate to orders page
      navigate("/dashboard/orders-placed");
    } catch (error) {
      console.error("❌ Error placing order:", error);
      // Error toast is handled in OrderContext
    }
  };

  const handleNegotiate = () => {
    toast.success(
      `Negotiation request sent for ${selectedQuantity} ${product.unit}!`
    );
  };

  const handleRequestSample = () => {
    toast.success("Sample request feature coming soon!");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 font-sans">
        {/* Back Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Products
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-4 lg:p-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="lg:flex">
              {/* Left Column: Images */}
              <div className="lg:w-1/2 p-6 lg:p-8">
                {/* Main Product Image */}
                <div
                  className="relative rounded-xl overflow-hidden bg-gray-100 mb-6"
                  style={{ height: "400px" }}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={images[currentImageIndex].url}
                      src={images[currentImageIndex].url}
                      alt={images[currentImageIndex].alt}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder-product.jpg";
                      }}
                    />
                  </AnimatePresence>

                  {/* Navigation arrows - only show if multiple images */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                      >
                        <ChevronLeft size={24} className="text-gray-800" />
                      </button>
                      <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                      >
                        <ChevronRight size={24} className="text-gray-800" />
                      </button>
                    </>
                  )}

                  {/* Image indicator */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full">
                      <span className="text-white text-sm">
                        {currentImageIndex + 1} / {images.length}
                      </span>
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex
                            ? "border-orange-500 ring-2 ring-orange-200"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={img.alt}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/placeholder-product.jpg";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Quantity Selection Section - Moved below images */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <ShoppingCart size={20} className="text-orange-600 mr-2" />
                    Select Quantity
                  </h3>

                  {/* Custom Quantity Selector */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center bg-white rounded-xl border-2 border-orange-200 overflow-hidden">
                      <button
                        onClick={decreaseQuantity}
                        disabled={selectedQuantity <= 1}
                        className="p-3 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus size={20} className="text-orange-600" />
                      </button>

                      <div className="px-6 py-3 min-w-[80px] text-center">
                        <span className="text-xl font-bold text-gray-900">
                          {selectedQuantity}
                        </span>
                        <div className="text-xs text-gray-500">
                          {product.unit}
                        </div>
                      </div>

                      <button
                        onClick={increaseQuantity}
                        disabled={
                          selectedQuantity >= (product.quantityAvailable || 100)
                        }
                        className="p-3 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus size={20} className="text-orange-600" />
                      </button>
                    </div>

                    {/* Stock Information */}
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        Available Stock
                      </div>
                      <div className="font-semibold text-gray-900">
                        {product.quantityAvailable} {product.unit}
                      </div>
                    </div>
                  </div>

                  {/* Preset Quantity Options */}
                  <div className="mb-6">
                    <div className="text-sm font-medium text-gray-700 mb-3">
                      Quick Select:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {quantityPresets.map((preset) => (
                        <button
                          key={preset}
                          onClick={() => selectPresetQuantity(preset)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all font-medium ${
                            selectedQuantity === preset
                              ? "bg-orange-600 border-orange-600 text-white shadow-lg"
                              : "bg-white border-orange-200 text-orange-600 hover:border-orange-400 hover:bg-orange-50"
                          }`}
                        >
                          {preset} {product.unit}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Options */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Delivery Options
                    </h4>
                    <div className="space-y-3">
                      {product.deliveryAvailable && (
                        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
                          <input
                            type="radio"
                            name="deliveryType"
                            value="delivery"
                            checked={deliveryType === "delivery"}
                            onChange={(e) => setDeliveryType(e.target.value)}
                            className="text-orange-600 focus:ring-orange-500"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              Home Delivery
                            </div>
                            <div className="text-sm text-gray-600">
                              Delivered to your address (₹
                              {product.deliveryFee || 0} fee)
                            </div>
                          </div>
                        </label>
                      )}

                      <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
                        <input
                          type="radio"
                          name="deliveryType"
                          value="pickup"
                          checked={deliveryType === "pickup"}
                          onChange={(e) => setDeliveryType(e.target.value)}
                          className="text-orange-600 focus:ring-orange-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            Self Pickup
                          </div>
                          <div className="text-sm text-gray-600">
                            Pick up from seller's location (No delivery fee)
                          </div>
                        </div>
                      </label>
                    </div>

                    {/* Delivery Address Input */}
                    {deliveryType === "delivery" && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Delivery Address
                        </label>
                        <textarea
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                          placeholder="Enter your complete delivery address..."
                        />
                      </div>
                    )}

                    {/* Order Notes */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order Notes (Optional)
                      </label>
                      <textarea
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                        placeholder="Any special instructions..."
                      />
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-white rounded-lg p-4 border border-orange-200">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Order Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {selectedQuantity} {product.unit} × ₹
                          {product.pricePerUnit}
                        </span>
                        <span className="font-semibold">₹{orderSubtotal}</span>
                      </div>

                      {deliveryType === "delivery" &&
                        product.deliveryAvailable &&
                        orderDeliveryFee > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Delivery Fee</span>
                            <span className="font-semibold">
                              ₹{orderDeliveryFee}
                            </span>
                          </div>
                        )}

                      <div className="border-t border-gray-200 pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-lg text-gray-900">
                            Total Amount
                          </span>
                          <span className="font-bold text-xl text-orange-600">
                            ₹{orderTotal}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Product Details */}
              <div className="lg:w-1/2 p-6 lg:p-8 lg:border-l border-gray-200">
                {/* Product Header */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {product.itemName}
                      </h1>
                      <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium capitalize">
                          {product.category || "Uncategorized"}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
                          {product.type || "Product"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-orange-600">
                        {formatPrice(product.pricePerUnit, product.unit)}
                      </div>
                      {product.deliveryAvailable && (
                        <div className="text-sm text-gray-500 mt-1">
                          + ₹{product.deliveryFee || 0} delivery
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Product Information */}
                <div className="space-y-6 mb-8">
                  {/* Key Details */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Product Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <Package size={18} className="text-orange-500 mr-3" />
                        <span className="text-gray-600">Stock Available:</span>
                        <span className="font-semibold ml-auto">
                          {product.quantityAvailable} {product.unit}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Tag size={18} className="text-orange-500 mr-3" />
                        <span className="text-gray-600">Category:</span>
                        <span className="font-semibold ml-auto capitalize">
                          {product.category || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Truck size={18} className="text-orange-500 mr-3" />
                        <span className="text-gray-600">Delivery:</span>
                        <span
                          className={`font-semibold ml-auto ${
                            product.deliveryAvailable
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {product.deliveryAvailable
                            ? "Available"
                            : "Not Available"}
                        </span>
                      </div>
                      {product.deliveryAvailable && (
                        <div className="flex items-center">
                          <span className="text-orange-500 font-bold text-lg mr-3">
                            ₹
                          </span>
                          <span className="text-gray-600">Delivery Fee:</span>
                          <span className="font-semibold ml-auto">
                            ₹{product.deliveryFee || 0}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Total Price */}
                    {product.deliveryAvailable && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-900">
                            Total (with delivery):
                          </span>
                          <span className="text-2xl font-bold text-orange-600">
                            ₹{totalPriceWithDelivery}/{product.unit}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Supplier Information */}
                  {product.userId && (
                    <div className="bg-blue-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Supplier Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <User size={18} className="text-blue-500 mr-3" />
                          <span className="text-gray-600">Supplier:</span>
                          <span className="font-semibold ml-auto">
                            {product.userId.fullname ||
                              product.userId.name ||
                              product.userId.username ||
                              "N/A"}
                          </span>
                        </div>
                        {product.userId.phone && (
                          <div className="flex items-center">
                            <Phone size={18} className="text-blue-500 mr-3" />
                            <span className="text-gray-600">Contact:</span>
                            <span className="font-semibold ml-auto">
                              {product.userId.phone}
                            </span>
                          </div>
                        )}
                        {product.userId.email && (
                          <div className="flex items-center">
                            <Mail size={18} className="text-blue-500 mr-3" />
                            <span className="text-gray-600">Email:</span>
                            <span className="font-semibold ml-auto">
                              {product.userId.email}
                            </span>
                          </div>
                        )}
                        {product.userId.rating !== undefined &&
                        product.userId.rating !== null ? (
                          <div className="flex items-center">
                            <Star size={18} className="text-blue-500 mr-3" />
                            <span className="text-gray-600">Rating:</span>
                            <div className="ml-auto flex items-center">
                              <div className="flex items-center mr-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={16}
                                    fill={
                                      i < Math.floor(product.userId.rating)
                                        ? "currentColor"
                                        : "none"
                                    }
                                    className={`${
                                      i < Math.floor(product.userId.rating)
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="font-semibold text-gray-900">
                                {product.userId.rating.toFixed(1)}/5
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Star size={18} className="text-blue-500 mr-3" />
                            <span className="text-gray-600">Rating:</span>
                            <span className="font-semibold ml-auto text-gray-500">
                              No ratings yet
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {product.description && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Description
                      </h3>
                      <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                        {product.description}
                      </p>
                    </div>
                  )}

                  {/* Location Information */}
                  {product.location && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Location
                      </h3>
                      <div className="flex items-center text-gray-700">
                        <MapPin size={18} className="text-orange-500 mr-3" />
                        <span>
                          {product.location.address || "Location available"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Take Action
                  </h3>

                  <motion.button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-colors duration-200 disabled:cursor-not-allowed"
                    whileHover={!loading ? { scale: 1.02 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <ShoppingCart size={20} />
                      <span>
                        {loading
                          ? "Placing Order..."
                          : `Order ${selectedQuantity} ${product.unit} - ₹${orderTotal}`}
                      </span>
                    </div>
                  </motion.button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.button
                      onClick={handleNegotiate}
                      className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Negotiate Price
                    </motion.button>

                    <motion.button
                      onClick={handleRequestSample}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Request Sample
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <ProductReviews
              listingId={product._id || product.id}
              sellerId={
                product.sellerId?._id || product.sellerId || product.userId
              }
              showFullReviews={showFullReviews}
              onToggleReviews={() => setShowFullReviews(!showFullReviews)}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetailPage;
