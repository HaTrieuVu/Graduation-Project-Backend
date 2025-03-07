import express from "express";

import useController from "../controllers/userController";

let router = express.Router();

let initApiRoutes = (app) => {
    //----------------------------------- api account ------------------------
    //api đăng ký tài khoản
    router.post("/register", useController.handleRegister);

    //api đăng nhập
    router.post("/login", useController.handleLogin);

    //----------------------------------- api account end ------------------

    //----------------------------------- api user ------------------------
    //api lấy ds người dùng
    router.get("/user/get-all", useController.getAllUser);

    //api thêm mới người dùng
    router.post("/user/create", useController.createNewUser);

    //api cập nhật người dùng
    router.put("/user/update", useController.updateUser);

    //api xóa người dùng
    router.delete("/user/delete", useController.deleteUser);

    //----------------------------------- api user end ------------------

    return app.use("/api/v1", router);
};
module.exports = initApiRoutes;
