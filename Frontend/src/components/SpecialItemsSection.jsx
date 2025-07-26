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
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-orange-600/20 z-10" />
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-md">
                  <span className="text-orange-500 font-bold">{item.price}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Tags */}
                <div className="flex gap-2 mb-3">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs font-medium bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-200 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title and Description */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {item.description}
                </p>

                {/* Details */}
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {item.preparationTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                    {item.spicyLevel}
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl
                                 hover:from-orange-600 hover:to-orange-700 transition-all duration-300
                                 shadow-lg hover:shadow-xl font-semibold">
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SpecialItemsSection;
