import React from 'react';

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
  return (
    <section className="w-full py-16 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Raw Items <span className="text-orange-500">Marketplace</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
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
              className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 min-h-[320px]"
            >
              {/* Category Tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 text-xs font-semibold">
                  {item.category}
                </span>
              </div>

              {/* Floating Price Tag */}
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg font-bold transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
                  {item.price}
                </div>
              </div>

              {/* Image Container with Gradient Overlay */}
              <div className="relative h-36 rounded-t-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                {/* Minimum Order Badge */}
                <div className="absolute bottom-4 left-4 z-20 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-white text-xs">Min: {item.minOrder}</span>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-500 transition-colors">
                  {item.name}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-xs">
                    Quick Order
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Stock Status Indicator */}
              {item.available && (
                <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-green-400 dark:bg-green-500 ring-4 ring-white dark:ring-gray-900"></div>
              )}
            </div>
          ))}
        </div>

        {/* Explore All Items Button */}
        <div className="mt-16 text-center">
          <a 
            href="/all-items" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Explore All Items
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

export default RawItemsSection;
