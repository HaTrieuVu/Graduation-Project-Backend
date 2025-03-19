import db from "../models/index";

//lấy tất cả ds sản phẩm
const getAllProductService = async () => {
    try {
        let categories = await db.Product.findAll({
            attributes: ["PK_iSanPhamID", "sTenDanhMuc"],
            raw: true,
            nest: true,
        });
        if (categories) {
            return {
                errorCode: 0,
                errorMessage: "Danh sách sản phẩm!",
                data: categories,
            };
        } else {
            return {
                errorCode: 0,
                errorMessage: "Danh sách sản phẩm trống!",
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

// lấy sản phẩm theo phân trang
const getProductWithPagination = async (page, limit) => {
    try {
        let offSet = (page - 1) * limit;
        const { count, rows } = await db.Product.findAndCountAll({
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
            ],
            offset: offSet,
            limit: limit,
            raw: true,
            nest: true,
        });

        let totalPage = Math.ceil(count / limit);
        let data = {
            totalRows: count, //tổng có tất cả bao nhiêu bản ghi
            totalPage: totalPage,
            products: rows,
        };

        return {
            errorCode: 0,
            errorMessage: "Danh sách sản phẩm!",
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

//thêm mới sản phẩm
const createNewProductService = async (data) => {
    try {
        await db.Product.create({
            FK_iDanhMucID: data.categoryId,
            FK_iNhanHangID: data.brandId,
            sTenSanPham: data.productName,
            sMoTa: data.description || "",
            sDanhGia: data.evaluate,
            sTinhTrangSanPham: data.status,
        });

        return {
            errorCode: 0,
            errorMessage: "Thêm mới sản phẩm thành công!",
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

//cập nhật thông tin sản phẩm
const updateProductService = async (data) => {
    try {
        let category = await db.Product.findOne({
            where: { PK_iSanPhamID: data.id },
        });
        if (category) {
            await category.update({
                FK_iDanhMucID: data.categoryId,
                FK_iNhanHangID: data.brandId,
                sTenSanPham: data.productName,
                sMoTa: data.description || "",
                sDanhGia: data.evaluate,
                sTinhTrangSanPham: data.status,
            });
            return {
                errorCode: 0,
                errorMessage: "Cập nhật thông tin sản phẩm thành công!",
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

//xóa sản phẩm
const deleteProductService = async (id) => {
    try {
        let category = await db.Product.findOne({
            where: { PK_iSanPhamID: id },
        });

        if (category) {
            await category.destroy();
            return {
                errorCode: 0,
                errorMessage: "Xóa sản phẩm thành công!",
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
    getAllProductService,
    getProductWithPagination,
    createNewProductService,
    updateProductService,
    deleteProductService,
};
