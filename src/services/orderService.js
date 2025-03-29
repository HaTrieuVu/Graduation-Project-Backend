import db from "../models/index";

const handleOrderProductService = async (data) => {
    console.log(data);
    const transaction = await db.sequelize.transaction();
    try {
        // Tạo đơn hàng
        const newOrder = await db.Order.create(
            {
                FK_iKhachHangID: data.userId,
                dNgayLapDon: new Date(),
                fTongTien: data.totalPrice,
                fPhiShip: data.shipFee || 0,
                sPhuongThucThanhToan: data.paymentMethod,
                sTrangThaiDonHang: "Chờ xác nhận",
                sTrangThaiThanhToan: data.statusPayment,
            },
            { transaction }
        );

        // Thêm chi tiết đơn hàng
        const orderDetailsData = data.orderDetails.map((item) => ({
            FK_iDonMuaHangID: newOrder.PK_iDonMuaHangID,
            FK_iPhienBanID: item.productVersionId,
            iSoLuong: item.quantity,
            fGiaGoc: item.price,
            fGiaBan: item.priceNew,
            fThanhTien: item.amount,
        }));

        await db.OrderDetail.bulkCreate(orderDetailsData, { transaction });

        // Thêm thông báo về đơn hàng
        await db.Notification.create(
            {
                FK_iKhachHangID: data.userId,
                FK_iDonMuaHangID: newOrder.PK_iDonMuaHangID,
                sNoiDung: `Đơn hàng #304${newOrder.PK_iDonMuaHangID} đã được đặt thành công!`,
                dThoiGianGui: new Date(),
                sTrangThaiDoc: false,
            },
            { transaction }
        );

        // Xóa thông tin sản phẩm đã đặt trong giỏ hàng
        const cartDetailIds = data.orderDetails.map((item) => item.cartDetailId);
        await db.CartDetail.destroy({
            where: { PK_iChiTietGioHangID: cartDetailIds },
            transaction,
        });

        // Commit transaction nếu mọi thứ thành công
        await transaction.commit();

        return {
            errorCode: 0,
            errorMessage: "Đặt hàng thành công!",
        };
    } catch (error) {
        await transaction.rollback();
        console.log("error from service", error);
        return {
            errorCode: -1,
            errorMessage: "Đã xảy ra lỗi!",
            data: "",
        };
    }
};

module.exports = {
    handleOrderProductService,
};
