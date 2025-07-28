import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productsAPI } from "../services/productsAPI";

function SpecialItemsSection() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch complete products from backend
  const fetchCompleteProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products with type="complete" only
      const response = await productsAPI.getProductsByType("complete");

      console.log("Complete products fetched:", {
        success: response.success,
        count: response.data?.length || 0,
        products: response.data,
      });

      if (response.success) {
        setProducts(response.data || []);
      } else {
        setError("Failed to fetch special items");
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching complete products:", err);
      setError("Error loading special items. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCompleteProducts();
  }, []);

  // Format price display
  const formatPrice = (price, unit) => {
    return `₹${price}/${unit}`;
  };

  // Get primary image URL
  const getImageUrl = (product) => {
    if (product.imageUrl) return product.imageUrl;
    if (product.imageUrls && product.imageUrls.length > 0)
      return product.imageUrls[0];
    if (product.imageDetails && product.imageDetails.length > 0) {
      const primaryImage = product.imageDetails.find((img) => img.isPrimary);
      return primaryImage ? primaryImage.url : product.imageDetails[0].url;
    }
    return "/placeholder-product.jpg"; // Fallback image
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Special <span className="text-orange-500">Preparations</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handcrafted delicacies and special complete
            preparations made with love and tradition
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
            <button
              onClick={fetchCompleteProducts}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Products Found */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No special preparations available at the moment.
            </p>
          </div>
        )}

        {/* Items Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2">
            {products.map((product) => (
              <div
                key={product._id}
                className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 min-h-[320px]"
              >
                {/* Category Tag */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold">
                    {product.category || "Special"}
                  </span>
                </div>

                {/* Floating Price Tag */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-black text-white px-4 py-2 rounded-lg font-bold transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
                    {formatPrice(product.pricePerUnit, product.unit)}
                  </div>
                </div>

                {/* Image Container with Gradient Overlay */}
                <div className="relative h-36 rounded-t-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                  <img
                    src={getImageUrl(product)}
                    alt={product.itemName}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "/placeholder-product.jpg";
                    }}
                  />
                  {/* Availability Badge */}
                  <div className="absolute bottom-4 left-4 z-20 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-white text-xs">
                      Available: {product.quantityAvailable} {product.unit}
                    </span>
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                    {product.itemName}
                  </h3>

                  <p className="text-gray-600 text-xs leading-relaxed mb-4">
                    {product.description ||
                      "Special handcrafted preparation ready to serve"}
                  </p>

                  {/* Supplier Info */}
                  {product.userId && (
                    <div className="text-xs text-gray-500 mb-3">
                      By:{" "}
                      {product.userId.fullname ||
                        product.userId.name ||
                        product.userId.username}
                    </div>
                  )}

                  {/* Action Button: Place Order */}
                  <div className="flex gap-2">
                    <button
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-xs"
                      onClick={() =>
                        navigate("/productdetail", { state: { item: product } })
                      }
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Explore All Special Items Button */}
        <div className="mt-16 text-center">
          <button
            onClick={() => navigate("/all-items")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Explore All Special Items
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default SpecialItemsSection;
