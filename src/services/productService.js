import db from "../models/index";
const { Op, fn, col, where } = require("sequelize");

//------------------------------------------------------------ Service Product

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

// lấy sản phẩm theo phân trang (admin)
const getProductWithPagination = async (page, limit) => {
    try {
        let offSet = (page - 1) * limit;
        const { count, rows } = await db.Product.findAndCountAll({
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

//thêm mới sản phẩm (admin)
const createNewProductService = async (data) => {
    try {
        // Kiểm tra tên sản phẩm đã tồn tại chưa (không phân biệt hoa thường)
        const existingProduct = await db.Product.findOne({
            where: db.sequelize.where(
                db.sequelize.fn("LOWER", db.sequelize.col("sTenSanPham")),
                data.productName.toLowerCase()
            ),
        });

        if (existingProduct) {
            return {
                errorCode: 2,
                errorMessage: "Sản phẩm đã tồn tại. Hãy kiểm tra lại!",
                data: [],
            };
        }

        // Thêm mới sản phẩm nếu chưa tồn tại
        const newProduct = await db.Product.create({
            FK_iDanhMucID: data.categoryId,
            FK_iNhanHangID: data.brandId,
            sTenSanPham: data.productName,
            sMoTa: data.description || "",
            sDanhGia: data.evaluate,
            sTinhTrangSanPham: data.status,
        });

        // Thêm khuyến mãi mặc định 5%
        await db.Promotion.create({
            FK_iSanPhamID: newProduct.PK_iSanPhamID,
            sMoTa: "Khuyến mãi mặc định",
            fGiaTriKhuyenMai: 5, // 5%
            bTrangThai: true,
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

//cập nhật thông tin sản phẩm (admin)
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

//xóa sản phẩm (admin)
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

//hàm search product (admin)
const searchProductService = async (page, limit, keywordSearch) => {
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
            where: {
                sTenSanPham: {
                    [Op.like]: `%${keywordSearch}%`, // Tìm kiếm chuỗi chứa từ khóa
                },
            },
            offset: offSet,
            limit: limit,
            raw: true,
            nest: true,
        });

        let totalPage = Math.ceil(count / limit);
        let data = {
            totalRows: count, // Tổng số bản ghi
            totalPage: totalPage, // Tổng số trang
            products: rows, // Danh sách sản phẩm
        };

        return {
            errorCode: 0,
            errorMessage: "Danh sách tìm kiếm sản phẩm!",
            data: data,
        };
    } catch (error) {
        console.error("Lỗi trong searchProductService:", error);
        return {
            errorCode: 1,
            errorMessage: "Đã xảy ra lỗi - service!",
            data: [],
        };
    }
};

//--------------------------------------------------------- Service Product Version

//lấy tất cả ds sản phẩm - phiên bản (admin)
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

// lấy sản phẩm - phiên bản theo phân trang (admin)
const getProductVersionWithPagination = async (page, limit, valueSearch) => {
    try {
        let offSet = (page - 1) * limit;
        const whereCondition = valueSearch === "all" ? {} : { FK_iSanPhamID: valueSearch };
        const { count, rows } = await db.ProductVersion.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: db.Product,
                    as: "productData",
                    attributes: ["sTenSanPham"],
                },
                {
                    model: db.ProductImage,
                    as: "productImages",
                    attributes: ["sMoTa"],
                },
            ],
            offset: offSet,
            limit: limit,
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

//thêm mới sản phẩm - phiên bản (admin)
const createNewProductVersionService = async (data) => {
    try {
        // Kiểm tra phiên bản đã tồn tại chưa
        const existingVersion = await db.ProductVersion.findOne({
            where: {
                FK_iSanPhamID: data.productId,
                FK_iHinhAnhID: data.productImageId,
                sDungLuong: data.capacity,
            },
        });

        if (existingVersion) {
            return {
                errorCode: 2,
                errorMessage: "Phiên bản đã tồn tại. Hãy kiểm tra lại!",
            };
        }

        // Nếu chưa tồn tại thì tạo mới
        await db.ProductVersion.create({
            FK_iSanPhamID: data.productId,
            FK_iHinhAnhID: data.productImageId,
            sDungLuong: data.capacity,
            fGiaBan: data.price,
            iSoLuong: data.quantity,
            bTrangThai: data.status,
        });

        return {
            errorCode: 0,
            errorMessage: "Thêm mới phiên bản sản phẩm thành công!",
        };
    } catch (error) {
        console.log(error);
        return {
            errorCode: 1,
            errorMessage: "Đã xảy ra lỗi - service!",
        };
    }
};

//cập nhật thông tin sản phẩm - phiên bản (admin)
const updateProductVersionService = async (data) => {
    try {
        let productVersion = await db.ProductVersion.findOne({
            where: { PK_iPhienBanID: data.id },
        });
        if (productVersion) {
            await productVersion.update({
                FK_iSanPhamID: data.productId,
                FK_iHinhAnhID: data.productImageId,
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

//xóa sản phẩm - phiên bản (admin)
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

//hàm lấy ds hình ảnh của sản phẩm đó (admin)
const getAllImageOfProductService = async (id) => {
    try {
        let products = await db.Product.findOne({
            where: { PK_iSanPhamID: id },
            include: [
                {
                    model: db.ProductImage,
                    as: "images",
                    attributes: ["PK_iHinhAnhID", "sMoTa"],
                },
            ],
        });
        if (products) {
            return {
                errorCode: 0,
                errorMessage: "Danh sách hình ảnh của sản phẩm!",
                data: products,
            };
        } else {
            return {
                errorCode: 0,
                errorMessage: "Danh sách hình ảnh của sản phẩm trống!",
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

//--------------------------------------------------------- Service Product Image
//lấy tất cả ds sản phẩm - hình ảnh (admin)
const getAllProductImageService = async () => {
    try {
        let productVersion = await db.ProductImage.findAll({
            raw: true,
            nest: true,
        });
        if (productVersion) {
            return {
                errorCode: 0,
                errorMessage: "Danh sách sản phẩm - hình ảnh!",
                data: productVersion,
            };
        } else {
            return {
                errorCode: 0,
                errorMessage: "Danh sách sản phẩm - hình ảnh trống!",
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

// lấy sản phẩm - hình ảnh theo phân trang (admin)
const getProductImageWithPagination = async (page, limit, valueSearch) => {
    try {
        let offSet = (page - 1) * limit;
        const whereCondition = valueSearch === "all" ? {} : { FK_iSanPhamID: valueSearch };
        const { count, rows } = await db.ProductImage.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: db.Product,
                    as: "product",
                    attributes: ["sTenSanPham"],
                },
            ],
            offset: offSet,
            limit: limit,
            raw: true,
            nest: true,
            distinct: true,
        });

        let totalPage = Math.ceil(count / limit);

        // Convert ảnh sUrl sang dạng base64 để hiển thị ảnh trên client
        if (rows && rows.length > 0) {
            rows.forEach((item) => {
                if (item.sUrl) {
                    item.sUrl = new Buffer(item.sUrl, "base64").toString("binary");
                }
            });
        }

        let data = {
            totalRows: count, //tổng có tất cả bao nhiêu bản ghi
            totalPage: totalPage,
            productImages: rows,
        };

        return {
            errorCode: 0,
            errorMessage: "Danh sách sản phẩm - hình ảnh!",
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

//thêm mới sản phẩm - hình ảnh (admin)
const createNewProductImageService = async (data) => {
    try {
        const moTaUpper = (data.description || "").toUpperCase();

        // Kiểm tra hình ảnh đã tồn tại với sản phẩm và mô tả (dạng chữ hoa)
        const existingImage = await db.ProductImage.findOne({
            where: {
                FK_iSanPhamID: data.productId,
                [Op.and]: [where(fn("UPPER", col("sMoTa")), moTaUpper)],
            },
        });

        if (existingImage) {
            return {
                errorCode: 2,
                errorMessage: "Hình ảnh với mô tả này đã tồn tại cho sản phẩm!",
            };
        }

        // Nếu chưa tồn tại thì tạo mới
        await db.ProductImage.create({
            FK_iSanPhamID: data.productId,
            sUrl: data.imgSource,
            sMoTa: data.description || "",
        });

        return {
            errorCode: 0,
            errorMessage: "Thêm mới hình ảnh sản phẩm thành công!",
        };
    } catch (error) {
        console.log(error);
        return {
            errorCode: 1,
            errorMessage: "Đã xảy ra lỗi - service!",
        };
    }
};

//cập nhật thông tin sản phẩm - hình ảnh (admin)
const updateProductImageService = async (data) => {
    try {
        let productImage = await db.ProductImage.findOne({
            where: { PK_iHinhAnhID: data.id },
        });
        if (productImage) {
            await productImage.update({
                FK_iSanPhamID: data.productId,
                sUrl: data.imgSource,
                sMoTa: data.description,
            });
            return {
                errorCode: 0,
                errorMessage: "Cập nhật thông tin sản phẩm - hình ảnh thành công!",
                data: [],
            };
        } else {
            return {
                errorCode: -1,
                errorMessage: "Sản phẩm - hình ảnh không tồn tại!",
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

//xóa sản phẩm - hình ảnh (admin)
const deleteProductImageService = async (id) => {
    try {
        let productImage = await db.ProductImage.findOne({
            where: { PK_iHinhAnhID: id },
        });

        if (productImage) {
            await productImage.destroy();
            return {
                errorCode: 0,
                errorMessage: "Xóa sản phẩm - hình ảnh thành công!",
                data: [],
            };
        } else {
            return {
                errorCode: -1,
                errorMessage: "Sản phẩm - hình ảnh không tồn tại",
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

//----------------------------------------------------------------- Client

// lấy ds sản phẩm theo phân trang để hiện thị phía client
const fetchAllProductWithPagination = async (page, limit, valueFilter) => {
    try {
        let offSet = (page - 1) * limit;

        let orderOption = [];

        if (valueFilter === "ASC") {
            // Giá tăng dần theo ProductVersion
            orderOption.push([{ model: db.ProductVersion, as: "versions" }, "fGiaBan", "ASC"]);
        } else if (valueFilter === "DESC") {
            // Giá giảm dần theo ProductVersion
            orderOption.push([{ model: db.ProductVersion, as: "versions" }, "fGiaBan", "DESC"]);
        } else if (valueFilter === "RERCENT") {
            // Giảm giá khuyến mãi giảm dần
            orderOption.push([{ model: db.Promotion, as: "promotion" }, "fGiaTriKhuyenMai", "DESC"]);
        }

        const { count, rows } = await db.Product.findAndCountAll({
            where: {
                sTinhTrangSanPham: "Đang bán",
            },
            required: false,
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
            order: orderOption,
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

// lấy thông tin 1 sản phẩm theo id
const getInfoProductSingleService = async (id) => {
    try {
        let product = await db.Product.findOne({
            where: { PK_iSanPhamID: id },
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
                    where: {
                        iSoLuong: {
                            [db.Sequelize.Op.gt]: 0, // iSoLuong > 0
                        },
                    },
                    required: false, // để không làm mất bản ghi Product nếu không có version thỏa mãn
                    attributes: { exclude: ["createdAt", "updatedAt", "FK_iSanPhamID"] },
                    include: [
                        {
                            model: db.ProductImage,
                            as: "productImages",
                            attributes: ["sUrl", "sMoTa"],
                        },
                    ],
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
        });

        // Convert ảnh sUrl sang dạng base64 để hiển thị ảnh trên client
        if (product && product?.images?.length > 0) {
            product?.images.forEach((item) => {
                if (item.sUrl) {
                    item.sUrl = new Buffer(item.sUrl, "base64").toString("binary");
                }
            });
        }

        if (product) {
            return {
                errorCode: 0,
                errorMessage: "Thông tin chi tiết sản phẩm!",
                data: product,
            };
        } else {
            return {
                errorCode: -1,
                errorMessage: "Sản phẩm không tồn tại!",
                data: {},
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

// hàm lấy tìm kiếm sản phẩm theo keyword  (client)
const searchAllProductByKeywordService = async (page, limit, keywordSearch) => {
    try {
        let offSet = (page - 1) * limit;
        const { count, rows } = await db.Product.findAndCountAll({
            where: {
                sTenSanPham: {
                    [Op.like]: `%${keywordSearch}%`, // Tìm kiếm chuỗi chứa từ khóa
                },
            },
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
        });

        let totalPage = Math.ceil(count / limit);
        let data = {
            totalRows: count, // Tổng số bản ghi
            totalPage: totalPage, // Tổng số trang
            products: rows, // Danh sách sản phẩm
        };

        return {
            errorCode: 0,
            errorMessage: "Danh sách tìm kiếm sản phẩm!",
            data: data,
        };
    } catch (error) {
        console.error("Lỗi trong searchProductService:", error);
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
    searchProductService,

    getAllProductVersionService,
    getProductVersionWithPagination,
    createNewProductVersionService,
    updateProductVersionService,
    deleteProductVersionService,
    getAllImageOfProductService,

    getAllProductImageService,
    getProductImageWithPagination,
    createNewProductImageService,
    updateProductImageService,
    deleteProductImageService,

    fetchAllProductWithPagination,
    getInfoProductSingleService,
    searchAllProductByKeywordService,
};
