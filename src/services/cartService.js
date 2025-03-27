import db from "../models/index";

const handleAddProductToCartService = async (data) => {
    try {
        // Kiểm tra xem giỏ hàng có tồn tại không
        const cart = await db.Cart.findOne({
            where: { PK_iGioHangID: data.cardId, FK_iKhachHangID: data.userId },
        });

        if (!cart) {
            return {
                errorCode: 1,
                errorMessage: "Giỏ hàng không tồn tại!",
            };
        }

        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
        let cartDetail = await db.CartDetail.findOne({
            where: {
                FK_iGioHangID: data.cardId,
                FK_iPhienBanID: data.productVersionId,
            },
        });

        if (cartDetail) {
            // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
            await cartDetail.update({
                iSoLuong: cartDetail.iSoLuong + data.quantity,
            });
        } else {
            // Nếu chưa có, thêm mới vào giỏ hàng
            cartDetail = await db.CartDetail.create({
                FK_iGioHangID: data.cardId,
                FK_iPhienBanID: data.productVersionId,
                iSoLuong: data.quantity,
            });
        }

        return {
            errorCode: 0,
            errorMessage: "Thêm vào giỏ hàng thành công!",
            data: [],
        };
    } catch (error) {
        console.log("Lỗi khi thêm vào giỏ hàng:", error);
        return {
            errorCode: -1,
            errorMessage: "Đã xảy ra lỗi!",
        };
    }
};

const getAllInfoToCartService = async (data) => {
    try {
        // Kiểm tra xem giỏ hàng có tồn tại không
        const cart = await db.Cart.findOne({
            where: { PK_iGioHangID: data?.cartId, FK_iKhachHangID: data?.userId },
            attributes: { exclude: ["createdAt", "updatedAt"] },
            include: [
                {
                    model: db.CartDetail,
                    as: "cartDetails",
                    attributes: { exclude: ["createdAt", "updatedAt"] },
                    include: [
                        {
                            model: db.ProductVersion,
                            as: "productVersions",
                            attributes: ["FK_iSanPhamID", "FK_iHinhAnhID", "sDungLuong", "fGiaBan"],
                            include: [
                                {
                                    model: db.ProductImage,
                                    as: "productImages",
                                    attributes: ["sUrl", "sMoTa"],
                                },
                                {
                                    model: db.Product,
                                    as: "productData",
                                    attributes: ["sTenSanPham", "sDanhGia"],
                                    include: [
                                        {
                                            model: db.Promotion,
                                            as: "promotion",
                                            attributes: ["fGiaTriKhuyenMai"],
                                        },
                                        {
                                            model: db.Brand,
                                            as: "brandData",
                                            attributes: ["sTenNhanHang"],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        if (!cart) {
            return {
                errorCode: 1,
                errorMessage: "Giỏ hàng không tồn tại!",
                data: [],
            };
        }

        // Kiểm tra nếu giỏ hàng tồn tại nhưng không có sản phẩm nào
        if (!cart.cartDetails || cart.cartDetails.length === 0) {
            return {
                errorCode: 2,
                errorMessage: "Giỏ hàng trống!",
                data: [],
            };
        }

        return {
            errorCode: 0,
            errorMessage: "Lấy thông tin giỏ hàng thành công!",
            data: cart,
        };
    } catch (error) {
        console.error("Lỗi khi lấy thông tin giỏ hàng:", error);
        return {
            errorCode: -1,
            errorMessage: "Đã xảy ra lỗi trong hệ thống!",
        };
    }
};

module.exports = {
    handleAddProductToCartService,
    getAllInfoToCartService,
};
