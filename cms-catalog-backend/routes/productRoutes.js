const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.get("/product", productController.getAllproduct);
router.get("/product/:id", productController.getProductById);
router.delete(
  "/product/:id",
  authMiddleware,
  roleMiddleware("admin"),
  productController.deleteProduct
);
router.post(
  "/product",
  authMiddleware,
  roleMiddleware("admin"),
  productController.createProduct
);
router.put(
  "/product/:id",
  authMiddleware,
  roleMiddleware("admin"),
  productController.updateProduct
);

module.exports = router;
