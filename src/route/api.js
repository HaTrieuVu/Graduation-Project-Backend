import express from "express";

import useController from "../controllers/userController";
import supplierController from "../controllers/supplierController";

let router = express.Router();

let initApiRoutes = (app) => {
    //----------------------------------- api account ------------------------
    //api đăng ký tài khoản
    router.post("/register", useController.handleRegister);

    //api đăng nhập
    router.post("/login", useController.handleLogin);

    //----------------------------------- api account end ------------------

    //----------------------------------- api manage user ------------------------
    //api lấy ds người dùng
    router.get("/user/get-all", useController.getAllUser);

    //api thêm mới người dùng
    router.post("/user/create", useController.createNewUser);

    //api cập nhật người dùng
    router.put("/user/update", useController.updateUser);

    //api xóa người dùng
    router.delete("/user/delete", useController.deleteUser);

    //----------------------------------- api manage Supplier ------------------------
    // api lấy ds nhà cung cấp
    router.get("/manage-supplier/get-all", supplierController.getAllSupplier);

    // api thêm mới nhà cung cấp
    router.post("/manage-supplier/create", supplierController.createNewSupplier);

    // api cập nhật nhà cung cấp
    router.put("/manage-supplier/update", supplierController.updateSupplier);

    //api xóa người dùng
    router.delete("/manage-supplier/delete", supplierController.deleteSupplier);

    return app.use("/api/v1", router);
};
module.exports = initApiRoutes;
