import React, { useState } from 'react';

// Extended list of items (you can add more)
const allItems = [
  {
    id: 1,
    name: 'Fresh Potatoes',
    image: '/potato.jpg',
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
  },
  // Add more items here...
  {
    id: 7,
    name: 'Garlic Bulbs',
    image: '/garlic.jpg',
    description: 'Fresh garlic bulbs with intense flavor',
    price: '₹80/kg',
    minOrder: '2 kg',
    available: true,
    category: 'Vegetables'
  },
  {
    id: 8,
    name: 'Turmeric Powder',
    image: '/turmeric.jpg',
    description: 'Pure ground turmeric with rich color and aroma',
    price: '₹200/kg',
    minOrder: '1 kg',
    available: true,
    category: 'Spices'
  }
];

const categories = ['All Items', 'Vegetables', 'Spices', 'Grains'];

function AllItemsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and sort items
  const filteredItems = allItems
    .filter(item => {
      const matchesCategory = selectedCategory === 'All Items' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price') {
        return parseInt(a.price.replace(/[^0-9]/g, '')) - parseInt(b.price.replace(/[^0-9]/g, ''));
      }
      return a[sortBy].localeCompare(b[sortBy]);
    });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            All Available <span className="text-orange-500">Items</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Browse our complete collection of high-quality ingredients
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex gap-4 items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="category">Sort by Category</option>
            </select>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
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
              <div className="relative h-56 rounded-t-2xl overflow-hidden">
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
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-500 transition-colors">
                  {item.name}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                    Quick Order
                  </button>
                  <button className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      </div>
    </div>
  );
}

export default AllItemsPage;
