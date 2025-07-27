// Location service for fetching coordinates and location data

const locationService = {
  // Fetch coordinates from city name using OpenStreetMap Nominatim API
  getCityCoordinates: async (cityName, state = "", country = "India") => {
    try {
      const query = `${cityName}${state ? ", " + state : ""}${
        country ? ", " + country : ""
      }`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=1&countrycodes=in`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch location data");
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const location = data[0];
        return {
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lon),
          displayName: location.display_name,
          city: cityName,
          state:
            state || this.extractStateFromDisplayName(location.display_name),
          country: country,
          success: true,
        };
      } else {
        return {
          success: false,
          error: "City not found",
        };
      }
    } catch (error) {
      console.error("Error fetching city coordinates:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch location data",
      };
    }
  },

  // Extract state from display name
  extractStateFromDisplayName: (displayName) => {
    if (!displayName) return "";

    // Split by comma and try to find the state part
    const parts = displayName.split(",").map((part) => part.trim());

    // For Indian locations, state is usually the second last part before country
    if (parts.length >= 3) {
      return parts[parts.length - 2]; // Second last part (before country)
    }

    return "";
  },

  // Get current user location using browser geolocation
  getCurrentLocation: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            success: true,
          });
        },
        (error) => {
          let errorMessage = "Failed to get location";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied by user";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out";
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  },

  // Reverse geocoding - get address from coordinates
  getAddressFromCoordinates: async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch address data");
      }

      const data = await response.json();

      if (data && data.address) {
        const address = data.address;
        return {
          city:
            address.city ||
            address.town ||
            address.village ||
            address.suburb ||
            "",
          state: address.state || "",
          country: address.country || "India",
          pincode: address.postcode || "",
          street: this.formatStreetAddress(address),
          displayName: data.display_name,
          success: true,
        };
      } else {
        return {
          success: false,
          error: "Address not found",
        };
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch address data",
      };
    }
  },

  // Format street address from address components
  formatStreetAddress: (address) => {
    const streetParts = [];

    if (address.house_number) streetParts.push(address.house_number);
    if (address.road) streetParts.push(address.road);
    if (address.suburb && address.suburb !== address.city)
      streetParts.push(address.suburb);

    return streetParts.join(", ") || "";
  },

  // Validate Indian city names
  validateIndianCity: (cityName) => {
    if (!cityName || cityName.trim().length < 2) {
      return {
        valid: false,
        error: "City name must be at least 2 characters long",
      };
    }

    // Basic validation for Indian city names
    const validPattern = /^[a-zA-Z\s\-'.]+$/;
    if (!validPattern.test(cityName.trim())) {
      return {
        valid: false,
        error: "City name contains invalid characters",
      };
    }

    return {
      valid: true,
    };
  },

  // Format location data for database storage
  formatLocationForDB: (locationData) => {
    return {
      street: locationData.street || "",
      city: locationData.city || "",
      state: locationData.state || "",
      pincode: locationData.pincode || "",
      geolocation: {
        lat: locationData.lat || 0,
        lng: locationData.lng || 0,
      },
    };
  },
};

export default locationService;
