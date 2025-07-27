import React from 'react';

const specialItems = [
  {
    id: 1,
    title: "Boiled Potato Vada",
    description: "Crispy outside, soft inside potato patties seasoned with Indian spices",
    price: "₹40",
    preparationTime: "15 mins",
    spicyLevel: "Medium",
    image: "/vada.jpg", // You'll need to add this image
    tags: ["Snack", "Vegetarian"]
  },
  {
    id: 2,
    title: "Special Coconut Chutney",
    description: "Fresh coconut ground with green chilies, ginger and special herbs",
    price: "₹20",
    preparationTime: "10 mins",
    spicyLevel: "Adjustable",
    image: "/chutney.jpg", // You'll need to add this image
    tags: ["Side Dish", "Vegetarian"]
  },
  {
    id: 3,
    title: "Masala Mix",
    description: "Handcrafted blend of premium spices for authentic Indian flavors",
    price: "₹100",
    preparationTime: "Ready to use",
    spicyLevel: "Hot",
    image: "/masala.jpg", // You'll need to add this image
    tags: ["Spice Blend", "Pure"]
  }
];

function SpecialItemsSection() {
  return (
    <section className="py-16  to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Special <span className="text-orange-500">Preparations</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover our handcrafted delicacies and special preparations made with love and tradition
          </p>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2">
          {specialItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 min-h-[320px]"
            >
              {/* Category Tag (use first tag as category) */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 text-xs font-semibold">
                  {item.tags[0]}
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
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                {/* Preparation Time Badge */}
                <div className="absolute bottom-4 left-4 z-20 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-white text-xs">Prep: {item.preparationTime}</span>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-500 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-xs">
                    Order Now
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Explore All Special Items Button */}
        <div className="mt-16 text-center">
          <button
            onClick={() => window.location.href = '/all-items?sort=special'}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Explore All Special Items
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default SpecialItemsSection;
