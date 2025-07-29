import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productsAPI } from "../services/productsAPI";
import apiClient from "../api/axios";

const categories = [
  "All Items",
  "vegetables",
  "spices",
  "grains",
  "fruits",
  "dairy",
  "other",
];

function RawItemsSection() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All Items");

  // Fetch products from backend - only RAW type products
  const fetchProducts = async (category = null) => {
    try {
      setLoading(true);
      setError(null);

      let response;

      if (category && category !== "All Items") {
        // Fetch RAW products with specific category filter
        console.log(
          "Fetching raw products with category:",
          category.toLowerCase()
        );
        response = await productsAPI.getProductsByType("raw", {
          category: category.toLowerCase(),
        });
      } else {
        // Fetch all RAW products
        console.log("Fetching all raw products");
        response = await productsAPI.getProductsByType("raw");
      }

      console.log("Raw products fetched:", {
        category: category || "All Items",
        requestedCategory:
          category !== "All Items" ? category?.toLowerCase() : null,
        success: response.success,
        count: response.data?.length || 0,
        products: response.data,
      });

      if (response.success) {
        setProducts(response.data || []);
      } else {
        setError("Failed to fetch products");
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching raw products:", err);
      setError("Error loading products. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle category filter
  const handleCategoryFilter = (category) => {
    console.log("Category filter changed to:", category);
    setActiveCategory(category);
    fetchProducts(category);
  };

  // Initial load
  useEffect(() => {
    fetchProducts();
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
  // Format category name for display
  const formatCategoryName = (category) => {
    if (category === "All Items") return category;
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <section className="w-full py-16">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            Raw Items <span className="text-orange-500">Marketplace</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fresh, unprocessed raw ingredients at wholesale prices. Direct from
            trusted suppliers to your kitchen.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryFilter(category)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeCategory === category
                  ? "bg-orange-500 text-white hover:bg-orange-600 shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-orange-300"
              }`}
            >
              {formatCategoryName(category)}
            </button>
          ))}
        </div>

        {/* Active Filter Display */}
        {activeCategory !== "All Items" && (
          <div className="text-center mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 text-orange-800 text-sm font-medium">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                  clipRule="evenodd"
                />
              </svg>
              Filtered by: {formatCategoryName(activeCategory)} (
              {products.length} {products.length === 1 ? "product" : "products"}
              )
              <button
                onClick={() => handleCategoryFilter("All Items")}
                className="ml-2 text-orange-600 hover:text-orange-800"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          </div>
        )}

        {/* Products Count Display for All Items */}
        {activeCategory === "All Items" && !loading && !error && (
          <div className="text-center mb-6">
            <span className="text-gray-600 text-sm">
              Showing {products.length} raw{" "}
              {products.length === 1 ? "product" : "products"}
            </span>
          </div>
        )}

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
              onClick={() => fetchProducts(activeCategory)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Products Found */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-6m-6 0h-6"
                />
              </svg>
            </div>
            <p className="text-gray-600 text-lg mb-2">
              No raw products found
              {activeCategory !== "All Items"
                ? ` in ${formatCategoryName(activeCategory)} category`
                : ""}
              .
            </p>
            {activeCategory !== "All Items" && (
              <button
                onClick={() => handleCategoryFilter("All Items")}
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                View all raw products instead
              </button>
            )}
          </div>
        )}

        {/* Items Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2">
            {products.map((product) => (
              <div
                key={product._id}
                className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 min-h-[320px]"
              >
                {/* Category Tag */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 text-xs font-semibold">
                    {formatCategoryName(product.category || product.type)}
                  </span>
                </div>

                {/* Floating Price Tag */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg font-bold transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
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
                  {/* Quantity Available Badge removed */}
                </div>

                {/* Content Container */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-500 transition-colors">
                    {product.itemName}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed mb-4">
                    {product.description ||
                      "High quality product from trusted supplier"}
                  </p>

                  {/* Supplier Info */}
                  {product.userId && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                      Supplier:{" "}
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

                {/* Stock Status Indicator removed */}
              </div>
            ))}
          </div>
        )}

        {/* Explore All Items Button */}
        <div className="mt-16 text-center">
          <button
            onClick={() => navigate("/all-items")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Explore All Items
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

export default RawItemsSection;
