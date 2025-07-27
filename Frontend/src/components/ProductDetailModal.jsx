import React from "react";
import { motion } from "framer-motion";
import Modal from "./Modal";
import {
  Package,
  MapPin,
  Calendar,
  DollarSign,
  Truck,
  Eye,
  MessageSquare,
  Tag,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const ProductDetailModal = ({ isOpen, onClose, product }) => {
  console.log("ProductDetailModal props:", {
    isOpen,
    onClose: !!onClose,
    product: !!product,
  });

  if (!product) {
    console.log("No product provided to ProductDetailModal");
    return null;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <div className="text-white">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {product.name}
              </h2>
              <div className="flex items-center space-x-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    product.status === "active"
                      ? "bg-green-500/20 text-green-400 border border-green-500/50"
                      : "bg-red-500/20 text-red-400 border border-red-500/50"
                  }`}
                >
                  {product.status === "active" ? (
                    <CheckCircle2 size={16} className="mr-1" />
                  ) : (
                    <XCircle size={16} className="mr-1" />
                  )}
                  {product.status === "active" ? "Active" : "Inactive"}
                </span>
                {product.type && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/50 capitalize">
                    <Tag size={16} className="mr-1" />
                    {product.type}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-orange-400">
                ₹{product.price}
              </div>
              <div className="text-gray-400">per {product.unit}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Image and Basic Info */}
          <div className="space-y-6">
            {/* Product Image */}
            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
              {product.image && product.image !== "/api/placeholder/150/150" ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div className="w-full h-full flex items-center justify-center">
                <Package size={64} className="text-gray-600" />
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">
                Description
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {product.description ||
                  "No description available for this product."}
              </p>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Product Details */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">
                Product Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 flex items-center">
                    <Package size={16} className="mr-2" />
                    Stock Available
                  </span>
                  <span className="text-white font-medium">
                    {product.stock} {product.unit}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 flex items-center">
                    <Tag size={16} className="mr-2" />
                    Category
                  </span>
                  <span className="text-white font-medium capitalize">
                    {product.category || "Uncategorized"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 flex items-center">
                    <Calendar size={16} className="mr-2" />
                    Date Added
                  </span>
                  <span className="text-white font-medium">
                    {product.dateAdded}
                  </span>
                </div>
                {product.location && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center">
                      <MapPin size={16} className="mr-2" />
                      Location
                    </span>
                    <span className="text-white font-medium">
                      {product.location}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">
                Delivery Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 flex items-center">
                    <Truck size={16} className="mr-2" />
                    Delivery Available
                  </span>
                  <span
                    className={`font-medium ${
                      product.deliveryAvailable
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {product.deliveryAvailable ? "Yes" : "No"}
                  </span>
                </div>
                {product.deliveryAvailable &&
                  product.deliveryFee !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 flex items-center">
                        <DollarSign size={16} className="mr-2" />
                        Delivery Fee
                      </span>
                      <span className="text-white font-medium">
                        {product.deliveryFee === 0
                          ? "Free"
                          : `₹${product.deliveryFee}`}
                      </span>
                    </div>
                  )}
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">
                Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Eye size={20} className="text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {product.views || 0}
                  </div>
                  <div className="text-sm text-gray-400">Views</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <MessageSquare size={20} className="text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {product.inquiries || 0}
                  </div>
                  <div className="text-sm text-gray-400">Inquiries</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Product ID: {product.id}
            </div>
            <div className="text-sm text-gray-400">
              Last updated: {product.dateAdded}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductDetailModal;
