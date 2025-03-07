import { Op } from "sequelize";
import db from "../models/index";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

// check email tồn tại chưa
const checkEmailExist = async (userEmail) => {
    let user = await db.Customer.findOne({
        where: { sEmail: userEmail },
    });

    if (user) {
        return true;
    }

    return false;
};

// check sđt tồn tại chưa
const checkPhoneUserExist = async (userPhone) => {
    let user = await db.Customer.findOne({
        where: { sSoDienThoai: userPhone },
    });

    if (user) {
        return true;
    }

    return false;
};

//băm password
const hashPasswordUser = (password) => {
    let hashPassword = bcrypt.hashSync(password, salt);
    return hashPassword;
};

const registerUserService = async (data) => {
    try {
        // check email/phoneNumber
        let isEmailExist = await checkEmailExist(data.email);
        let isPhoneExist = await checkPhoneUserExist(data.phoneNumber);
        if (isEmailExist === true) {
            return {
                errorCode: 1,
                errorMessage: "Email đã tồn tại!",
            };
        }
        if (isPhoneExist === true) {
            return {
                errorCode: 1,
                errorMessage: "Số điện thoại đã tồn tại!",
            };
        }

        //hash password
        let hashPassword = hashPasswordUser(data.password);

        //create new user
        await db.Customer.create({
            FK_iQuyenHanID: 3,
            sHoTen: data.fullName,
            sEmail: data.email,
            sSoDienThoai: data.phoneNumber,
            sDiaChi: data.address,
            sMatKhau: hashPassword,
        });

        return {
            errorCode: 0,
            errorMessage: "Tạo mới người dùng thành công!",
        };
    } catch (error) {
        console.log("error from service", error);
        return {
            errorCode: -1,
            errorMessage: "Đã xảy ra lỗi!",
        };
    }
};

//check password
const checkPassword = async (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword); //return true or fales
};

const handleLoginService = async (data) => {
    try {
        let user = await db.Customer.findOne({
            where: {
                [Op.or]: [
                    {
                        sEmail: data?.valueLogin,
                    },
                    {
                        sSoDienThoai: data?.valueLogin,
                    },
                ],
            },
            attributes: { exclude: ["sEmail", "sSoDienThoai"] },
            raw: true,
        });
        if (user) {
            console.log("Tài khoản chính xác");
            let isCorrectPassword = await checkPassword(data?.password, user.sMatKhau);
            if (isCorrectPassword === true) {
                let userData = {};
                delete user.sMatKhau;

                userData = user;
                return {
                    errorCode: 0,
                    errorMessage: "Đăng nhập thành công!",
                    data: userData,
                };
            }
        }
        console.log(">>> Email/Số điện thoại không tồn tại:", data?.valueLogin);
        return {
            errorCode: -1,
            errorMessage: "Email/Số điện thoại hoặc mật khẩu không chính xác!",
            data: "",
        };
    } catch (error) {
        console.log("error from service", error);
        return {
            errorCode: -1,
            errorMessage: "Đã xảy ra lỗi!",
            data: "",
        };
    }
};

//-------------------- user service --------------------
//lấy ds người dùng
const getAllUserService = async () => {
    try {
        let users = await db.Customer.findAll({
            attributes: ["PK_iKhachHangID", "sHoTen", "sEmail", "sSoDienThoai", "sDiaChi", "sAvatar"],
            include: { model: db.Role, as: "role", attributes: ["PK_iQuyenHanID", "sTenQuyenHan", "sMoTa"] },
            raw: true,
            // nest: true,
        });
        if (users) {
            return {
                errorCode: 0,
                errorMessage: "Danh sách khách hàng!",
                data: users,
            };
        } else {
            return {
                errorCode: 0,
                errorMessage: "Danh sách khách hàng trống!",
                data: [],
            };
        }
    } catch (error) {
        console.log(error);
        return {
            errorCode: 1,
            errorMessage: "Đã xảy ra lỗi - service!",
            data: [],
        };
    }
};

//thêm mới người dùng
const createNewUserService = async (data) => {
    try {
        await db.Customer.create({});
    } catch (error) {
        console.log(error);
        return {
            errorCode: 1,
            errorMessage: "Đã xảy ra lỗi - service!",
            data: [],
        };
    }
};

//cập nhật người dùng
const updateUserService = async (data) => {
    try {
        let user = await db.Customer.findOne({
            where: { PK_iKhachHangID: data.id },
        });
        if (user) {
            user.save({});
        } else {
        }
    } catch (error) {
        console.log(error);
        return {
            errorCode: 1,
            errorMessage: "Đã xảy ra lỗi - service!",
            data: [],
        };
    }
};

//xóa người dùng
const deleteUserService = async (id) => {
    try {
        await db.Customer.delete({
            where: { PK_iKhachHangID: id },
        });
    } catch (error) {
        console.log(error);
        return {
            errorCode: 1,
            errorMessage: "Đã xảy ra lỗi - service!",
            data: [],
        };
    }
};

//-------------------- user service end --------------------

module.exports = {
    registerUserService,
    handleLoginService,
    getAllUserService,
    createNewUserService,
    updateUserService,
    deleteUserService,
};
