import db from "../models/index";

//lấy tất cả ds nhãn hàng
const getAllBrandService = async () => {
    try {
        let brands = await db.Brand.findAll({
            attributes: ["PK_iNhanHangID", "sTenNhanHang"],
            raw: true,
            nest: true,
        });
        if (brands) {
            return {
                errorCode: 0,
                errorMessage: "Danh sách nhãn hàng!",
                data: brands,
            };
        } else {
            return {
                errorCode: 0,
                errorMessage: "Danh sách nhãn hàng trống!",
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

// lấy ds nhãn hàng theo phân trang
const getBrandWithPagination = async (page, limit) => {
    try {
        let offSet = (page - 1) * limit;
        const { count, rows } = await db.Brand.findAndCountAll({
            // include: {
            //     model: db.SupplierProduct,
            //     as: "suppliers",
            // },
            offset: offSet,
            limit: limit,
            raw: true,
            nest: true,
        });

        let totalPage = Math.ceil(count / limit);

        // Convert ảnh sLogo sang dạng base64 để hiển thị ảnh trên client
        if (rows && rows.length > 0) {
            rows.forEach((item) => {
                if (item.sLogo) {
                    item.sLogo = new Buffer(item.sLogo, "base64").toString("binary");
                }
            });
        }

        let data = {
            totalRows: count, //tổng có tất cả bao nhiêu bản ghi
            totalPage: totalPage,
            brands: rows,
        };

        return {
            errorCode: 0,
            errorMessage: "Danh sách nhãn hàng!",
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

//thêm mới nhãn hàng
const createNewBrandService = async (data) => {
    try {
        await db.Brand.create({
            sTenNhanHang: data.brandName,
            sLogo: data.logo,
            sMoTa: data.description || "",
        });

        return {
            errorCode: 0,
            errorMessage: "Thêm mới nhãn hàng thành công!",
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

//cập nhật thông tin nhãn hàng
const updateBrandService = async (data) => {
    try {
        let supplier = await db.Brand.findOne({
            where: { PK_iNhanHangID: data.id },
        });
        if (supplier) {
            await supplier.update({
                sTenNhanHang: data.brandName,
                sLogo: data.logo,
                sMoTa: data.description || "",
            });
            return {
                errorCode: 0,
                errorMessage: "Cập nhật thông tin nhãn hàng thành công!",
                data: [],
            };
        } else {
            return {
                errorCode: -1,
                errorMessage: "Nhãn hàng không tồn tại!",
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

//xóa nhãn hàng
const deleteBrandService = async (id) => {
    try {
        let supplier = await db.Brand.findOne({
            where: { PK_iNhanHangID: id },
        });

        if (supplier) {
            await supplier.destroy();
            return {
                errorCode: 0,
                errorMessage: "Xóa nhãn hàng thành công!",
                data: [],
            };
        } else {
            return {
                errorCode: -1,
                errorMessage: "Nhãn hàng không tồn tại",
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
    getAllBrandService,
    getBrandWithPagination,
    createNewBrandService,
    updateBrandService,
    deleteBrandService,
};
