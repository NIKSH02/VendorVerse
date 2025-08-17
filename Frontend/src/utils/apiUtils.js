// API debugging utilities
export const logApiCall = (
  method,
  url,
  data = null,
  response = null,
  error = null
) => {
  if (import.meta.env.VITE_DEBUG === "true") {
    const timestamp = new Date().toISOString();

    console.group(`🔗 API Call - ${method.toUpperCase()} ${url}`);
    console.log(`⏰ Time: ${timestamp}`);

    if (data) {
      console.log(`📤 Request Data:`, data);
    }

    if (response) {
      console.log(`📥 Response Status: ${response.status}`);
      console.log(`📥 Response Data:`, response.data);

      // Highlight 304 responses
      if (response.status === 304) {
        console.warn(`🔄 Status 304: Resource not modified (cached response)`);
      }
    }

    if (error) {
      console.error(`❌ Error:`, error);
      if (error.response) {
        console.error(`❌ Error Status: ${error.response.status}`);
        console.error(`❌ Error Data:`, error.response.data);
      }
    }

    console.groupEnd();
  }
};

export const handleApiError = (error, defaultMessage = "An error occurred") => {
  let errorMessage = defaultMessage;

  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;

    switch (status) {
      case 304:
        console.info("Resource not modified - using cached version");
        return null; // 304 is not really an error
      case 400:
        errorMessage = data?.message || "Bad request";
        break;
      case 401:
        errorMessage = "Unauthorized. Please login again.";
        break;
      case 403:
        errorMessage = "Access forbidden";
        break;
      case 404:
        errorMessage = "Resource not found";
        break;
      case 429:
        errorMessage = "Too many requests. Please try again later.";
        break;
      case 500:
        errorMessage = "Server error. Please try again later.";
        break;
      default:
        errorMessage = data?.message || `Error ${status}: ${defaultMessage}`;
    }
  } else if (error.request) {
    // Network error
    errorMessage = "Network error. Please check your connection.";
  } else {
    // Other error
    errorMessage = error.message || defaultMessage;
  }

  console.error("API Error:", errorMessage);
  return errorMessage;
};

export const isSuccessResponse = (response) => {
  return response && response.status >= 200 && response.status < 300;
};

export const isCachedResponse = (response) => {
  return response && response.status === 304;
};
