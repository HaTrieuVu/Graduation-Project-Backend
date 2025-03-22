import express from "express";

import productController from "../controllers/productController";

let router = express.Router();

let initWebRoutes = (app) => {
    //----------------------------------- api Product ------------------------
    // api lấy ds sản phẩm
    router.get("/products/get-all", productController.fetchAllProduct);

    //api lấy thông tin chi tiết 1 sản phẩm
    router.get("/product-single", productController.getInfoProductSingle);

    return app.use("/api/v1", router);
};
module.exports = initWebRoutes;
