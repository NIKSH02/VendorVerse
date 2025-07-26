import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-orange-100 via-amber-50 to-orange-50 min-h-screen flex items-center py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            {/* Tagline */}
            <div className="inline-block bg-orange-200 text-orange-800 px-4 py-2 rounded-full text-sm font-medium shadow-md border border-orange-300">
              India's Local Supply Chain, Simplified.
            </div>
            
            {/* Main Headline */}
            <h1 className="text-5xl lg:text-6xl font-bold text-black leading-tight drop-shadow-sm">
              Connecting Food
              <br />
              Vendors with
              <br />
              <span className="text-orange-500">Trusted Suppliers</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl text-gray-800 leading-relaxed max-w-lg">
              Discover affordable raw materials near you. Order in bulk, request supplies, or join group-buying—straight from your screen.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex gap-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center shadow-lg">
                <ArrowRight className="w-5 h-5 mr-2" />
                Get Started
              </button>
              
              <button className="border-2 border-orange-400 text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center shadow-md">
                <Play className="w-5 h-5 mr-2" />
                How It Works
              </button>
            </div>
            
            {/* Stats */}
            <div className="flex gap-12 pt-8">
              <div>
                <div className="text-4xl font-bold text-black">500+</div>
                <div className="text-gray-700 font-medium">Active Vendors</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-black">200+</div>
                <div className="text-gray-700 font-medium">Suppliers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-black">50+</div>
                <div className="text-gray-700 font-medium">Cities</div>
              </div>
            </div>
          </div>
          
          {/* Right Illustration - Marketplace Scene */}
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl p-6 border-2 border-orange-100">
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <svg viewBox="0 0 400 300" className="w-full h-full">
                  {/* Sky gradient background */}
                  <defs>
                    <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="50%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#ea580c" />
                    </linearGradient>
                    <linearGradient id="tentGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#1e40af" />
                      <stop offset="100%" stopColor="#1e3a8a" />
                    </linearGradient>
                  </defs>
                  
                  {/* Background */}
                  <rect width="400" height="300" fill="url(#skyGradient)" />
                  
                  {/* Market tent/canopy */}
                  <path d="M 50 80 Q 200 40 350 80 L 350 120 Q 200 60 50 120 Z" fill="url(#tentGradient)" opacity="0.8" />
                  <path d="M 70 100 Q 200 60 330 100 L 330 140 Q 200 80 70 140 Z" fill="#f97316" opacity="0.9" />
                  
                  {/* Ground/floor */}
                  <rect x="0" y="200" width="400" height="100" fill="#d97706" opacity="0.3" />
                  
                  {/* Vegetable and fruit stalls */}
                  {/* Left stall - vegetables */}
                  <rect x="60" y="180" width="80" height="40" fill="#065f46" rx="4" />
                  <rect x="65" y="160" width="15" height="20" fill="#10b981" rx="3" />
                  <rect x="85" y="160" width="15" height="20" fill="#059669" rx="3" />
                  <rect x="105" y="160" width="15" height="20" fill="#047857" rx="3" />
                  <rect x="125" y="160" width="15" height="20" fill="#065f46" rx="3" />
                  
                  {/* Center stall - fruits */}
                  <rect x="160" y="180" width="80" height="40" fill="#92400e" rx="4" />
                  <circle cx="175" cy="170" r="8" fill="#f59e0b" />
                  <circle cx="195" cy="170" r="8" fill="#d97706" />
                  <circle cx="215" cy="170" r="8" fill="#b45309" />
                  <circle cx="185" cy="155" r="8" fill="#fbbf24" />
                  <circle cx="205" cy="155" r="8" fill="#f59e0b" />
                  
                  {/* Right stall - spices */}
                  <rect x="260" y="180" width="80" height="40" fill="#7c2d12" rx="4" />
                  <rect x="265" y="165" width="12" height="15" fill="#dc2626" rx="2" />
                  <rect x="280" y="165" width="12" height="15" fill="#ea580c" rx="2" />
                  <rect x="295" y="165" width="12" height="15" fill="#f97316" rx="2" />
                  <rect x="310" y="165" width="12" height="15" fill="#fbbf24" rx="2" />
                  <rect x="325" y="165" width="12" height="15" fill="#84cc16" rx="2" />
                  
                  {/* People figures */}
                  {/* Vendor 1 */}
                  <circle cx="100" cy="190" r="6" fill="#92400e" />
                  <rect x="96" y="196" width="8" height="20" fill="#dc2626" rx="2" />
                  
                  {/* Customer 1 */}
                  <circle cx="130" cy="200" r="5" fill="#7c2d12" />
                  <rect x="127" y="205" width="6" height="15" fill="#059669" rx="2" />
                  
                  {/* Vendor 2 */}
                  <circle cx="200" cy="190" r="6" fill="#92400e" />
                  <rect x="196" y="196" width="8" height="20" fill="#7c2d12" rx="2" />
                  
                  {/* Customer 2 - woman in sari */}
                  <circle cx="230" cy="200" r="5" fill="#7c2d12" />
                  <rect x="227" y="205" width="6" height="15" fill="#dc2626" rx="2" />
                  
                  {/* Vendor 3 */}
                  <circle cx="300" cy="190" r="6" fill="#92400e" />
                  <rect x="296" y="196" width="8" height="20" fill="#065f46" rx="2" />
                  
                  {/* Customer 3 */}
                  <circle cx="320" cy="200" r="5" fill="#7c2d12" />
                  <rect x="317" y="205" width="6" height="15" fill="#1e40af" rx="2" />
                  
                  {/* Baskets and containers */}
                  <ellipse cx="80" cy="210" rx="12" ry="6" fill="#92400e" />
                  <ellipse cx="180" cy="210" rx="12" ry="6" fill="#92400e" />
                  <ellipse cx="280" cy="210" rx="12" ry="6" fill="#92400e" />
                  
                  {/* Hanging decorative elements */}
                  <circle cx="120" cy="130" r="3" fill="#fbbf24" />
                  <circle cx="140" cy="125" r="3" fill="#f59e0b" />
                  <circle cx="160" cy="130" r="3" fill="#dc2626" />
                  <circle cx="180" cy="125" r="3" fill="#10b981" />
                  <circle cx="200" cy="130" r="3" fill="#fbbf24" />
                  <circle cx="220" cy="125" r="3" fill="#dc2626" />
                  <circle cx="240" cy="130" r="3" fill="#059669" />
                  <circle cx="260" cy="125" r="3" fill="#f59e0b" />
                  <circle cx="280" cy="130" r="3" fill="#10b981" />
                  
                  {/* Connection lines (subtle) */}
                  <path d="M100 190 Q200 150 300 190" stroke="#f97316" strokeWidth="2" fill="none" strokeDasharray="3,3" opacity="0.4" />
                </svg>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
