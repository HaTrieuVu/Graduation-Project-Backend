import db from "../models/index";

const getAllRoleService = async () => {
    try {
        let data = await db.Role.findAll({
            attributes: ["PK_iQuyenHanID", "sTenQuyenHan", "sMoTa"],
        });

        return {
            errorCode: 0,
            errorMessage: "Lấy ds role thành công!",
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

module.exports = {
    getAllRoleService,
};
