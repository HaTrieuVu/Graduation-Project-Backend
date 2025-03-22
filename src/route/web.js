import express from "express";

import productController from "../controllers/productController";
import brandController from "../controllers/brandController";

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
    //api lấy ds sản phẩm theo nhãn hàng
    router.get("/product/brand/:id", brandController.getAllProductByBrand);

    return app.use("/api/v1", router);
};
module.exports = initWebRoutes;
