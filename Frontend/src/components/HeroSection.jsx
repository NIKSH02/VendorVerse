import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ChatBox from "./ChatBox";


function HeroSection() {
  return (
    <section className="relative w-full min-h-screen bg-white px-6 pt-10 pb-4 flex justify-center items-center overflow-hidden">
      {/* Background Asian Market Image */}
      <img
        src="/asian-market-booth-vendor-buyers-isolated-white-background-indian-street-souk-kiosk-spices-local-outdoor-bazaar-vector-200378147.webp"
        alt="Asian Market"
        className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none z-0"
        style={{ objectPosition: 'center' }}
      />

      <div className="relative z-10 max-w-5xl w-full flex flex-col lg:flex-row items-center justify-center gap-12 py-16">
        {/* LEFT: Farmer Image */}
        <div className="flex flex-col items-center lg:items-start justify-center lg:w-1/2">
          <img
            src="/farmer.png"
            alt="Farmer"
            className="w-48 sm:w-64 object-contain mb-6 lg:mb-0"
          />
        </div>

        {/* RIGHT: Text and Chat Box */}
        <div className="flex flex-col items-center lg:items-start justify-center lg:w-1/2 w-full">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center lg:text-left text-black mb-2">
            Want to Become a Vendor?
          </h1>
          <p className="text-lg sm:text-2xl text-center lg:text-left text-gray-700 max-w-2xl mb-4">
            Start your journey as a vendor or launch your food startup with us!<br />
            Ask any questions about registration, requirements, or how to get started. Our AI Chat is here to help you every step of the way.
          </p>
          <div className="flex flex-col items-center w-full mt-4 lg:mt-8">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-xl border border-orange-200 h-[520px] flex flex-col justify-between mt-4">
              <div className="bg-orange-100 flex justify-between items-center px-6 py-3">
                <span className="bg-orange-400 text-white text-base font-bold px-3 py-1 rounded-full">
                  Vendor AI Chat
                </span>
                <span className="text-orange-500 text-2xl">⋮</span>
              </div>
              <div className="w-full h-[420px] flex items-center justify-center">
                <ChatBox />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
