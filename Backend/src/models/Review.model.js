const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    sampleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sample",
    },
    reviewType: {
      type: String,
      enum: ["order", "sample"],
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    categories: {
      quality: {
        type: Number,
        min: 1,
        max: 5,
      },
      delivery: {
        type: Number,
        min: 1,
        max: 5,
      },
      communication: {
        type: Number,
        min: 1,
        max: 5,
      },
      value: {
        type: Number,
        min: 1,
        max: 5,
      },
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    isHelpful: {
      helpfulCount: {
        type: Number,
        default: 0,
      },
      notHelpfulCount: {
        type: Number,
        default: 0,
      },
    },
    response: {
      message: String,
      timestamp: Date,
    },
  },
  { timestamps: true }
);

// Proper compound indexes to prevent duplicate reviews
// For order reviews: one review per user per order (only when orderId exists)
ReviewSchema.index(
  { fromUserId: 1, orderId: 1 },
  {
    unique: true,
    partialFilterExpression: { orderId: { $type: "objectId" } },
  }
);

// For sample reviews: one review per user per sample (only when sampleId exists)
ReviewSchema.index(
  { fromUserId: 1, sampleId: 1 },
  {
    unique: true,
    partialFilterExpression: { sampleId: { $type: "objectId" } },
  }
);

// Indexes for efficient queries
ReviewSchema.index({ toUserId: 1, rating: -1, createdAt: -1 });
ReviewSchema.index({ reviewType: 1, isVerified: 1 });

// Validation: must have either orderId or sampleId, not both
ReviewSchema.pre("validate", function (next) {
  if ((this.orderId && this.sampleId) || (!this.orderId && !this.sampleId)) {
    next(
      new Error("Review must have either orderId or sampleId, but not both")
    );
  } else {
    next();
  }
});

// Post-save middleware to update user rating
ReviewSchema.post("save", async function () {
  const User = mongoose.model("User");

  // Calculate new average rating for the reviewed user
  const reviews = await this.constructor.find({
    toUserId: this.toUserId,
    isVerified: true,
  });
  const avgRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  // Update user's rating and trust score
  await User.findByIdAndUpdate(this.toUserId, {
    rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal place
    $inc: { trustScore: this.reviewType === "sample" ? 2 : 1 }, // Samples give more trust points
  });

  // If this is a sample review, mark the sample as reviewed
  if (this.sampleId) {
    const Sample = mongoose.model("Sample");
    await Sample.findByIdAndUpdate(this.sampleId, {
      isReviewed: true,
      reviewId: this._id,
      status: "reviewed",
    });
  }
});

module.exports = mongoose.model("Review", ReviewSchema);
