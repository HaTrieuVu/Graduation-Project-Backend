import db from "../models/index";

//lấy tất cả ds danh mục sản phẩm
const getAllCategoryService = async () => {
    try {
        let categories = await db.Category.findAll({
            attributes: ["PK_iDanhMucID", "sTenDanhMuc"],
            raw: true,
            nest: true,
        });
        if (categories) {
            return {
                errorCode: 0,
                errorMessage: "Danh sách danh mục sản phẩm!",
                data: categories,
            };
        } else {
            return {
                errorCode: 0,
                errorMessage: "Danh sách danh mục sản phẩm trống!",
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

const getAllProductOfCategoryService = async (page, limit, categoryId) => {
    try {
        let offSet = (page - 1) * limit;

        // Lấy thông tin danh mục
        const category = await db.Category.findOne({
            where: { PK_iDanhMucID: categoryId },
            attributes: ["sTenDanhMuc"],
        });

        const { count, rows } = await db.Product.findAndCountAll({
            where: { FK_iDanhMucID: categoryId }, // Thêm điều kiện lọc theo danh mục
            attributes: { exclude: ["createdAt", "updatedAt", "sMoTa"] },
            include: [
                {
                    model: db.Category,
                    as: "categoryData",
                    attributes: ["sTenDanhMuc"],
                },
                {
                    model: db.Brand,
                    as: "brandData",
                    attributes: ["sTenNhanHang"],
                },
                {
                    model: db.ProductVersion,
                    as: "versions",
                    attributes: { exclude: ["createdAt", "updatedAt", "FK_iSanPhamID"] },
                },
                {
                    model: db.ProductImage,
                    as: "images",
                    attributes: { exclude: ["createdAt", "updatedAt", "FK_iSanPhamID"] },
                },
                {
                    model: db.Promotion,
                    as: "promotion",
                    attributes: ["fGiaTriKhuyenMai"],
                },
            ],
            offset: offSet,
            limit: limit,
            distinct: true,
        });

        let totalPage = Math.ceil(count / limit);
        return {
            errorCode: 0,
            errorMessage: "Danh sách sản phẩm!",
            data: {
                totalRows: count,
                totalPage: totalPage,
                products: rows,
                categoryName: category ? category.sTenDanhMuc : null,
            },
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
    getAllCategoryService,
    getCategoryWithPagination,
    createNewCategoryService,
    updateCategoryService,
    deleteCategoryService,

    getAllProductOfCategoryService,
};
