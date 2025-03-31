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

const handleToggleCartQuantityService = async ({ userId, cartId, cartDetailId, productVersionId, type }) => {
    try {
        const cart = await db.Cart.findOne({
            where: { PK_iGioHangID: cartId, FK_iKhachHangID: userId },
        });

        if (!cart) {
            return {
                errorCode: 1,
                errorMessage: "Giỏ hàng không hợp lệ!",
            };
        }

        // Tìm chi tiết giỏ hàng
        const cartDetail = await db.CartDetail.findOne({
            where: { PK_iChiTietGioHangID: cartDetailId, FK_iGioHangID: cartId },
        });

        if (!cartDetail) {
            return { errorCode: 2, errorMessage: "Sản phẩm không tồn tại trong giỏ hàng." };
        }

        // Lấy thông tin sản phẩm từ ProductVersion
        const productVersion = await db.ProductVersion.findOne({
            where: { PK_iPhienBanID: productVersionId },
        });

        if (!productVersion) {
            return { errorCode: 3, errorMessage: "Phiên bản sản phẩm không hợp lệ." };
        }

        let newQuantity = cartDetail.iSoLuong;

        // Xử lý tăng/giảm số lượng
        if (type === "INC") {
            newQuantity += 1;
        } else if (type === "DEC") {
            newQuantity -= 1;
        }

        // Kiểm tra giới hạn số lượng
        if (newQuantity > productVersion.iSoLuong) {
            newQuantity = productVersion.iSoLuong;
            await cartDetail.update({ iSoLuong: newQuantity });
            return { errorCode: 5, errorMessage: "Số lượng mua không thể vượt quá tồn kho của sản phẩm!" };
        } else if (newQuantity < 1) {
            return { errorCode: 4, errorMessage: "Số lượng sản phẩm trong giỏ hàng không thể nhỏ hơn 1." };
        }

        // Cập nhật số lượng trong CartDetail
        // await cartDetail.update({ iSoLuong: newQuantity });

        return { errorCode: 0, errorMessage: "Cập nhật số lượng thành công." };
    } catch (error) {
        console.error("Lỗi cập nhật giỏ hàng:", error);
        return { errorCode: 500, errorMessage: "Lỗi server." };
    }
};

const handleRemoveProductFromCartService = async ({ userId, cartId, cartDetailId }) => {
    try {
        const cart = await db.Cart.findOne({
            where: { PK_iGioHangID: cartId, FK_iKhachHangID: userId },
        });

        if (!cart) {
            return {
                errorCode: 1,
                errorMessage: "Giỏ hàng không hợp lệ!",
            };
        }

        // Tìm chi tiết giỏ hàng
        const cartDetail = await db.CartDetail.findOne({
            where: { PK_iChiTietGioHangID: cartDetailId, FK_iGioHangID: cartId },
        });

        if (!cartDetail) {
            return { errorCode: 2, errorMessage: "Sản phẩm không tồn tại trong giỏ hàng." };
        }

        // Xóa sản phẩm khỏi giỏ hàng
        await cartDetail.destroy();

        return { errorCode: 0, errorMessage: "Xóa sản phẩm khỏi giỏ hàng thành công." };
    } catch (error) {
        console.error("Lỗi xóa sản phẩm khỏi giỏ hàng:", error);
        return { errorCode: 500, errorMessage: "Lỗi server." };
    }
};

module.exports = {
    handleAddProductToCartService,
    getAllInfoToCartService,
    handleToggleCartQuantityService,
    handleRemoveProductFromCartService,
};
