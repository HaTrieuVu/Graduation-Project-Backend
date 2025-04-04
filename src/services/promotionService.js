import db from "../models/index";

// lấy ncc theo phân trang
const getPromotionWithPagination = async (page, limit, valueSearch) => {
    try {
        let offSet = (page - 1) * limit;
        const whereCondition = valueSearch === "all" ? {} : { FK_iSanPhamID: valueSearch };
        const { count, rows } = await db.Promotion.findAndCountAll({
            attributes: { exclude: ["createdAt", "updatedAt"] },
            where: whereCondition,
            include: {
                model: db.Product,
                as: "product",
                attributes: ["sTenSanPham"],
            },
            offset: offSet,
            limit: limit,
            raw: true,
            nest: true,
        });

        let totalPage = Math.ceil(count / limit);
        let data = {
            totalRows: count, //tổng có tất cả bao nhiêu bản ghi
            totalPage: totalPage,
            promotions: rows,
        };

        return {
            errorCode: 0,
            errorMessage: "Danh sách khuyến mãi!",
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

//thêm mới nhà cung cấp
const createNewPromotionService = async (data) => {
    try {
        // Kiểm tra sản phẩm đã có khuyến mãi chưa
        const existingPromotion = await db.Promotion.findOne({
            where: { FK_iSanPhamID: data.productId },
        });

        if (existingPromotion) {
            return {
                errorCode: 1,
                errorMessage: "Sản phẩm này đã có khuyến mãi!",
            };
        }

        // Nếu chưa có thì tạo mới
        await db.Promotion.create({
            FK_iSanPhamID: data.productId,
            fGiaTriKhuyenMai: data.valuePromotion,
            bTrangThai: data.status,
            sMoTa: data.description || "",
        });

        return {
            errorCode: 0,
            errorMessage: "Thêm mới khuyến mãi thành công!",
        };
    } catch (error) {
        console.log(error);
        return {
            errorCode: 1,
            errorMessage: "Đã xảy ra lỗi - service!",
        };
    }
};

//cập nhật thông tin ncc
const updatePromotionService = async (data) => {
    try {
        let promotion = await db.Promotion.findOne({
            where: { PK_iKhuyenMaiID: data.id },
        });
        if (promotion) {
            await promotion.update({
                fGiaTriKhuyenMai: data.valuePromotion,
                bTrangThai: data.status,
                sMoTa: data.description || "",
            });
            return {
                errorCode: 0,
                errorMessage: "Cập nhật thông tin khuyến mãi thành công!",
            };
        } else {
            return {
                errorCode: -1,
                errorMessage: "Khuyến mãi không tồn tại!",
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

//xóa ncc
const deletePromotionService = async (id) => {
    try {
        let promotion = await db.Promotion.findOne({
            where: { PK_iKhuyenMaiID: id },
        });

        if (promotion) {
            await promotion.destroy();
            return {
                errorCode: 0,
                errorMessage: "Xóa khuyến mãi thành công!",
            };
        } else {
            return {
                errorCode: -1,
                errorMessage: "Khuyến mãi không tồn tại",
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

module.exports = {
    getPromotionWithPagination,
    createNewPromotionService,
    updatePromotionService,
    deletePromotionService,
};
