import db from "../models/index";

const getNotificationService = async (id) => {
    try {
        let notification = await db.Notification.findAll({
            where: { FK_iKhachHangID: id },
            attributes: ["sNoiDung", "PK_iThongBaoID", "dThoiGianGui"],
            include: [
                {
                    model: db.Order,
                    as: "order",
                    attributes: [],
                    include: [
                        {
                            model: db.OrderDetail,
                            as: "orderDetails",
                            attributes: [],
                            include: [
                                {
                                    model: db.ProductVersion,
                                    as: "productVersion",
                                    attributes: [],
                                    include: [
                                        {
                                            model: db.ProductImage,
                                            as: "productImages",
                                            attributes: ["sUrl"],
                                        },
                                        {
                                            model: db.Product,
                                            as: "productData",
                                            attributes: ["sTenSanPham"],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            order: [["dThoiGianGui", "DESC"]],
            raw: true,
            nest: true,
        });

        if (notification) {
            return {
                errorCode: 0,
                errorMessage: "Thông tin thông báo đơn hàng!",
                data: notification,
            };
        } else {
            return {
                errorCode: -1,
                errorMessage: "Không có thông báo nào",
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

const deleteNotificationService = async (id) => {
    try {
        let notification = await db.Notification.findOne({
            where: { PK_iThongBaoID: id },
        });

        if (notification) {
            await notification.destroy();
            return {
                errorCode: 0,
                errorMessage: "Xóa thông báo thành công!",
            };
        } else {
            return {
                errorCode: -1,
                errorMessage: "Không tìm thấy thông báo!",
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
    getNotificationService,
    deleteNotificationService,
};
