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
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(0,0,0,0.25)" }}
    >
      <div
        className="rounded-2xl shadow-xl p-8 w-full max-w-sm"
        style={{ background: "#fff" }}
      >
        <h2 className="text-2xl font-bold mb-2" style={{ color: "#000" }}>
          Welcome!
        </h2>
        <p className="mb-6 text-base" style={{ color: "#555" }}>
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
          <span className="mx-2 text-xs text-[#555]">or</span>
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
