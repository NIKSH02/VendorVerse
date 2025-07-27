import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-16 px-4 flex flex-col items-center justify-center">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About <span className="text-orange-500">StreetSupply</span></h1>
          <p className="text-lg text-gray-700 mb-8">
            StreetSupply is your trusted marketplace for high-quality raw materials and special preparations, connecting local suppliers and buyers with ease. Our mission is to empower small businesses, restaurants, and home chefs by providing a seamless platform for sourcing the best ingredients and handcrafted delicacies.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div>
              <h2 className="text-2xl font-semibold text-orange-500 mb-2">Our Vision</h2>
              <p className="text-gray-600">
                To revolutionize the food supply chain by making it more transparent, accessible, and community-driven. We believe in supporting local farmers, artisans, and small-scale producers.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-orange-500 mb-2">Why Choose Us?</h2>
              <ul className="list-disc pl-5 text-gray-600">
                <li>Wide selection of fresh and authentic products</li>
                <li>Direct-from-supplier pricing</li>
                <li>Easy ordering and fast delivery</li>
                <li>Support for local communities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AboutPage;
