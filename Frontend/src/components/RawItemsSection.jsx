import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';

const categories = ['All Items', 'vegetables', 'spices', 'grains', 'fruits', 'dairy'];

function RawItemsSection() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All Items');

  // Fetch products from backend
  const fetchProducts = async (category = null) => {
    try {
      setLoading(true);
      setError(null);
      
      let url;
      if (category && category !== 'All Items') {
        // Fetch products by category using query parameter
        url = `/products?category=${encodeURIComponent(category)}`;
      } else {
        // Fetch all products
        url = '/products';
      }
      
      const response = await apiClient.get(url);
      
      if (response.data.success) {
        setProducts(response.data.data || []);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error loading products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle category filter
  const handleCategoryFilter = (category) => {
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
    if (product.imageUrls && product.imageUrls.length > 0) return product.imageUrls[0];
    if (product.imageDetails && product.imageDetails.length > 0) {
      const primaryImage = product.imageDetails.find(img => img.isPrimary);
      return primaryImage ? primaryImage.url : product.imageDetails[0].url;
    }
    return '/placeholder-product.jpg'; // Fallback image
  };
  // Format category name for display
  const formatCategoryName = (category) => {
    if (category === 'All Items') return category;
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
            High-quality ingredients at wholesale prices. Direct from trusted suppliers to your kitchen.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryFilter(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                activeCategory === category
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {formatCategoryName(category)}
            </button>
          ))}
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
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              No products found in this category.
            </p>
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
                      e.target.src = '/placeholder-product.jpg';
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
                    {product.description || 'High quality product from trusted supplier'}
                  </p>

                  {/* Supplier Info */}
                  {product.userId && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                      Supplier: {product.userId.fullname || product.userId.name || product.userId.username}
                    </div>
                  )}

                  {/* Action Button: Place Order */}
                  <div className="flex gap-2">
                    <button
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-xs"
                      onClick={() => navigate('/productdetail', { state: { item: product } })}
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
            onClick={() => navigate('/all-items')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Explore All Items
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default RawItemsSection;
