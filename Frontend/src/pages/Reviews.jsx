import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../layouts/DashboardLayout";
import { Star, Plus, User, Filter, Edit, Trash2 } from "lucide-react";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scaleOnHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
};

const Reviews = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      product: "Fresh Tomatoes",
      supplier: "Green Valley Farm",
      rating: 5,
      comment:
        "Excellent quality tomatoes. Fresh and delivered on time. Highly recommend!",
      date: "2024-01-10",
    },
    {
      id: 2,
      product: "Wheat Seeds",
      supplier: "Seeds Co.",
      rating: 4,
      comment: "Good quality seeds, packaging was secure.",
      date: "2024-01-08",
    },
  ]);

  const [filterRating, setFilterRating] = useState("all");
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    product: "",
    supplier: "",
    rating: 5,
    comment: "",
  });

  const [editingReview, setEditingReview] = useState(null);

  const filteredReviews = reviews.filter((review) => {
    if (filterRating === "all") return true;
    return review.rating >= parseInt(filterRating);
  });

  const handleAddReview = () => {
    if (newReview.product && newReview.supplier && newReview.comment) {
      setReviews([
        ...reviews,
        {
          ...newReview,
          id: Date.now(),
          date: new Date().toISOString().split("T")[0],
        },
      ]);
      setNewReview({ product: "", supplier: "", rating: 5, comment: "" });
      setShowAddReview(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setNewReview(review);
    setShowAddReview(true);
  };

  const handleUpdateReview = () => {
    setReviews(
      reviews.map((review) =>
        review.id === editingReview.id ? { ...newReview } : review
      )
    );
    setEditingReview(null);
    setNewReview({ product: "", supplier: "", rating: 5, comment: "" });
    setShowAddReview(false);
  };

  const handleDeleteReview = (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      setReviews(reviews.filter((review) => review.id !== id));
    }
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            className={`${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            } ${interactive ? "hover:text-yellow-400 cursor-pointer" : ""}`}
            onClick={() => interactive && onChange && onChange(star)}
            whileHover={interactive ? { scale: 1.2 } : {}}
            whileTap={interactive ? { scale: 0.9 } : {}}
            disabled={!interactive}
          >
            <Star size={20} fill="currentColor" />
          </motion.button>
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <motion.div
        className="space-y-6"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center">
          <motion.h1
            className="text-2xl font-bold text-gray-800"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            My Reviews
          </motion.h1>

          <motion.button
            className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
            onClick={() => setShowAddReview(true)}
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={16} />
            <span>Add Review</span>
          </motion.button>
        </div>

        {/* Filter Controls */}
        <motion.div
          className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-gray-200"
          variants={fadeInUp}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Filter by rating:
            </span>
          </div>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Reviews</option>
            <option value="5">5 Stars</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="1">1+ Stars</option>
          </select>
        </motion.div>

        {/* Reviews List */}
        <motion.div
          className="space-y-4"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
              {...scaleOnHover}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {review.product}
                  </h3>
                  <p className="text-gray-600 flex items-center">
                    <User size={14} className="mr-1" />
                    {review.supplier}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => handleEditReview(review)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit size={16} />
                  </motion.button>
                  <motion.button
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    onClick={() => handleDeleteReview(review.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              </div>

              <div className="mb-3">{renderStars(review.rating)}</div>

              <p className="text-gray-700 mb-4">{review.comment}</p>

              <p className="text-sm text-gray-500">
                Reviewed on: {review.date}
              </p>
            </motion.div>
          ))}

          {filteredReviews.length === 0 && (
            <motion.div
              className="text-center py-12 bg-white rounded-lg border border-gray-200"
              variants={fadeInUp}
            >
              <Star size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">
                {filterRating === "all"
                  ? "No reviews yet. Add your first review!"
                  : "No reviews found for the selected rating."}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Add/Edit Review Modal */}
        <AnimatePresence>
          {showAddReview && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {editingReview ? "Edit Review" : "Add New Review"}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={newReview.product}
                      onChange={(e) =>
                        setNewReview({ ...newReview, product: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Supplier Name
                    </label>
                    <input
                      type="text"
                      value={newReview.supplier}
                      onChange={(e) =>
                        setNewReview({ ...newReview, supplier: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter supplier name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating
                    </label>
                    {renderStars(newReview.rating, true, (rating) =>
                      setNewReview({ ...newReview, rating })
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Review
                    </label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) =>
                        setNewReview({ ...newReview, comment: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                      rows="4"
                      placeholder="Share your experience..."
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <motion.button
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                    onClick={
                      editingReview ? handleUpdateReview : handleAddReview
                    }
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {editingReview ? "Update Review" : "Add Review"}
                  </motion.button>
                  <motion.button
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setShowAddReview(false);
                      setEditingReview(null);
                      setNewReview({
                        product: "",
                        supplier: "",
                        rating: 5,
                        comment: "",
                      });
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  );
};

export default Reviews;
