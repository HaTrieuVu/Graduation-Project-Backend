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
                    attributes: ["sHoTen", "sSoDienThoai", "sDiaChi", "sEmail"],
                },
                {
                    model: db.OrderDetail,
                    as: "orderDetails",
                    attributes: ["FK_iPhienBanID", "iSoLuong", "fGiaBan", "fThanhTien"],
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
            distinct: true,
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
            include: [{ model: db.OrderDetail, as: "orderDetails" }],
        });

        if (!order) {
            return {
                errorCode: -1,
                errorMessage: "Đơn hàng không tồn tại!",
            };
        }

        // Xác định nội dung thông báo
        let message = `Đơn hàng #${data.orderId} đã được xác nhận!`;
        if (data.orderStatus === "Đang giao hàng") {
            message = `Đơn hàng #${data.orderId} đang được giao!`;
        } else if (data.orderStatus === "Giao hàng thành công") {
            message = `Đơn hàng #${data.orderId} đã được giao thành công!`;
        } else if (data.orderStatus === "Đã hủy") {
            message = `Đơn hàng #${data.orderId} đã bị hủy!`;
        }

        // Cập nhật trạng thái đơn hàng
        await order.update({
            sTrangThaiDonHang: data.orderStatus || order.sTrangThaiDonHang,
            sTrangThaiThanhToan: data.paymentStatus || order.sTrangThaiThanhToan,
        });

        // Nếu đơn hàng "Giao hàng thành công", tạo phiếu bảo hành cho từng sản phẩm
        if (data.orderStatus === "Giao hàng thành công" && order.orderDetails.length > 0) {
            const warrantyData = order.orderDetails.map((item) => {
                const ngayLap = new Date();
                const ngayKetThuc = new Date(ngayLap);
                ngayKetThuc.setFullYear(ngayLap.getFullYear() + 1); // Bảo hành 1 năm

                return {
                    FK_iDonMuaHangID: order.PK_iDonMuaHangID,
                    FK_iPhienBanID: item.FK_iPhienBanID,
                    dNgayLap: ngayLap,
                    dNgayKetThucBaoHanh: ngayKetThuc,
                    sTrangThaiXuLy: "Đang bảo hành",
                    sMota: "Bảo hành 12 tháng",
                };
            });
            await db.Warranty.bulkCreate(warrantyData);
        }

        // Nếu đơn hàng bị hủy, hoàn lại số lượng sản phẩm trong đơn
        if (data.orderStatus === "Đã hủy" && order.orderDetails.length > 0) {
            for (const orderDetail of order.orderDetails) {
                let productVersion = await db.ProductVersion.findOne({
                    where: { PK_iPhienBanID: orderDetail.FK_iPhienBanID },
                });

                if (productVersion) {
                    await productVersion.update({
                        iSoLuong: productVersion.iSoLuong + orderDetail.iSoLuong,
                    });
                }
            }
        }

        // Tìm hoặc tạo thông báo mới
        let notification = await db.Notification.findOne({
            where: { FK_iDonMuaHangID: data.orderId },
        });

        if (notification) {
            await notification.update({ sNoiDung: message });
        } else {
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

const getAllPurchaseByUserService = async (userId, type) => {
    try {
        let whereCondition = { FK_iKhachHangID: userId };

        // Bổ sung điều kiện theo type nếu khác 'all'
        if (type && type !== "all") {
            switch (type) {
                case "1":
                    whereCondition.sTrangThaiDonHang = "Chờ xác nhận";
                    break;
                case "2":
                    whereCondition.sTrangThaiDonHang = "Đang giao hàng";
                    break;
                case "3":
                    whereCondition.sTrangThaiDonHang = "Giao hàng thành công";
                    break;
                case "4":
                    whereCondition.sTrangThaiDonHang = "Đã hủy";
                    break;
                default:
                    // Trường hợp type không hợp lệ
                    return {
                        errorCode: 1,
                        errorMessage: "Loại đơn hàng không hợp lệ!",
                        data: [],
                    };
            }
        }

        // Lấy danh sách đơn hàng theo điều kiện đã xử lý ở trên
        let orderList = await db.Order.findAll({
            attributes: { exclude: ["createdAt", "fPhiShip", "FK_iNhanVienID"] },
            where: whereCondition,
            include: [
                {
                    model: db.OrderDetail,
                    as: "orderDetails",
                    attributes: ["FK_iPhienBanID", "iSoLuong", "fGiaBan", "fThanhTien"],
                    include: [
                        {
                            model: db.ProductVersion,
                            as: "productVersion",
                            attributes: ["sDungLuong", "fGiaBan"],
                            include: [
                                {
                                    model: db.Product,
                                    as: "productData",
                                    attributes: ["sTenSanPham"],
                                },
                                {
                                    model: db.ProductImage,
                                    as: "productImages",
                                    attributes: ["sMoTa", "sUrl"],
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        if (orderList && orderList.length > 0) {
            return {
                errorCode: 0,
                errorMessage: "Danh sách đơn mua hàng của user!",
                data: orderList,
            };
        } else {
            return {
                errorCode: 0,
                errorMessage: "Không có đơn mua hàng nào phù hợp!",
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

const handleCancelOrderService = async (data) => {
    try {
        const order = await db.Order.findOne({
            where: { PK_iDonMuaHangID: data.orderId },
            include: [{ model: db.OrderDetail, as: "orderDetails" }],
        });

        if (!order) {
            return {
                errorCode: -1,
                errorMessage: "Đơn hàng không tồn tại!",
            };
        }

        // Kiểm tra đơn hàng có phải của user không
        if (order.FK_iKhachHangID !== data.userId) {
            return {
                errorCode: -2,
                errorMessage: "Bạn không có quyền hủy đơn hàng này!",
            };
        }

        // Cập nhật trạng thái đơn hàng thành "Đã hủy"
        await order.update({
            sTrangThaiDonHang: "Đã hủy",
        });

        // Hoàn lại số lượng tồn kho cho từng phiên bản sản phẩm
        for (const detail of order.orderDetails) {
            const version = await db.ProductVersion.findOne({
                where: { PK_iPhienBanID: detail.FK_iPhienBanID },
            });

            if (version) {
                await version.update({
                    iSoLuong: version.iSoLuong + detail.iSoLuong,
                });
            }
        }

        // Tạo nội dung thông báo
        const message = `Đơn hàng #${data.orderId} đã bị hủy!`;

        // Tìm hoặc tạo thông báo
        const notification = await db.Notification.findOne({
            where: { FK_iDonMuaHangID: data.orderId },
        });

        if (notification) {
            await notification.update({
                sNoiDung: message,
                dThoiGianGui: new Date(),
                sTrangThaiDoc: false,
            });
        } else {
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
            errorMessage: "Hủy đơn hàng thành công!",
        };
    } catch (error) {
        console.log(error);
        return {
            errorCode: 1,
            errorMessage: "Đã xảy ra lỗi - service!",
        };
    }
};

const handleCheckStockService = async (data) => {
    const transaction = await db.sequelize.transaction();
    try {
        for (const item of data.orderDetails) {
            const productVersion = await db.ProductVersion.findOne({
                where: { PK_iPhienBanID: item.productVersionId },
                include: [
                    {
                        model: db.Product,
                        as: "productData",
                        attributes: ["sTenSanPham"],
                    },
                ],
                transaction,
            });

            if (!productVersion) {
                return {
                    errorCode: -3,
                    errorMessage: `Không tìm thấy phiên bản sản phẩm với ID ${item.productVersionId}.`,
                };
            }

            if (productVersion.iSoLuong < item.quantity) {
                return {
                    errorCode: -2,
                    errorMessage: `Sản phẩm "${
                        productVersion.productData?.sTenSanPham || "Không rõ tên"
                    }" không đủ hàng tồn kho.`,
                };
            }
        }

        // Nếu tất cả sản phẩm đều đủ hàng
        return {
            errorCode: 0,
            errorMessage: "Tồn kho đủ để tiếp tục đặt hàng.",
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
    getAllPurchaseByUserService,
    handleCancelOrderService,
    handleCheckStockService,
};
