import express from "express";

import useController from "../controllers/userController";

let router = express.Router();

let initApiRoutes = (app) => {
    //api đăng ký tài khoản
    router.post("/register", useController.handleRegister);

    //api đăng nhập
    router.post("/login", useController.handleLogin);

    return app.use("/api/v1", router);
};
module.exports = initApiRoutes;
