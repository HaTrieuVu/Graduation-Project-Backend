import express from "express";

import useController from "../controllers/userController";
import productController from "../controllers/productController";
import supplierController from "../controllers/supplierController";
import brandController from "../controllers/brandController";
import categoryController from "../controllers/categoryController";
import orderController from "../controllers/orderController";
import roleController from "../controllers/roleController";
import importReceiptController from "../controllers/importReceiptController";
import warrantyController from "../controllers/warrantyController";

import { checkUserJWT, checkUserPermission } from "../middleware/JWTAction";

let router = express.Router();

let initApiRoutes = (app) => {
    router.all("*", checkUserJWT, checkUserPermission);

    //----------------------------------- api account ------------------------
    //api đăng ký tài khoản
    router.post("/register", useController.handleRegister);
    //api đăng nhập
    router.post("/login", useController.handleLogin);
    //api đăng nhập
    router.post("/logout", useController.handleLogout);
    //api lấy thông tin người dùng từ cookie
    router.get("/account", useController.getUserInfoAccount);

    //----------------------------------- api manage user (khách hàng) ------------------------
    //api lấy ds người dùng
    router.get("/user/get-all", useController.getAllUser);
    //api thêm mới người dùng
    router.post("/user/create", useController.createNewUser);
    //api cập nhật người dùng
    router.put("/user/update", useController.updateUser);
    //api xóa người dùng
    router.delete("/user/delete", useController.deleteUser);

    //----------------------------------- api manage employee (nv) ------------------------
    //api lấy ds nhân viên
    router.get("/employee/get-all", useController.getAllEmployee);
    //api thêm mới nhân viên
    router.post("/employee/create", useController.createNewEmployee);
    //api cập nhật nhân viên
    router.put("/employee/update", useController.updateEmployee);
    //api xóa nhân viên
    router.delete("/employee/delete", useController.deleteEmployee);

    //----------------------------------- api manage Product ------------------------
    // api lấy ds sản phẩm
    router.get("/manage-product/get-all", productController.getAllProduct);
    // api thêm mới sản phẩm
    router.post("/manage-product/create", productController.createNewProduct);
    // api cập nhật sản phẩm
    router.put("/manage-product/update", productController.updateProduct);
    //api xóa sản phẩm
    router.delete("/manage-product/delete", productController.deleteProduct);
    // api tìm kiếm sản phẩm
    router.get("/search-product", productController.searchProduct);

    //----------------------------------- api manage Product Version ------------------------
    // api lấy ds sản phẩm
    router.get("/manage-product-version/get-all", productController.getAllProductVersion);
    // api thêm mới sản phẩm
    router.post("/manage-product-version/create", productController.createNewProductVersion);
    // api cập nhật sản phẩm
    router.put("/manage-product-version/update", productController.updateProductVersion);
    //api xóa sản phẩm
    router.delete("/manage-product-version/delete", productController.deleteProductVersion);
    //apo lấy ds hình ảnh theo id sản phẩm
    router.get("/manage-product-version/get-all-image", productController.getAllImageOfProduct);

    //----------------------------------- api manage Product Image ------------------------
    // api lấy ds sản phẩm - hình ảnh
    router.get("/manage-product-image/get-all", productController.getAllProductImage);
    // api thêm mới sản phẩm - hình ảnh
    router.post("/manage-product-image/create", productController.createNewProductImage);
    // api cập nhật sản phẩm - hình ảnh
    router.put("/manage-product-image/update", productController.updateProductImage);
    //api xóa sản phẩm - hình ảnh
    router.delete("/manage-product-image/delete", productController.deleteProductImage);

    //----------------------------------- api manage Import Receipt ------------------------
    // api lấy ds đơn nhập hàng
    router.get("/manage-import-receipt/get-all", importReceiptController.getAllImportReceipt);
    // api thêm mới đơn nhập hàng
    router.post("/manage-import-receipt/create", importReceiptController.createNewImportReceipt);

    //----------------------------------- api manage Warranty ------------------------
    // api lấy ds phiếu nhập hành
    router.get("/manage-warranty/get-all", warrantyController.getAllWarranty);
    // api cập nhật phiếu nhập hành
    router.put("/manage-warranty/update", warrantyController.updateWarranty);

    //----------------------------------- api manage Supplier ------------------------
    // api lấy ds nhà cung cấp
    router.get("/manage-supplier/get-all", supplierController.getAllSupplier);
    // api thêm mới nhà cung cấp
    router.post("/manage-supplier/create", supplierController.createNewSupplier);
    // api cập nhật nhà cung cấp
    router.put("/manage-supplier/update", supplierController.updateSupplier);
    //api xóa nhà cung cấp
    router.delete("/manage-supplier/delete", supplierController.deleteSupplier);

    //----------------------------------- api manage Brand ------------------------
    // api lấy ds nhãn hàng
    router.get("/manage-brand/get-all", brandController.getAllBrand);
    // api thêm mới nhãn hàng
    router.post("/manage-brand/create", brandController.createNewBrand);
    // api cập nhật nhãn hàng
    router.put("/manage-brand/update", brandController.updateBrand);
    //api xóa nhãn hàng
    router.delete("/manage-brand/delete", brandController.deleteBrand);

    //----------------------------------- api manage Category ------------------------
    // api lấy ds danh mục sp
    router.get("/manage-category/get-all", categoryController.getAllCategory);
    // api thêm mới danh mục sp
    router.post("/manage-category/create", categoryController.createNewCategory);
    // api cập nhật danh mục sp
    router.put("/manage-category/update", categoryController.updateCategory);
    //api xóa danh mục sp
    router.delete("/manage-category/delete", categoryController.deleteCategory);

    //----------------------------------- api manage Order ------------------------
    // api lọc ds đơn mua hàng theo trạng thái đơn hàng
    router.get("/manage-order/get-orders-by-status", orderController.getOrdersByStatus);
    // api cập nhật trạng thái dơn hàng
    router.put("/manage-order/update", orderController.updateOrderStatus);

    //----------------------------------- api manage Role ------------------------
    // api lấy ds role
    router.get("/manage-role/get-all", roleController.getAllRole);

    return app.use("/api/v1", router);
};
module.exports = initApiRoutes;
