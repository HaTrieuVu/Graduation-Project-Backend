require("dotenv").config();

import jwt from "jsonwebtoken";
import { rolesEmployee, rolesCustomer, authenticatedPaths } from "../utils/path";

// các đường dẫn mà k cần đăng nhập, hạn chế quyền vẫn truy cập được
const nonSecurePaths = [
    "/register",
    "/login",
    "/manage-brand/get-all",
    "/manage-category/get-all",
    "/products/get-all",
    "/product/brand",
    "/products/search",
    "/category/product-of-category",
    "/user/forgot-password",
];

// hàm tạo JWT
const createJWT = (payload) => {
    let key = process.env.JWT_SECRET;
    let token = null;

    try {
        token = jwt.sign(payload, key);
    } catch (error) {
        console.log(error);
    }

    return token;
};

// hàm dịch lại JWT
const verifyToken = (token) => {
    let key = process.env.JWT_SECRET;
    let decoded = null;

    try {
        decoded = jwt.verify(token, key);
    } catch (error) {
        console.log(error);
    }

    return decoded;
};

//middleware check user login chưa /account
const checkUserJWT = (req, res, next) => {
    if (nonSecurePaths.some((path) => req.path.startsWith(path))) {
        return next();
    }

    let cookies = req.cookies; //lấy cookie gửi từ userController

    if (cookies && cookies.jwt) {
        let token = cookies.jwt;
        let decoded = verifyToken(token); //giải mã token

        if (decoded) {
            req.user = decoded; // gán dữ liệu(token) để gửi cho middlewale sau (checkUserPermission)
            // req.token = token;
            return next();
        } else {
            return res.status(401).json({
                errorCode: -1,
                errorMessage: "Người dùng chưa đăng nhập!",
                data: "",
            });
        }
    } else {
        if (authenticatedPaths.some((path) => req.path.startsWith(path))) {
            return res.status(401).json({
                errorCode: -1,
                errorMessage: "Người dùng chưa đăng nhập!",
                data: "",
            });
        }
        return res.status(401).json({
            errorCode: -1,
            errorMessage: "Người dùng chưa đăng nhập!",
            data: "",
        });
    }
};

//middleware check quyền
const checkUserPermission = (req, res, next) => {
    if (req.path === "/account") {
        next();
    }

    // các đường dẫn k cần đăng nhập
    if (nonSecurePaths.some((path) => req.path.startsWith(path))) {
        return next();
    }

    if (req.user) {
        let roleId = req.user.roleId;
        let currentUrl = req.path;

        //Nếu path nằm trong authenticatedPaths, cho phép truy cập luôn (đã đăng nhập)
        if (authenticatedPaths.some((path) => req.path.startsWith(path))) {
            return next();
        }

        // Quản trị viên (roleId = 1) có quyền truy cập tất cả
        if (roleId === 1) {
            return next();
        }
        // Nhân viên (roleId = 2) chỉ được truy cập rolesEmployee
        else if (roleId === 2) {
            let canAccess = rolesEmployee.some((item) => item.url === currentUrl);
            if (canAccess) {
                return next();
            }
        }
        // Khách hàng chỉ được truy cập rolesCustomer
        else {
            let canAccess = rolesCustomer.some((item) => item.url === currentUrl);
            if (canAccess) {
                return next();
            }
        }
        return res.status(403).json({
            errorCode: -1,
            errorMessage: "Bạn không có quyền thực hiện hành động này!",
            data: "",
        });
    } else {
        return res.status(401).json({
            errorCode: -1,
            errorMessage: "Người dùng chưa đăng nhập!",
            data: "",
        });
    }
};

module.exports = {
    createJWT,
    verifyToken,
    checkUserJWT,
    checkUserPermission,
};
