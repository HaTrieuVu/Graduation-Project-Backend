import db from "../models/index";

//---------------------- Service Product

//lấy tất cả ds sản phẩm
const getAllProductService = async () => {
    try {
        let products = await db.Product.findAll({
            raw: true,
            nest: true,
        });
        if (products) {
            return {
                errorCode: 0,
                errorMessage: "Danh sách sản phẩm!",
                data: products,
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
        let product = await db.Product.findOne({
            where: { PK_iSanPhamID: data.id },
        });
        if (product) {
            await product.update({
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
                errorMessage: "Sản phẩm không tồn tại!",
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
        let product = await db.Product.findOne({
            where: { PK_iSanPhamID: id },
        });

        if (product) {
            await product.destroy();
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

//---------------------- Service Product Version
//lấy tất cả ds sản phẩm - phiên bản
const getAllProductVersionService = async () => {
    try {
        let productVersion = await db.ProductVersion.findAll({
            raw: true,
            nest: true,
        });
        if (productVersion) {
            return {
                errorCode: 0,
                errorMessage: "Danh sách sản phẩm - phiên bản!",
                data: productVersion,
            };
        } else {
            return {
                errorCode: 0,
                errorMessage: "Danh sách sản phẩm - phiên bản trống!",
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

// lấy sản phẩm - phiên bản theo phân trang
const getProductVersionWithPagination = async (page, limit) => {
    try {
        let offSet = (page - 1) * limit;
        const { count, rows } = await db.ProductVersion.findAndCountAll({
            include: [
                {
                    model: db.Product,
                    as: "productData",
                    attributes: ["sTenSanPham"],
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
            productVersions: rows,
        };

        return {
            errorCode: 0,
            errorMessage: "Danh sách sản phẩm - phiên bản!",
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

//thêm mới sản phẩm - phiên bản
const createNewProductVersionService = async (data) => {
    try {
        await db.ProductVersion.create({
            FK_iSanPhamID: data.productId,
            sMauSac: data.color,
            sDungLuong: data.capacity,
            fGiaBan: data.price,
            iSoLuong: data.quantity,
            bTrangThai: data.status,
        });

        return {
            errorCode: 0,
            errorMessage: "Thêm mới sản phẩm - phiên bản thành công!",
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

//cập nhật thông tin sản phẩm - phiên bản
const updateProductVersionService = async (data) => {
    try {
        let productVersion = await db.ProductVersion.findOne({
            where: { PK_iPhienBanID: data.id },
        });
        if (productVersion) {
            await productVersion.update({
                FK_iSanPhamID: data.productId,
                sMauSac: data.color,
                sDungLuong: data.capacity,
                fGiaBan: data.price,
                iSoLuong: data.quantity,
                bTrangThai: data.status,
            });
            return {
                errorCode: 0,
                errorMessage: "Cập nhật thông tin sản phẩm - phiên bản thành công!",
                data: [],
            };
        } else {
            return {
                errorCode: -1,
                errorMessage: "Sản phẩm - phiên bản không tồn tại!",
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

//xóa sản phẩm - phiên bản
const deleteProductVersionService = async (id) => {
    try {
        let productVersion = await db.ProductVersion.findOne({
            where: { PK_iPhienBanID: id },
        });

        if (productVersion) {
            await productVersion.destroy();
            return {
                errorCode: 0,
                errorMessage: "Xóa sản phẩm - phiên bản thành công!",
                data: [],
            };
        } else {
            return {
                errorCode: -1,
                errorMessage: "Sản phẩm - phiên bản không tồn tại",
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

    getAllProductVersionService,
    getProductVersionWithPagination,
    createNewProductVersionService,
    updateProductVersionService,
    deleteProductVersionService,
};
