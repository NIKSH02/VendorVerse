import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Star, 
  Verified, 
  ShoppingCart, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  MapPin,
  Clock,
  Home,
  MessageCircle,
  Plus,
  User,
  Bell,
  HelpCircle,
  TrendingUp
} from 'lucide-react';

// Dummy data
const productData = {
  id: 1,
  name: "Premium Steel Rebar #4 (12mm)",
  price: 2.45,
  unit: "per meter",
  rating: 4.5,
  totalReviews: 127,
  isVerified: true,
  images: [
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&h=400&fit=crop",
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500&h=400&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop",
    "https://images.unsplash.com/photo-1565796016834-2ae93ced7e5e?w=500&h=400&fit=crop"
  ],
  supplier: {
    name: "MetalCorp Industries",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    category: "Steel & Metal Supplier",
    responseTime: "~2 hours",
    location: "Brooklyn, NY • 2.3 miles away"
  },
  description: "High-grade steel reinforcement bars perfect for construction projects. These rebars meet all industry standards and are ideal for foundations, concrete structures, and building frameworks.",
  specifications: {
    diameter: "12mm (#4)",
    length: "Standard 12m lengths",
    grade: "Grade 60",
    material: "Carbon Steel",
    coating: "Mill Scale"
  }
};

const reviewsData = [
  {
    id: 1,
    user: {
      name: "Mike Rodriguez",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
    },
    rating: 5,
    date: "2 days ago",
    content: "Excellent quality rebar. Used for foundation work and it exceeded expectations. Fast delivery and well packaged."
  },
  {
    id: 2,
    user: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=32&h=32&fit=crop&crop=face"
    },
    rating: 4,
    date: "1 week ago",
    content: "Good quality steel rebar. Pricing is competitive and delivery was on time. Would order again for future projects."
  },
  {
    id: 3,
    user: {
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
    },
    rating: 5,
    date: "2 weeks ago",
    content: "Perfect for our construction needs. The supplier was very responsive and helpful with technical questions."
  }
];

const qaData = [
  {
    id: 1,
    question: "What is the minimum order quantity?",
    answer: "Minimum order is 100 meters. We offer bulk discounts for orders over 500 meters.",
    askedBy: "John Builder",
    answeredBy: "MetalCorp Industries",
    date: "3 days ago"
  },
  {
    id: 2,
    question: "Do you provide cutting services?",
    answer: "Yes, we offer custom cutting services for an additional fee. Please specify your requirements when ordering.",
    askedBy: "Construction Pro",
    answeredBy: "MetalCorp Industries", 
    date: "1 week ago"
  }
];

const ImageCarousel = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);

  const nextImage = () => {
    const next = currentImage === images.length - 1 ? 0 : currentImage + 1;
    setCurrentImage(next);
    setSelectedThumbnail(next);
  };

  const prevImage = () => {
    const prev = currentImage === 0 ? images.length - 1 : currentImage - 1;
    setCurrentImage(prev);
    setSelectedThumbnail(prev);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative bg-white rounded-lg overflow-hidden">
        <img
          src={images[currentImage]}
          alt="Product"
          className="w-full h-64 md:h-80 object-cover"
        />
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex space-x-2 overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentImage(index);
              setSelectedThumbnail(index);
            }}
            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
              selectedThumbnail === index ? 'border-orange-500' : 'border-gray-200'
            }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

