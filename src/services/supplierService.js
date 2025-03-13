import db from "../models/index";

const getSupplierWithPagination = async (page, limit) => {
    try {
        let offSet = (page - 1) * limit;
        const { count, rows } = await db.Supplier.findAndCountAll({
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

module.exports = {
    getSupplierWithPagination,
};
