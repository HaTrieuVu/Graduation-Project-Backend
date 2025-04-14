require("dotenv").config();

import { Op } from "sequelize";
import bcrypt from "bcryptjs";

import db from "../models/index";
import { createJWT } from "../middleware/JWTAction";

const salt = bcrypt.genSaltSync(10);

// Kiểm tra email tồn tại trong Customer hoặc Employee
const checkEmailExist = async (userEmail, userIdToExclude = null) => {
    const [customer, employee] = await Promise.all([
        db.Customer.findOne({
            where: {
                sEmail: userEmail,
                ...(userIdToExclude && { PK_iKhachHangID: { [db.Sequelize.Op.ne]: userIdToExclude } }),
            },
        }),
        db.Employee.findOne({ where: { sEmail: userEmail } }),
    ]);

    return !!(customer || employee); // Trả về true nếu tồn tại email ở người khác
};

// Kiểm tra số điện thoại tồn tại trong Customer hoặc Employee
const checkPhoneUserExist = async (userPhone, userIdToExclude = null) => {
    const [customer, employee] = await Promise.all([
        db.Customer.findOne({
            where: {
                sSoDienThoai: userPhone,
                ...(userIdToExclude && { PK_iKhachHangID: { [db.Sequelize.Op.ne]: userIdToExclude } }),
            },
        }),
        db.Employee.findOne({ where: { sSoDienThoai: userPhone } }),
    ]);

    return !!(customer || employee); // Trả về true nếu tồn tại SĐT ở người khác
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

        // Hash password
        let hashPassword = hashPasswordUser(data.password);

        // Transaction để đảm bảo cả User và Cart được tạo thành công
        const transaction = await db.sequelize.transaction();
        try {
            // Tạo khách hàng
            const newCustomer = await db.Customer.create(
                {
                    FK_iQuyenHanID: 3,
                    sHoTen: data.fullName,
                    sEmail: data.email,
                    sSoDienThoai: data.phoneNumber,
                    sDiaChi: data.address,
                    sMatKhau: hashPassword,
                },
                { transaction }
            );

            // Tạo giỏ hàng rỗng cho khách hàng
            await db.Cart.create(
                {
                    FK_iKhachHangID: newCustomer.PK_iKhachHangID,
                },
                { transaction }
            );

            // Commit transaction
            await transaction.commit();

            return {
                errorCode: 0,
                errorMessage: "Đăng ký tài khoản thành công!",
            };
        } catch (error) {
            await transaction.rollback();
            console.log("Error when creating user & cart:", error);
            return {
                errorCode: -1,
                errorMessage: "Đã xảy ra lỗi khi tạo tài khoản!",
            };
        }
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
        const { valueLogin, password } = data;

        // Tìm tài khoản trong cả hai bảng song song
        const [customer, employee] = await Promise.all([
            db.Customer.findOne({
                where: {
                    [Op.or]: [{ sEmail: valueLogin }, { sSoDienThoai: valueLogin }],
                },
                include: [
                    {
                        model: db.Role,
                        as: "role",
                        attributes: ["sTenQuyenHan", "sMoTa"],
                    },
                    {
                        model: db.Cart,
                        as: "carts",
                        attributes: ["PK_iGioHangID"],
                    },
                ],
                attributes: { exclude: ["sTenDangNhap", "createdAt", "updatedAt"] },
                raw: true,
                nest: true,
            }),
            db.Employee.findOne({
                where: {
                    [Op.or]: [{ sEmail: valueLogin }, { sSoDienThoai: valueLogin }],
                },
                include: [
                    {
                        model: db.Role,
                        as: "role",
                        attributes: ["sTenQuyenHan", "sMoTa"],
                    },
                ],
                attributes: { exclude: ["sTenDangNhap", "createdAt", "updatedAt"] },
                raw: true,
                nest: true,
            }),
        ]);

        let user = customer || employee;
        if (user) {
            let isCorrectPassword = await checkPassword(password, user.sMatKhau);
            if (isCorrectPassword) {
                delete user.sMatKhau; // Xóa mật khẩu trước khi trả về

                let payload = {
                    userId: user?.PK_iKhachHangID || user?.PK_iNhanVienID,
                    roleId: user?.FK_iQuyenHanID,
                    cartId: customer ? user?.carts?.PK_iGioHangID : null, // Chỉ Customer có giỏ hàng
                    userName: user?.sHoTen,
                    phoneNumber: user?.sSoDienThoai,
                    isEmployee: !!employee, // Đánh dấu nếu là nhân viên
                    expiresIn: process.env.JWT_EXPIRES_IN,
                };

                let token = createJWT(payload);

                return {
                    errorCode: 0,
                    errorMessage: "Đăng nhập thành công!",
                    data: {
                        user,
                        access_token: token,
                    },
                };
            }
        }

        return {
            errorCode: -1,
            errorMessage: "Email/Số điện thoại hoặc mật khẩu không chính xác!",
            data: "",
        };
    } catch (error) {
        console.error("error from service", error);
        return {
            errorCode: -1,
            errorMessage: "Đã xảy ra lỗi!",
            data: "",
        };
    }
};

//-------------------- user service --------------------
//lấy tất cả ds người dùng
const getAllUserService = async () => {
    try {
        let users = await db.Customer.findAll({
            attributes: ["PK_iKhachHangID", "sHoTen", "sEmail", "sSoDienThoai", "sDiaChi", "sAvatar"],
            include: { model: db.Role, as: "role", attributes: ["PK_iQuyenHanID", "sTenQuyenHan", "sMoTa"] },
            raw: true,
            nest: true,
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

// lấy user theo phân trang
const getUserWithPagination = async (page, limit, keywordSearch) => {
    try {
        let offSet = (page - 1) * limit;

        // Tạo điều kiện where
        let whereCondition = {};
        if (keywordSearch && keywordSearch.toLowerCase() !== "all") {
            whereCondition = {
                [Op.or]: [
                    { sHoTen: { [Op.like]: `%${keywordSearch}%` } },
                    { sSoDienThoai: { [Op.like]: `%${keywordSearch}%` } },
                    { sEmail: { [Op.like]: `%${keywordSearch}%` } },
                ],
            };
        }

        const { count, rows } = await db.Customer.findAndCountAll({
            where: whereCondition,
            attributes: ["PK_iKhachHangID", "sHoTen", "sEmail", "sSoDienThoai", "sDiaChi", "sAvatar"],
            include: { model: db.Role, as: "role", attributes: ["PK_iQuyenHanID", "sTenQuyenHan", "sMoTa"] },
            offset: offSet,
            limit: limit,
            raw: true,
            nest: true,
        });

        let totalPage = Math.ceil(count / limit);
        let data = {
            totalRows: count, //tổng có tất cả bao nhiêu bản ghi
            totalPage: totalPage,
            users: rows,
        };

        return {
            errorCode: 0,
            errorMessage: "Danh sách khách hàng!",
            data: data,
        };
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

        await db.Customer.create({
            FK_iQuyenHanID: data.role,
            sHoTen: data.fullName,
            sEmail: data.email,
            sSoDienThoai: data.phoneNumber,
            sDiaChi: data.address,
            sMatKhau: hashPassword,
        });

        return {
            errorCode: 0,
            errorMessage: "Thêm mới người dùng thành công!",
            data: [],
        };
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

        if (!user) {
            return {
                errorCode: -1,
                errorMessage: "Người dùng không tồn tại!",
                data: [],
            };
        }

        await user.update({
            sHoTen: data.fullName,
            sDiaChi: data.address,
            FK_iQuyenHanID: data.role,
        });

        return {
            errorCode: 0,
            errorMessage: "Cập nhật thông tin người dùng thành công!",
            data: [],
        };
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
        let user = await db.Customer.findOne({
            where: { PK_iKhachHangID: id },
        });

        if (user) {
            await user.destroy();
            return {
                errorCode: 0,
                errorMessage: "Xóa người dùng thành công!",
                data: [],
            };
        } else {
            return {
                errorCode: -1,
                errorMessage: "Người dùng không tồn tại",
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

//lấy thông tin người 1 dùng
const getUserInfoService = async (id) => {
    try {
        let user = await db.Customer.findOne({
            where: { PK_iKhachHangID: id },
            attributes: ["PK_iKhachHangID", "sHoTen", "sEmail", "sSoDienThoai", "sDiaChi", "sAvatar"],
        });

        if (user) {
            if (user.sAvatar && Buffer.isBuffer(user.sAvatar)) {
                user.sAvatar = new Buffer(user.sAvatar, "base64").toString("binary");
            }

            return {
                errorCode: 0,
                errorMessage: "Thông tin người dùng!",
                data: user,
            };
        } else {
            return {
                errorCode: -1,
                errorMessage: "Người dùng không tồn tại",
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

//--------------------------------------------------------------------------------------- employee
//thêm mới nhân viên
const createNewEmployeeService = async (data) => {
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

        await db.Employee.create({
            FK_iQuyenHanID: data.role,
            sHoTen: data.fullName,
            sEmail: data.email,
            sSoDienThoai: data.phoneNumber,
            sDiaChi: data.address,
            sMatKhau: hashPassword,
        });

        return {
            errorCode: 0,
            errorMessage: "Thêm mới nhân viên thành công!",
        };
    } catch (error) {
        console.log(error);
        return {
            errorCode: 1,
            errorMessage: "Đã xảy ra lỗi - service!",
        };
    }
};

// lấy nhân viên theo phân trang
const getEmployeeWithPagination = async (page, limit) => {
    try {
        let offSet = (page - 1) * limit;
        const { count, rows } = await db.Employee.findAndCountAll({
            attributes: ["PK_iNhanVienID", "sHoTen", "sEmail", "sSoDienThoai", "sDiaChi"],
            include: { model: db.Role, as: "role", attributes: ["PK_iQuyenHanID", "sTenQuyenHan", "sMoTa"] },
            offset: offSet,
            limit: limit,
            raw: true,
            nest: true,
        });

        let totalPage = Math.ceil(count / limit);
        let data = {
            totalRows: count, //tổng có tất cả bao nhiêu bản ghi
            totalPage: totalPage,
            employees: rows,
        };

        return {
            errorCode: 0,
            errorMessage: "Danh sách nhân viên!",
            data: data,
        };
    } catch (error) {
        console.log(error);
        return {
            errorCode: 1,
            errorMessage: "Đã xảy ra lỗi - service!",
            data: [],
        };
    }
};

//cập nhật nhân viên
const updateEmployeeService = async (data) => {
    try {
        let employee = await db.Employee.findOne({
            where: { PK_iNhanVienID: data.id },
        });

        if (!employee) {
            return {
                errorCode: -1,
                errorMessage: "Nhân viên không tồn tại!",
            };
        }

        // Kiểm tra nếu email thay đổi
        if (data.email && data.email !== employee.sEmail) {
            const emailExists = await checkEmailExist(data.email, null, data.id);
            if (emailExists) {
                return {
                    errorCode: 2,
                    errorMessage: "Email đã tồn tại!",
                };
            }
        }

        // Kiểm tra nếu số điện thoại thay đổi
        if (data.phoneNumber && data.phoneNumber !== employee.sSoDienThoai) {
            const phoneExists = await checkPhoneUserExist(data.phoneNumber, null, data.id);
            if (phoneExists) {
                return {
                    errorCode: 3,
                    errorMessage: "Số điện thoại đã tồn tại!",
                };
            }
        }

        // Hash password nếu có thay đổi
        const hashPassword = data.password ? hashPasswordUser(data.password) : employee.sMatKhau;

        await employee.update({
            FK_iQuyenHanID: data.role,
            sHoTen: data.fullName,
            sEmail: data.email,
            sSoDienThoai: data.phoneNumber,
            sDiaChi: data.address,
            sMatKhau: hashPassword,
        });

        return {
            errorCode: 0,
            errorMessage: "Cập nhật thông tin nhân viên thành công!",
        };
    } catch (error) {
        console.log(error);
        return {
            errorCode: 1,
            errorMessage: "Đã xảy ra lỗi - service!",
        };
    }
};

//xóa người dùng
const deleteEmployeeService = async (id) => {
    try {
        let employee = await db.Employee.findOne({
            where: { PK_iNhanVienID: id },
        });

        if (employee) {
            await employee.destroy();
            return {
                errorCode: 0,
                errorMessage: "Xóa nhân viên thành công!",
            };
        } else {
            return {
                errorCode: -1,
                errorMessage: "Nhân viên không tồn tại",
            };
        }
    } catch (error) {
        console.log(error);
        return {
            errorCode: 1,
            errorMessage: "Đã xảy ra lỗi - service!",
        };
    }
};

//------------------------------------------------------------------------------ user
const updateProfileUserService = async (data) => {
    try {
        const user = await db.Customer.findOne({
            where: { PK_iKhachHangID: data.id },
        });

        if (!user) {
            return {
                errorCode: -1,
                errorMessage: "Người dùng không tồn tại!",
            };
        }

        // Kiểm tra nếu email thay đổi và đã tồn tại ở người khác
        if (data.email && data.email !== user.sEmail) {
            const emailExists = await checkEmailExist(data.email, data.id);
            if (emailExists) {
                return {
                    errorCode: 2,
                    errorMessage: "Email đã tồn tại!",
                };
            }
        }

        // Kiểm tra nếu số điện thoại thay đổi và đã tồn tại ở người khác
        if (data.phoneNumber && data.phoneNumber !== user.sSoDienThoai) {
            const phoneExists = await checkPhoneUserExist(data.phoneNumber, data.id);
            if (phoneExists) {
                return {
                    errorCode: 3,
                    errorMessage: "Số điện thoại đã tồn tại!",
                };
            }
        }

        // Cập nhật thông tin
        await user.update({
            sHoTen: data.fullName,
            sDiaChi: data.address,
            sEmail: data?.email,
            sSoDienThoai: data.phoneNumber,
            sAvatar: data.avatar || null,
        });

        return {
            errorCode: 0,
            errorMessage: "Cập nhật thông tin người dùng thành công!",
        };
    } catch (error) {
        console.log(error);
        return {
            errorCode: 1,
            errorMessage: "Đã xảy ra lỗi - service!",
        };
    }
};

const handleChangePasswordService = async (data) => {
    try {
        const user = await db.Customer.findOne({
            where: { PK_iKhachHangID: data.id },
        });

        if (!user) {
            return {
                errorCode: -1,
                errorMessage: "Người dùng không tồn tại!",
            };
        }

        const isCorrectPassword = await checkPassword(data.passwordOld, user.sMatKhau);
        if (!isCorrectPassword) {
            return {
                errorCode: -2,
                errorMessage: "Mật khẩu hiện tại không chính xác!",
            };
        }

        const hashPassword = hashPasswordUser(data.passwordNew);
        await user.update({
            sMatKhau: hashPassword,
        });

        return {
            errorCode: 0,
            errorMessage: "Cập nhật mật khẩu thành công!",
        };
    } catch (error) {
        console.log(error);
        return {
            errorCode: 1,
            errorMessage: "Đã xảy ra lỗi - service!",
        };
    }
};

module.exports = {
    registerUserService,
    handleLoginService,
    getAllUserService,
    getUserWithPagination,
    createNewUserService,
    updateUserService,
    deleteUserService,
    getUserInfoService,

    createNewEmployeeService,
    getEmployeeWithPagination,
    updateEmployeeService,
    deleteEmployeeService,

    updateProfileUserService,
    handleChangePasswordService,
};
