import db from "../models/index";

// lấy ds đơn mua hàng theo trạng thái (admin - phân trang)
const getOrdersByStatusService = async (page, limit, statusOrder) => {
    try {
        let offSet = (page - 1) * limit;
        const whereCondition = statusOrder === "all" ? {} : { sTrangThaiDonHang: statusOrder };

        const { count, rows } = await db.Order.findAndCountAll({
            attributes: { exclude: ["createdAt", "updatedAt", "fPhiShip", "FK_iNhanVienID"] },
            where: whereCondition,
            include: [
                {
                    model: db.Customer,
                    as: "customer",
                    attributes: ["sHoTen", "sSoDienThoai", "sDiaChi"],
                },
                {
                    model: db.OrderDetail,
                    as: "orderDetails",
                    attributes: ["FK_iPhienBanID"],
                    include: [
                        {
                            model: db.ProductVersion,
                            as: "productVersion",
                            attributes: ["sDungLuong"],
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
                        },
                    ],
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
            orders: rows,
        };

        return {
            errorCode: 0,
            errorMessage: "Danh sách đơn mua hàng!",
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

//cập nhật trạng thái đơn hàng (admin)
const updateOrderStatusService = async (data) => {
    try {
        let order = await db.Order.findOne({
            where: { PK_iDonMuaHangID: data.orderId },
        });

        if (!order) {
            return {
                errorCode: -1,
                errorMessage: "Đơn hàng không tồn tại!",
            };
        }

        // Cập nhật trạng thái đơn hàng nếu có
        await order.update({
            sTrangThaiDonHang: data.orderStatus || order.sTrangThaiDonHang,
            sTrangThaiThanhToan: data.paymentStatus || order.sTrangThaiThanhToan,
        });

        // Tìm thông báo của đơn hàng
        let notification = await db.Notification.findOne({
            where: { FK_iDonMuaHangID: data.orderId },
        });

        const message = `Đơn hàng #34304${data.orderId} đã được xác nhận!`;

        if (notification) {
            // Cập nhật nội dung thông báo
            await notification.update({ sNoiDung: message });
        } else {
            // Tạo thông báo mới nếu không tìm thấy
            await db.Notification.create({
                FK_iKhachHangID: order.FK_iKhachHangID,
                FK_iDonMuaHangID: data.orderId,
                sNoiDung: message,
                dThoiGianGui: new Date(),
                sTrangThaiDoc: false,
            });
        }

        return {
            errorCode: 0,
            errorMessage: "Cập nhật trạng thái đơn hàng thành công!",
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
    getOrdersByStatusService,
    updateOrderStatusService,
    handleOrderProductService,
};
