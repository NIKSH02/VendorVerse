import React from 'react';
import { useNavigate } from 'react-router-dom';

const rawItems = [
  {
    id: 1,
    name: 'Fresh Potatoes',
    image: '/potato.jpg', // You'll need to add these images to your public folder
    description: 'Premium quality potatoes perfect for all your cooking needs',
    price: '₹25/kg',
    minOrder: '10 kg',
    available: true,
    category: 'Vegetables'
  },
  {
    id: 2,
    name: 'Red Onions',
    image: '/onion.jpg',
    description: 'Fresh and crisp onions sourced directly from farmers',
    price: '₹35/kg',
    minOrder: '5 kg',
    available: true,
    category: 'Vegetables'
  },
  {
    id: 3,
    name: 'Fresh Tomatoes',
    image: '/tomato.jpg',
    description: 'Ripe, juicy tomatoes perfect for curries and chutneys',
    price: '₹40/kg',
    minOrder: '5 kg',
    available: true,
    category: 'Vegetables'
  },
  {
    id: 4,
    name: 'Basmati Rice',
    image: '/rice.jpg',
    description: 'Premium long-grain basmati rice',
    price: '₹80/kg',
    minOrder: '25 kg',
    available: true,
    category: 'Grains'
  },
  {
    id: 5,
    name: 'Green Chilies',
    image: '/chili.jpg',
    description: 'Fresh green chilies for the perfect spice level',
    price: '₹60/kg',
    minOrder: '2 kg',
    available: true,
    category: 'Spices'
  },
  {
    id: 6,
    name: 'Fresh Ginger',
    image: '/ginger.jpg',
    description: 'Aromatic ginger root for authentic Indian dishes',
    price: '₹120/kg',
    minOrder: '2 kg',
    available: true,
    category: 'Spices'
  }
];

function RawItemsSection() {
  const navigate = useNavigate();
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
          <button className="px-6 py-2 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors">
            All Items
          </button>
          <button className="px-6 py-2 rounded-full bg-white text-gray-700 font-semibold hover:bg-gray-100 transition-colors border border-gray-200">
            Vegetables
          </button>
          <button className="px-6 py-2 rounded-full bg-white text-gray-700 font-semibold hover:bg-gray-100 transition-colors border border-gray-200">
            Spices
          </button>
          <button className="px-6 py-2 rounded-full bg-white text-gray-700 font-semibold hover:bg-gray-100 transition-colors border border-gray-200">
            Grains
          </button>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2">
          {rawItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              {/* Category Tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold">
                  {item.category}
                </span>
              </div>

              {/* Floating Price Tag */}
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-black text-white px-4 py-2 rounded-lg font-bold transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
                  {item.price}
                </div>
              </div>

              {/* Image Container with Gradient Overlay */}
              <div className="relative h-56 rounded-t-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                {/* Minimum Order Badge removed */}
              </div>

              {/* Content Container */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                  {item.name}
                </h3>
                <p className="text-black text-sm leading-relaxed mb-6">
                  {item.description}
                </p>
                {/* Action Button: Place Order */}
                <div className="flex gap-3">
                  <button
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    onClick={() => navigate('/productdetail', { state: { item } })}
                  >
                    Place Order
                  </button>
                </div>
              </div>

              {/* Stock Status Indicator */}
              {item.available && (
                <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-green-400 ring-4 ring-white"></div>
              )}
            </div>
          ))}
        </div>

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
