import db from "../models/index";

const handleAddProductToCartService = async (data) => {
    console.log(data);
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

module.exports = {
    handleAddProductToCartService,
};