const StarRating = ({ rating, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

const Sidebar = () => (
  <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
    <div className="flex items-center px-6 py-4 border-b border-gray-200">
      <div className="w-8 h-8 bg-orange-400 rounded-lg flex items-center justify-center mr-3">
        <span className="text-white font-bold text-sm">R</span>
      </div>
      <span className="font-semibold text-gray-900">Raw</span>
    </div>

    <nav className="flex-1 px-4 py-6 space-y-2">
      <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
        <Home size={20} className="mr-3" />
        Dashboard
      </a>
      <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
        <Users size={20} className="mr-3" />
        Community Requests
      </a>
      <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
        <MessageCircle size={20} className="mr-3" />
        Private Messages
      </a>
      <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
        <ShoppingCart size={20} className="mr-3" />
        My Inventory
      </a>
    </nav>

    <div className="px-4 py-6">
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <img
          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=32&h=32&fit=crop&crop=face"
          alt="User"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-medium text-gray-900">John Carpenter</p>
          <p className="text-xs text-gray-500">Building Contractor</p>
        </div>
      </div>
    </div>
  </div>
);

const BottomNavigation = () => (
  <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
    <div className="flex justify-around">
      <button className="flex flex-col items-center py-2 text-gray-400">
        <Home size={20} />
        <span className="text-xs mt-1">Home</span>
      </button>
      <button className="flex flex-col items-center py-2 text-gray-400">
        <MessageCircle size={20} />
        <span className="text-xs mt-1">Requests</span>
      </button>
      <button className="flex flex-col items-center py-2 text-gray-400">
        <Plus size={20} />
        <span className="text-xs mt-1">New</span>
      </button>
      <button className="flex flex-col items-center py-2 text-gray-400">
        <User size={20} />
        <span className="text-xs mt-1">Profile</span>
      </button>
      <button className="flex flex-col items-center py-2 text-gray-400">
        <Bell size={20} />
        <span className="text-xs mt-1">Alerts</span>
      </button>
    </div>
  </div>
);

const StickyOrderButtons = () => (
  <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4">
    <div className="flex space-x-3">
      <button className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-4 rounded-xl flex items-center justify-center space-x-2 font-semibold transition-all duration-200 shadow-lg">
        <ShoppingCart size={20} />
        <span>Add to Cart</span>
      </button>
      <button className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-3 px-4 rounded-xl flex items-center justify-center space-x-2 font-semibold transition-all duration-200 shadow-lg">
        <Users size={20} />
        <span>Group Order</span>
      </button>
    </div>
  </div>
);

const ProductDetail = () => {
  const [activeTab, setActiveTab] = useState('reviews');

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Product Detail</h1>
          </div>
        </header>

        {/* Breadcrumb */}
        <div className="px-4 lg:px-6 py-3 bg-white border-b border-gray-100">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Home</span>
            <span>›</span>
            <span>Search</span>
            <span>›</span>
            <span className="text-gray-900">Premium Steel Rebar</span>
          </div>
        </div>

        {/* Main Content */}
        <main className="px-4 lg:px-6 py-6 pb-32 lg:pb-6">
          <div className="max-w-6xl mx-auto">
            {/* Product Info Section - Side by Side on Desktop, Stacked on Mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Left Column - Image Gallery */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <ImageCarousel images={productData.images} />
                </div>
              </div>

              {/* Right Column - Product Details */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="space-y-6">
                  {/* Product Title & Rating */}
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                      {productData.name}
                    </h1>
                    
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <StarRating rating={productData.rating} />
                        <span className="text-sm text-gray-600">
                          ({productData.rating}/5 • {productData.totalReviews} reviews)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mb-6">
                      <span className="text-3xl font-bold text-orange-500">
                        ${productData.price}
                      </span>
                      <span className="text-gray-600 text-lg">{productData.unit}</span>
                      {productData.isVerified && (
                        <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                          <Verified size={16} />
                          <span>Verified</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Supplier Information */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={productData.supplier.avatar}
                            alt={productData.supplier.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {productData.supplier.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {productData.supplier.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-teal-600 font-medium">Response time</div>
                        <div className="text-sm text-gray-600">{productData.supplier.responseTime}</div>
                      </div>
                    </div>
                  </div>

                  {/* Price History Placeholder */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Price History (30 days)
                    </h3>
                    <div className="h-20 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                      <span className="text-gray-500 text-sm">Price trend chart</span>
                    </div>
                  </div>

                  {/* Action Buttons - Desktop Only */}
                  <div className="hidden lg:flex flex-col space-y-3 pt-4">
                    <button className="bg-orange-400 hover:bg-orange-600 text-white py-3 px-6 rounded-lg flex items-center justify-center space-x-2 font-medium transition-colors">
                      <ShoppingCart size={20} />
                      <span>Add to Cart</span>
                    </button>
                    <button className="border-2 border-teal-500 text-teal-600 hover:bg-teal-50 py-3 px-6 rounded-lg flex items-center justify-center space-x-2 font-medium transition-colors">
                      <Users size={20} />
                      <span>Start Group Order</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews & Information Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Tab Headers */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === 'reviews'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Reviews (127)
                </button>
                <button
                  onClick={() => setActiveTab('qa')}
                  className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === 'qa'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Q&A (23)
                </button>
                <button
                  onClick={() => setActiveTab('specifications')}
                  className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === 'specifications'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Specifications
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {reviewsData.map(review => (
                      <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                        <div className="flex items-start space-x-4">
                          <img
                            src={review.user.avatar}
                            alt={review.user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{review.user.name}</h4>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                            <StarRating rating={review.rating} size="sm" />
                            <p className="mt-3 text-gray-700">{review.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'qa' && (
                  <div className="space-y-6">
                    {qaData.map(qa => (
                      <div key={qa.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">Q: {qa.question}</h4>
                            <span className="text-sm text-gray-500">{qa.date}</span>
                          </div>
                          <p className="text-sm text-gray-600">Asked by {qa.askedBy}</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <p className="text-gray-700 mb-2"><strong>A:</strong> {qa.answer}</p>
                          <p className="text-sm text-gray-600">— {qa.answeredBy}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(productData.specifications).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-4 rounded-lg">
                        <dt className="font-medium text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </dt>
                        <dd className="text-gray-700 mt-1">{value}</dd>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sticky Buttons */}
      <StickyOrderButtons />

      {/* Help Button */}
      <button className="lg:hidden fixed bottom-32 right-4 bg-blue-500 hover:bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors group">
        <HelpCircle size={24} />
        <div className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Need Help?
        </div>
      </button>

      <BottomNavigation />
    </div>
  );
};

export default ProductDetail;