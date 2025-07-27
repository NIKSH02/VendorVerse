// =============================================================================
// API SERVICES INDEX
// =============================================================================
// Consolidated exports for all API service modules

// Individual API modules
import { authAPI } from "./authAPI";
import { profileAPI } from "./profileAPI";
import { productsAPI } from "./productsAPI";
import { ordersAPI } from "./ordersAPI";
import { reviewsAPI } from "./reviewsAPI";
import { notificationsAPI } from "./notificationsAPI";
import { samplesAPI } from "./samplesAPI";
import { materialRequestsAPI } from "./materialRequestsAPI";
import { negotiationsAPI } from "./negotiationsAPI";
import { analyticsAPI } from "./analyticsAPI";

// Export individual modules
export {
  authAPI,
  profileAPI,
  productsAPI,
  ordersAPI,
  reviewsAPI,
  notificationsAPI,
  samplesAPI,
  materialRequestsAPI,
  negotiationsAPI,
  analyticsAPI,
};

// Consolidated API object for easy access
const api = {
  auth: authAPI,
  profile: profileAPI,
  products: productsAPI,
  orders: ordersAPI,
  reviews: reviewsAPI,
  notifications: notificationsAPI,
  samples: samplesAPI,
  materialRequests: materialRequestsAPI,
  negotiations: negotiationsAPI,
  analytics: analyticsAPI,
};

export default api;

// =============================================================================
// USAGE EXAMPLES:
// =============================================================================

/*
// Option 1: Import individual API modules
import { authAPI, ordersAPI } from '../services/api';
const user = await authAPI.login(credentials);
const orders = await ordersAPI.getBuyerOrderHistory();

// Option 2: Import consolidated API object
import api from '../services/api';
const user = await api.auth.login(credentials);
const orders = await api.orders.getBuyerOrderHistory();

// Option 3: Import specific functionality
import { authAPI } from '../services/api';
const { login, register, logout } = authAPI;

// Option 4: Import everything
import api, { 
  authAPI, 
  ordersAPI, 
  reviewsAPI, 
  notificationsAPI 
} from '../services/api';
*/
