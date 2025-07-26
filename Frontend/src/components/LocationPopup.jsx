import React, { useState } from "react";

export default function LocationPopup({ onLocationSet }) {
  const [show, setShow] = useState(true);
  const [manualLocation, setManualLocation] = useState("");
  const [error, setError] = useState("");

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setShow(false);
        onLocationSet({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          type: "current",
        });
      },
      () => setError("Unable to retrieve your location.")
    );
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualLocation.trim()) {
      setError("Please enter a location.");
      return;
    }
    setShow(false);
    onLocationSet({ location: manualLocation, type: "manual" });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay for blur only, no dark background */}
      <div className="absolute inset-0 backdrop-blur-sm" />
      <div
        className="relative rounded-2xl shadow-xl p-8 w-full max-w-sm z-10"
        style={{ background: "#121214" }}
      >
        <h2 className="text-2xl font-bold mb-2" style={{ color: "white" }}>
          Welcome!
        </h2>
        <p className="mb-6 text-base" style={{ color: "white" }}>
          Please provide your location to continue.
        </p>
        <button
          onClick={handleUseCurrentLocation}
          className="w-full py-3 rounded-lg font-semibold mb-4"
          style={{
            background: "#ff9500",
            color: "#fff",
            fontWeight: 600,
            fontSize: "1rem",
            marginBottom: "1rem",
          }}
        >
          Use Current Location
        </button>
        <div className="flex items-center my-3">
          <div className="flex-1 h-px bg-[#f5f5f5]" />
          <span className="mx-2 text-xs text-[white]">or</span>
          <div className="flex-1 h-px bg-[#f5f5f5]" />
        </div>
        <form onSubmit={handleManualSubmit}>
          <input
            type="text"
            placeholder="Enter your city or area"
            value={manualLocation}
            onChange={(e) => {
              setManualLocation(e.target.value);
              setError("");
            }}
            className="w-full px-4 py-2 border border-[#f5f5f5] rounded-lg mb-2 focus:outline-none focus:border-[#ff9500] text-[#000] bg-[#f5f5f5]"
            style={{ background: "#f5f5f5", color: "#000" }}
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold"
            style={{
              background: "#ff9500",
              color: "#fff",
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            Submit Location
          </button>
        </form>
        {error && (
          <div className="mt-3 text-sm text-red-600 text-center">{error}</div>
        )}
      </div>
    </div>
  );
}
