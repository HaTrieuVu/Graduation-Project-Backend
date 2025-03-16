import db from "../models/index";

// lấy danh mục sản phẩm theo phân trang
const getCategoryWithPagination = async (page, limit) => {
    try {
        let offSet = (page - 1) * limit;
        const { count, rows } = await db.Category.findAndCountAll({
            offset: offSet,
            limit: limit,
            raw: true,
            nest: true,
        });

        let totalPage = Math.ceil(count / limit);
        let data = {
            totalRows: count, //tổng có tất cả bao nhiêu bản ghi
            totalPage: totalPage,
            categories: rows,
        };

        return {
            errorCode: 0,
            errorMessage: "Danh sách danh mục sản phẩm!",
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

//thêm mới danh mục sản phẩm
const createNewCategoryService = async (data) => {
    try {
        await db.Category.create({
            sTenDanhMuc: data.nameCategory,
            sMoTa: data.description,
        });

        return {
            errorCode: 0,
            errorMessage: "Thêm mới danh mục sản phẩm thành công!",
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

//cập nhật thông tin danh mục sản phẩm
const updateCategoryService = async (data) => {
    try {
        let category = await db.Category.findOne({
            where: { PK_iDanhMucID: data.id },
        });
        if (category) {
            await category.update({
                sTenDanhMuc: data.nameCategory,
                sMoTa: data.description,
            });
            return {
                errorCode: 0,
                errorMessage: "Cập nhật thông tin danh mục sản phẩm thành công!",
                data: [],
            };
        } else {
            return {
                errorCode: -1,
                errorMessage: "Danh mục sản phẩm không tồn tại!",
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

//xóa danh mục sản phẩm
const deleteCategoryService = async (id) => {
    try {
        let category = await db.Category.findOne({
            where: { PK_iDanhMucID: id },
        });

        if (category) {
            await category.destroy();
            return {
                errorCode: 0,
                errorMessage: "Xóa danh mục sản phẩm thành công!",
                data: [],
            };
        } else {
            return {
                errorCode: -1,
                errorMessage: "Danh mục sản phẩm không tồn tại",
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

module.exports = {
    getCategoryWithPagination,
    createNewCategoryService,
    updateCategoryService,
    deleteCategoryService,
};
