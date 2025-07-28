import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { productsAPI } from "../services/productsAPI";

function AllItemsPage() {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [typeFilter, setTypeFilter] = useState("All"); // 'All', 'raw', 'complete'
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Available categories (will be populated from fetched data)
  const [availableCategories, setAvailableCategories] = useState([]);

  // Fetch all products from database
  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all products regardless of type
      const response = await productsAPI.getAllProducts();

      console.log("All products fetched:", {
        success: response.success,
        count: response.data?.length || 0,
        products: response.data,
      });

      if (response.success) {
        const products = response.data || [];
        setAllProducts(products);

        // Extract unique categories for filter dropdown
        const categories = [
          ...new Set(products.map((p) => p.category).filter(Boolean)),
        ];
        setAvailableCategories(categories);

        setFilteredProducts(products);
      } else {
        setError("Failed to fetch products");
        setAllProducts([]);
        setFilteredProducts([]);
      }
    } catch (err) {
      console.error("Error fetching all products:", err);
      setError("Error loading products. Please try again.");
      setAllProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and search
  const applyFilters = () => {
    let filtered = [...allProducts];

    // Apply type filter
    if (typeFilter !== "All") {
      filtered = filtered.filter((product) => product.type === typeFilter);
    }

    // Apply category filter
    if (categoryFilter !== "All") {
      filtered = filtered.filter(
        (product) =>
          product.category &&
          product.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          (product.itemName &&
            product.itemName.toLowerCase().includes(query)) ||
          (product.description &&
            product.description.toLowerCase().includes(query)) ||
          (product.category && product.category.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return (a.pricePerUnit || 0) - (b.pricePerUnit || 0);
        case "category":
          return (a.category || "").localeCompare(b.category || "");
        case "type":
          return (a.type || "").localeCompare(b.type || "");
        case "name":
        default:
          return (a.itemName || "").localeCompare(b.itemName || "");
      }
    });

    setFilteredProducts(filtered);
  };

  // Initial load
  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Apply filters whenever filter states change
  useEffect(() => {
    applyFilters();
  }, [typeFilter, categoryFilter, searchQuery, sortBy, allProducts]);

  // On mount, check for URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sort = params.get("sort");
    if (sort === "complete") {
      setTypeFilter("complete");
    } else if (sort === "raw") {
      setTypeFilter("raw");
    }
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

  // Format type for display
  const formatType = (type) => {
    if (!type) return "Unknown";
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              All Available <span className="text-orange-500">Products</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Browse our complete collection of raw ingredients and prepared
              items from trusted suppliers
            </p>
          </div>
          {/* Filters and Search */}
          <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search products, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none"
                />
                <svg
                  className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap gap-4 items-center">
                {/* Type Filter */}
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none min-w-[140px]"
                >
                  <option value="All">All Types</option>
                  <option value="raw">Raw Products</option>
                  <option value="complete">Complete Products</option>
                </select>

                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none min-w-[140px]"
                >
                  <option value="All">All Categories</option>
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>

                {/* Sort By Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none min-w-[140px]"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                  <option value="category">Sort by Category</option>
                  <option value="type">Sort by Type</option>
                </select>

                {/* Clear Filters Button */}
                <button
                  onClick={() => {
                    setTypeFilter("All");
                    setCategoryFilter("All");
                    setSearchQuery("");
                    setSortBy("name");
                  }}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Filter Summary */}
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <span>Showing {filteredProducts.length} products</span>
              {typeFilter !== "All" && (
                <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded-full">
                  Type: {formatType(typeFilter)}
                </span>
              )}
              {categoryFilter !== "All" && (
                <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                  Category: {categoryFilter}
                </span>
              )}
              {searchQuery && (
                <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full">
                  Search: "{searchQuery}"
                </span>
              )}
            </div>
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
                onClick={fetchAllProducts}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* No Products Found */}
          {!loading && !error && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">
                No products found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setTypeFilter("All");
                  setCategoryFilter("All");
                  setSearchQuery("");
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Items Grid */}
          {!loading && !error && filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Type & Category Tags */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                    <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold">
                      {product.category || "Uncategorized"}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold">
                      {formatType(product.type)}
                    </span>
                  </div>

                  {/* Floating Price Tag */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-black text-white px-4 py-2 rounded-lg font-bold transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
                      {formatPrice(product.pricePerUnit, product.unit)}
                    </div>
                  </div>

                  {/* Image Container with Gradient Overlay */}
                  <div className="relative h-56 rounded-t-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                    <img
                      src={getImageUrl(product)}
                      alt={product.itemName}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "/placeholder-product.jpg";
                      }}
                    />
                    {/* Quantity Available Badge */}
                    <div className="absolute bottom-4 left-4 z-20 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-white text-xs">
                        Available: {product.quantityAvailable} {product.unit}
                      </span>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                      {product.itemName}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {product.description ||
                        "High quality product from trusted supplier"}
                    </p>

                    {/* Supplier Info */}
                    {product.userId && (
                      <div className="text-xs text-gray-500 mb-4">
                        Supplier:{" "}
                        {product.userId.fullname ||
                          product.userId.name ||
                          product.userId.username}
                      </div>
                    )}

                    {/* Action Button: Place Order */}
                    <div className="flex gap-3">
                      <button
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                        onClick={() =>
                          navigate("/productdetail", {
                            state: { item: product },
                          })
                        }
                      >
                        Place Order
                      </button>
                    </div>
                  </div>

                  {/* Active Status Indicator */}
                  {product.isActive && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-green-400 ring-4 ring-white"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AllItemsPage;
