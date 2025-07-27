const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductsByType,
  getProductsBySupplier,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
  toggleProductStatus,
  uploadImages,
} = require("../controllers/SupplierListing.controller");
const auth = require("../middlewares/auth.middleware"); // Assuming you have auth middleware

// Public routes
router.get("/", getAllProducts);
router.get("/type/:type", getProductsByType); // /raw, /half-baked, /complete
router.get("/supplier/:supplierId", getProductsBySupplier); // Get products by supplier
router.get("/:id", getProductById);

// Protected routes (require authentication)
router.use(auth); // Apply auth middleware to all routes below

// Middleware to ensure user.id compatibility
router.use((req, res, next) => {
  if (req.user && req.user._id && !req.user.id) {
    req.user.id = req.user._id;
  }
  next();
});

router.post("/", createProduct); // Use express-fileupload instead of multer
router.post("/upload-images", uploadImages); // New endpoint for multiple image upload
router.get("/user/my-products", getMyProducts);
router.put("/:id", updateProduct); // Use express-fileupload instead of multer
router.patch("/:id/toggle-status", toggleProductStatus);
router.delete("/:id", deleteProduct);

module.exports = router;
