import express from "express";

import productController from "../controllers/productController";
import brandController from "../controllers/brandController";
import cartController from "../controllers/cartController";

let router = express.Router();

let initWebRoutes = (app) => {
    //----------------------------------- api Product ------------------------
    // api lấy ds sản phẩm
    router.get("/products/get-all", productController.fetchAllProduct);

    //api lấy thông tin chi tiết 1 sản phẩm
    router.get("/product-single", productController.getInfoProductSingle);

    //api search sản phẩm theo keyword
    router.get("/products/search", productController.searchAllProductByKeyword);

    //------------------------------- api Brand -------------------------------
    //api lấy ds nhãn hàng
    router.get("/brand/get-all", brandController.getAllProductByBrand);

    //api lấy ds sản phẩm theo nhãn hàng
    router.get("/product/brand/:id", brandController.getAllProductByBrand);

    //---------------------------------- api Cart -----------------------------
    //api thêm sản phẩm vào giỏ hàng
    router.post("/cart/add-to-cart", cartController.handleAddProductToCart);

    //api lấy tất cả sp trong giỏ hàng
    router.post("/cart/get-info-to-cart", cartController.getAllInfoToCart);

    // api tăng, giảm số lượng của sản phẩm trong giỏ hàng
    router.post("/cart/toggle-cart-quantity", cartController.handleToggleCartQuantity);

    // api xóa sản phẩm khỏi giỏ hàng
    router.post("/cart/remove-produt-from-cart", cartController.handleRemoveProductFromCart);

    return app.use("/api/v1", router);
};
module.exports = initWebRoutes;
