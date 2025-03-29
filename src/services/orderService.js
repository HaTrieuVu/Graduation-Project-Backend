import db from "../models/index";

const handleOrderProductService = async (data) => {
    const transaction = await db.sequelize.transaction();
    try {
        // Kiểm tra tồn kho trước khi tạo đơn hàng
        for (const item of data.orderDetails) {
            const productVersion = await db.ProductVersion.findOne({
                where: { PK_iPhienBanID: item.productVersionId },
                transaction,
            });
            if (!productVersion || productVersion.iSoLuong < item.quantity) {
                return {
                    errorCode: -2,
                    errorMessage: `Sản phẩm ID ${item.productVersionId} không đủ hàng tồn kho.`,
                };
            }
            // if (!productVersion || productVersion.iSoLuong < item.quantity) {
            //     throw new Error(`Sản phẩm ID ${item.productVersionId} không đủ hàng tồn kho.`);
            // }
        }

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

        // Tạo phiếu bảo hành
        const warrantyData = data.orderDetails.map((item) => ({
            FK_iDonMuaHangID: newOrder.PK_iDonMuaHangID,
            FK_iPhienBanID: item.productVersionId,
            dNgayLap: newOrder.dNgayLapDon,
            dNgayKetThucBaoHanh: new Date(newOrder.dNgayLapDon.setFullYear(newOrder.dNgayLapDon.getFullYear() + 1)),
            sTrangThaiXuLy: "Đang bảo hành",
            sMota: "Bảo hành 12 tháng",
        }));
        await db.Warranty.bulkCreate(warrantyData, { transaction });

        // Trừ tồn kho của ProductVersion
        for (const item of data.orderDetails) {
            await db.ProductVersion.decrement(
                { iSoLuong: item.quantity },
                { where: { PK_iPhienBanID: item.productVersionId }, transaction }
            );
        }

        // Thêm thông báo về đơn hàng
        await db.Notification.create(
            {
                FK_iKhachHangID: data.userId,
                FK_iDonMuaHangID: newOrder.PK_iDonMuaHangID,
                sNoiDung: `Đơn hàng #34304${newOrder.PK_iDonMuaHangID} đã được đặt thành công!`,
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
