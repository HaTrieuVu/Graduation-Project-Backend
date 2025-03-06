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
        });

        if (user) {
            console.log("Tài khoản chính xác");
            let isCorrectPassword = await checkPassword(data?.password, user.sMatKhau);
            if (isCorrectPassword === true) {
                return {
                    errorCode: 0,
                    errorMessage: "Đăng nhập thành công!",
                    data: "",
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

module.exports = {
    registerUserService,
    handleLoginService,
};
