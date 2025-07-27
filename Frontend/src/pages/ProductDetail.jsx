import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ChevronLeft, ChevronRight, Package, Tag, Calendar, MapPin, Truck, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const productData = {
  name: "VOLT VISION",
  images: [
    { url: "/potato.jpg", alt: "Fresh Potatoes" },
    { url: "/onion.jpg", alt: "Red Onions" },
    { url: "/tomato.jpg", alt: "Fresh Tomatoes" },
    { url: "/rice.jpg", alt: "Basmati Rice" }
  ],
  details: {
    stock: "50 kg",
    category: "Spices",
    price: 120,
    description: "Bhaut acchha hai. High-quality spices sourced directly from trusted local vendors. Perfect for all your culinary needs.",
    reviewsCount: 5
  },
  delivery: {
    available: "Yes",
    fee: "₹99.86"
  },
  reviews: [
    { author: "Rahul S.", rating: 5, comment: "Great quality product, very fresh and aromatic. Delivered quickly!" },
    { author: "Priya M.", rating: 4, comment: "Good service, the delivery was on time. Spices were good." },
    { author: "Ankit J.", rating: 5, comment: "Perfect for my needs. The description was accurate." },
  ]
};

const ProductDetailPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullReviews, setShowFullReviews] = useState(false);

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? productData.images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === productData.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-8 text-black">
        {/* Container for the whole page */}
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 lg:p-10 flex flex-col lg:flex-row gap-8">
          {/* Left Column: Image and Description */}
          <div className="lg:w-1/2 flex flex-col gap-6">
            {/* Main Product Image - Increased Size */}
            <div className="relative rounded-xl overflow-hidden w-full flex items-center justify-center bg-gray-50" style={{ minHeight: '350px', maxHeight: '480px' }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={productData.images[currentImageIndex].url}
                  src={productData.images[currentImageIndex].url}
                  alt={productData.images[currentImageIndex].alt}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="object-contain rounded-xl shadow-lg"
                  style={{ width: '100%', maxWidth: '480px', height: 'auto', maxHeight: '420px', background: '#fff' }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 flex items-center justify-between p-4">
                <button onClick={handlePrev} className="bg-white/50 hover:bg-white/75 p-2 rounded-full transition-colors duration-200">
                  <ChevronLeft size={28} className="text-black" />
                </button>
                <button onClick={handleNext} className="bg-white/50 hover:bg-white/75 p-2 rounded-full transition-colors duration-200">
                  <ChevronRight size={28} className="text-black" />
                </button>
              </div>
            </div>

            {/* Thumbnail images */}
            <div className="flex justify-center gap-2 mt-2">
              {productData.images.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt={img.alt}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`object-contain rounded-md cursor-pointer border-2 transition-all duration-200 bg-white shadow-sm"
                    ${index === currentImageIndex ? 'border-orange-500' : 'border-transparent hover:border-gray-300'}`}
                  style={{ width: '90px', height: '70px' }}
                />
              ))}
            </div>

            {/* Product Description and Reviews Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold mb-2">Description</h3>
              <p className="text-gray-700">{productData.details.description}</p>
              <div className="mt-4">
                <button
                  className="flex items-center text-orange-600 hover:text-orange-800 font-semibold text-sm transition-colors"
                  onClick={() => setShowFullReviews(!showFullReviews)}
                >
                  <Star size={16} className="mr-1" fill="currentColor" stroke="none" />
                  {productData.details.reviewsCount} Reviews
                </button>
              </div>

              {/* Reviews Section - Visible below description */}
              <AnimatePresence>
                {showFullReviews && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 pt-4 border-t border-gray-200 overflow-hidden"
                  >
                    <h4 className="text-lg font-bold mb-3">Customer Reviews</h4>
                    <div className="flex flex-col gap-4">
                      {productData.reviews.map((review, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center mb-1">
                            <span className="font-semibold text-sm">{review.author}</span>
                            <span className="text-xs text-gray-500 ml-2">({review.rating}/5)</span>
                            <div className="ml-auto flex">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} size={14} fill="currentColor" stroke="none" className="text-yellow-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm italic">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Details and Action Buttons */}
          <div className="lg:w-1/2 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-3xl font-bold text-black mb-4">{productData.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-700"><Package size={18} className="mr-2 text-orange-500" /> Stock Available: <span className="font-semibold ml-auto">{productData.details.stock}</span></div>
                <div className="flex items-center text-gray-700"><Tag size={18} className="mr-2 text-orange-500" /> Category: <span className="font-semibold ml-auto">{productData.details.category}</span></div>
                <div className="flex items-center text-gray-700"><span className="text-orange-500 font-bold text-lg mr-2">₹</span> Price: <span className="font-semibold ml-auto">₹{productData.details.price}</span></div>
                <div className="flex items-center text-gray-700"><span className="text-orange-500 font-bold text-lg mr-2">₹</span> Price + Delivery: <span className="font-semibold ml-auto">₹{productData.details.price + parseFloat(productData.delivery.fee.replace('₹',''))}</span></div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-bold mb-2">Delivery Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-700"><Truck size={18} className="mr-2 text-orange-500" /> Delivery Available: <span className="font-semibold ml-auto text-green-600">{productData.delivery.available}</span></div>
                  <div className="flex items-center text-gray-700"><span className="text-orange-500 font-bold text-lg mr-2">₹</span> Delivery Fee: <span className="font-semibold ml-auto">{productData.delivery.fee}</span></div>
                </div>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold mb-4">Actions</h3>
              <div className="flex flex-col gap-4">
                <button className="w-full bg-orange-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-orange-700 transition-colors duration-200">
                  Place Order
                </button>
                <button className="w-full bg-gray-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-gray-900 transition-colors duration-200">
                  Negotiate Price
                </button>
                <button className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-xl shadow-md hover:bg-gray-300 transition-colors duration-200">
                  Ask a Sample
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetailPage;