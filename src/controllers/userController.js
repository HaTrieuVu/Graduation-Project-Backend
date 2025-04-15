import userService from "../services/userService";

// hàm đăng ký
const handleRegister = async (req, res) => {
    try {
        if (!req.body.fullName || !req.body.email || !req.body.phoneNumber || !req.body.address || !req.body.password) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc!",
                data: "",
            });
        }

        let data = await userService.registerUserService(req.body);

        return res.status(200).json({
            errorCode: data.errorCode,
            errorMessage: data.errorMessage,
            data: "",
        });
    } catch (error) {
        return res.status(500).json({
            errorCode: -1,
            errorMessage: "Error From Server",
            data: "",
        });
    }
};

//hàm đăng nhập
const handleLogin = async (req, res) => {
    try {
        if (!req.body.valueLogin || !req.body.password) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc!",
                data: "",
            });
        }

        let data = await userService.handleLoginService(req.body);

        if (data && data?.data?.access_token) {
            //set cookie
            res.cookie("jwt", data?.data?.access_token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
        }

        return res.status(200).json({
            errorCode: data.errorCode,
            errorMessage: data.errorMessage,
            data: data.data,
        });
    } catch (error) {
        return res.status(500).json({
            errorCode: -1,
            errorMessage: "Error From Server",
            data: "",
        });
    }
};

//hàm đăng xuất
const handleLogout = async (req, res) => {
    try {
        res.clearCookie("jwt");

        return res.status(200).json({
            errorCode: 0,
            errorMessage: "Đăng xuất thành công!",
        });
    } catch (error) {
        return res.status(500).json({
            errorCode: -1,
            errorMessage: "Error From Server",
            data: "",
        });
    }
};

// hàm lấy ds người dùng (admin)
const getAllUser = async (req, res) => {
    try {
        if (req?.query?.page && req?.query?.limit && req?.query?.keywordSearch) {
            let page = req?.query?.page;
            let limit = req?.query?.limit;
            let keywordSearch = req?.query?.keywordSearch;

            let data = await userService.getUserWithPagination(+page, +limit, keywordSearch);

            return res.status(200).json({
                errorCode: data.errorCode,
                errorMessage: data.errorMessage,
                data: data.data,
            });
        } else {
            let data = await userService.getAllUserService();

            return res.status(200).json({
                errorCode: data.errorCode,
                errorMessage: data.errorMessage,
                data: data.data,
            });
        }
    } catch (error) {
        console.log(">>> ERR", error);
        return res.status(500).json({
            errorCode: -1,
            errorMessage: "Error From Server",
            data: "",
        });
    }
};

// hàm thêm mới người dùng (admin)
const createNewUser = async (req, res) => {
    try {
        if (
            !req.body.email ||
            !req.body.phoneNumber ||
            !req.body.fullName ||
            !req.body.password ||
            !req.body.address ||
            !req.body.role
        ) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc!",
                data: "",
            });
        }

        let data = await userService.createNewUserService(req.body);

        return res.status(200).json({
            errorCode: data.errorCode,
            errorMessage: data.errorMessage,
            data: data.data,
        });
    } catch (error) {
        console.log(">>> ERR", error);
        return res.status(500).json({
            errorCode: -1,
            errorMessage: "Error From Server",
            data: "",
        });
    }
};

// hàm cập nhật người dùng (admin)
const updateUser = async (req, res) => {
    try {
        let data = await userService.updateUserService(req.body);

        return res.status(200).json({
            errorCode: data.errorCode,
            errorMessage: data.errorMessage,
            data: data.data,
        });
    } catch (error) {
        console.log(">>> ERR", error);
        return res.status(500).json({
            errorCode: -1,
            errorMessage: "Error From Server",
            data: "",
        });
    }
};

// hàm xóa người dùng (admin)
const deleteUser = async (req, res) => {
    try {
        if (req?.body?.id) {
            let data = await userService.deleteUserService(req?.body?.id);

            return res.status(200).json({
                errorCode: data.errorCode,
                errorMessage: data.errorMessage,
                data: data.data,
            });
        }
    } catch (error) {
        console.log(">>> ERR", error);
        return res.status(500).json({
            errorCode: -1,
            errorMessage: "Error From Server",
            data: "",
        });
    }
};

//hàm lấy thông tin người dùng từ cookie
const getUserInfoAccount = async (req, res) => {
    return res.status(200).json({
        errorCode: 0,
        errorMessage: "Ok!",
        data: {
            // access_token: req.token,
            user: req.user,
        },
    });
};

//hàm lấy thông tin 1 người dùng
const getUserInfo = async (req, res) => {
    try {
        if (!req?.query?.id) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc!",
                data: "",
            });
        }

        let data = await userService.getUserInfoService(req?.query?.id);

        return res.status(200).json({
            errorCode: data.errorCode,
            errorMessage: data.errorMessage,
            data: data.data,
        });
    } catch (error) {
        console.log(">>> ERR", error);
        return res.status(500).json({
            errorCode: -1,
            errorMessage: "Error From Server",
            data: "",
        });
    }
};

//----------------------------------- Employee
// hàm lấy ds nhân viên (admin)
const getAllEmployee = async (req, res) => {
    try {
        if (req?.query?.page && req?.query?.limit) {
            let page = req?.query?.page;
            let limit = req?.query?.limit;

            let data = await userService.getEmployeeWithPagination(+page, +limit);

            return res.status(200).json({
                errorCode: data.errorCode,
                errorMessage: data.errorMessage,
                data: data.data,
            });
        }
    } catch (error) {
        console.log(">>> ERR", error);
        return res.status(500).json({
            errorCode: -1,
            errorMessage: "Error From Server",
            data: "",
        });
    }
};

// hàm thêm mới nhân viên (admin)
const createNewEmployee = async (req, res) => {
    try {
        if (
            !req.body.email ||
            !req.body.phoneNumber ||
            !req.body.fullName ||
            !req.body.password ||
            !req.body.address ||
            !req.body.role
        ) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc!",
            });
        }

        let data = await userService.createNewEmployeeService(req.body);

        return res.status(200).json({
            errorCode: data.errorCode,
            errorMessage: data.errorMessage,
        });
    } catch (error) {
        console.log(">>> ERR", error);
        return res.status(500).json({
            errorCode: -1,
            errorMessage: "Error From Server",
            data: "",
        });
    }
};

// hàm cập nhật nhân viên (admin)
const updateEmployee = async (req, res) => {
    try {
        let data = await userService.updateEmployeeService(req.body);

        return res.status(200).json({
            errorCode: data.errorCode,
            errorMessage: data.errorMessage,
        });
    } catch (error) {
        console.log(">>> ERR", error);
        return res.status(500).json({
            errorCode: -1,
            errorMessage: "Error From Server",
            data: "",
        });
    }
};

// hàm xóa nhân viên (admin)
const deleteEmployee = async (req, res) => {
    try {
        if (req?.body?.id) {
            let data = await userService.deleteEmployeeService(req?.body?.id);

            return res.status(200).json({
                errorCode: data.errorCode,
                errorMessage: data.errorMessage,
            });
        }
    } catch (error) {
        console.log(">>> ERR", error);
        return res.status(500).json({
            errorCode: -1,
            errorMessage: "Error From Server",
            data: "",
        });
    }
};

//--------------------------------- User
// hàm cập nhật người dùng (admin)
const updateProfileUser = async (req, res) => {
    try {
        if (!req.body.id || !req.body.email || !req.body.phoneNumber || !req.body.fullName || !req.body.address) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc!",
            });
        }

        let data = await userService.updateProfileUserService(req.body);

        return res.status(200).json({
            errorCode: data.errorCode,
            errorMessage: data.errorMessage,
        });
    } catch (error) {
        console.log(">>> ERR", error);
        return res.status(500).json({
            errorCode: -1,
            errorMessage: "Error From Server",
        });
    }
};

// hàm đổi mật khẩu
const handleChangePassword = async (req, res) => {
    try {
        if (!req.body.id || !req.body.passwordOld || !req.body.passwordNew) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc!",
            });
        }

        let data = await userService.handleChangePasswordService(req.body);

        return res.status(200).json({
            errorCode: data.errorCode,
            errorMessage: data.errorMessage,
        });
    } catch (error) {
        console.log(">>> ERR", error);
        return res.status(500).json({
            errorCode: -1,
            errorMessage: "Error From Server",
        });
    }
};

//---------------------------- Feedback (user)
const handleSendFeedback = async (req, res) => {
    try {
        if (!req.body.id || !req.body.dataFeedback) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc!",
            });
        }

        let data = await userService.handleSendFeedbackService(req.body);

        return res.status(200).json({
            errorCode: data.errorCode,
            errorMessage: data.errorMessage,
        });
    } catch (error) {
        console.log(">>> ERR", error);
        return res.status(500).json({
            errorCode: -1,
            errorMessage: "Error From Server",
            data: "",
        });
    }
};

module.exports = {
    handleRegister,
    handleLogin,
    handleLogout,
    getAllUser,
    createNewUser,
    updateUser,
    deleteUser,
    getUserInfoAccount,
    getUserInfo,

    getAllEmployee,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,

    updateProfileUser,
    handleChangePassword,

    handleSendFeedback,
};
