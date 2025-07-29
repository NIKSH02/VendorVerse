import React, { createContext, useContext, useState, useEffect } from "react";
import { ordersAPI } from "../services/ordersAPI";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

// Create Order Context
const OrderContext = createContext();

// Custom hook to use Order Context
export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};

// Order Provider Component
export const OrderProvider = ({ children }) => {
  const { user } = useAuth();
  const [buyerOrders, setBuyerOrders] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [reviewableOrders, setReviewableOrders] = useState([]);
  const [financialSummary, setFinancialSummary] = useState({
    totalExpenditure: 0,
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch buyer orders (orders user has placed)
  const fetchBuyerOrders = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await ordersAPI.getBuyerOrderHistory(filters);
      setBuyerOrders(response.data.orders || []);
      return response.data;
    } catch (error) {
      setError(error.message);
      toast.error("Failed to fetch your orders");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch seller orders (orders user needs to fulfill)
  const fetchSellerOrders = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await ordersAPI.getSellerOrders(filters);
      setSellerOrders(response.data.orders || []);
      return response.data;
    } catch (error) {
      setError(error.message);
      toast.error("Failed to fetch received orders");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviewable orders
  const fetchReviewableOrders = async () => {
    try {
      const response = await ordersAPI.getReviewableOrders();
      setReviewableOrders(response.data || []);
      return response.data;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Fetch financial summary
  const fetchFinancialSummary = async () => {
    try {
      const response = await ordersAPI.getFinancialSummary();
      setFinancialSummary(
        response.data || {
          totalExpenditure: 0,
          totalRevenue: 0,
          totalOrders: 0,
          pendingOrders: 0,
        }
      );
      return response.data;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Place a new order
  const placeOrder = async (orderData) => {
    try {
      setLoading(true);
      const response = await ordersAPI.placeOrder(orderData);

      // Update local state by refetching data
      await Promise.all([fetchBuyerOrders(), fetchFinancialSummary()]);

      toast.success("Order placed successfully!");
      return response.data;
    } catch (error) {
      setError(error.message);
      toast.error("Failed to place order");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update order status (seller actions)
  const updateOrderStatus = async (orderId, action, notes = "") => {
    try {
      setLoading(true);
      const response = await ordersAPI.updateOrderStatus(orderId, {
        action,
        notes,
      });

      // Update local state by refetching data
      await Promise.all([
        fetchSellerOrders(),
        fetchBuyerOrders(),
        fetchFinancialSummary(),
      ]);

      toast.success(`Order ${action}ed successfully!`);
      return response.data;
    } catch (error) {
      setError(error.message);
      toast.error(`Failed to ${action} order`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get exchange code
  const getExchangeCode = async (orderId) => {
    try {
      const response = await ordersAPI.getExchangeCode(orderId);
      return response.data;
    } catch (error) {
      setError(error.message);
      toast.error("Failed to get exchange code");
      throw error;
    }
  };

  // Get order details
  const getOrderDetails = async (orderId) => {
    try {
      const response = await ordersAPI.getOrderDetails(orderId);
      return response.data;
    } catch (error) {
      setError(error.message);
      toast.error("Failed to get order details");
      throw error;
    }
  };

  // Initialize data when user is available
  useEffect(() => {
    if (user) {
      fetchBuyerOrders();
      fetchFinancialSummary();
      fetchReviewableOrders();
      fetchSellerOrders(); // Fetch seller orders for all users
    }
  }, [user]);

  // Context value
  const contextValue = {
    // State
    buyerOrders,
    sellerOrders,
    reviewableOrders,
    financialSummary,
    loading,
    error,

    // Actions
    fetchBuyerOrders,
    fetchSellerOrders,
    fetchReviewableOrders,
    fetchFinancialSummary,
    placeOrder,
    updateOrderStatus,
    getExchangeCode,
    getOrderDetails,

    // Utility functions
    clearError: () => setError(null),
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;
