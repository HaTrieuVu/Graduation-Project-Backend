import express from "express";

import userController from "../controllers/userController";
import productController from "../controllers/productController";
import brandController from "../controllers/brandController";
import cartController from "../controllers/cartController";
import orderController from "../controllers/orderController";
import notificationController from "../controllers/notificationController";
import paymentController from "../controllers/paymentController";

let router = express.Router();

let initWebRoutes = (app) => {
    //----------------------------------- api User------------------------------
    //api lấy thông tin của 1 người dùng
    router.get("/user/get-info", userController.getUserInfo);

    //----------------------------------- api Product ------------------------
    // api lấy ds sản phẩm
    router.get("/products/get-all", productController.fetchAllProduct);

    //api lấy thông tin chi tiết 1 sản phẩm
    router.get("/product-single", productController.getInfoProductSingle);

    //api search sản phẩm theo keyword
    router.get("/products/search", productController.searchAllProductByKeyword);

    //------------------------------- api Brand -------------------------------
    //api lấy ds nhãn hàng
    // router.get("/brand/get-all", brandController.getAllProductByBrand);

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

    //---------------------------------- api Order -----------------------------
    // api đặt hàng
    router.post("/order/order-product", orderController.handleOrderProduct);

    //---------------------------------- api Notification -----------------------------
    // api lấy thông báo của người dùng (tb của đơn đặt hàng)
    router.get("/notification/get-info", notificationController.getNotification);

    // api xóa thông báo của người dùng
    router.delete("/notification/delete-notify", notificationController.deleteNotification);

    //----------------------------------- api payment------------------------------
    //-----------ZaloPay
    // hàm tạo ra dường link để thanh toán với zalopay
    router.post("/payment-zalo-pay/order", paymentController.paymentOrderZalopay);

    // hàm khi thanh toán thành công
    router.post("/payment-zalo-pay/callback-success", paymentController.paymentZaloPayCallBackSuccess);

    // hàm kiểm trạng thái thành toán của đơn hàng
    router.post("/payment-zalo-pay/check-status", paymentController.paymentZaloPayCheckStatus);

    //-----------MoMo
    // hàm tạo ra dường link để thanh toán với momo
    router.post("/payment-momo/order", paymentController.paymentOrderMoMo);

    // hàm khi thanh toán thành công
    router.post("/payment-momo/callback-success", paymentController.paymentMoMoCallBackSuccess);

    // hàm kiểm trạng thái thành toán của đơn hàng
    router.post("/payment-momo/check-status", paymentController.paymentMoMoCheckStatus);

    //-----------VnPay
    // hàm tạo ra dường link để thanh toán với VnPay
    router.post("/payment-vnpay/order", paymentController.paymentOrderVnPay);

    // hàm kiểm trạng thái thành toán của đơn hàng
    router.post("/payment-vnpay/check-status", paymentController.paymentVnPayCheckStatus);

    return app.use("/api/v1", router);
};
module.exports = initWebRoutes;
