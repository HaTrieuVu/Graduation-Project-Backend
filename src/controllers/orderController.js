import orderService from "../services/orderService";

// lấy ds đơn hàng (admin)
const getOrdersByStatus = async (req, res) => {
    try {
        if (!req?.query?.page || !req?.query?.limit || !req?.query?.statusOrder) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc - order!",
            });
        }

        if (req?.query?.page && req?.query?.limit && req?.query?.statusOrder) {
            let page = req?.query?.page;
            let limit = req?.query?.limit;
            let statusOrder = req?.query?.statusOrder;

            let data = await orderService.getOrdersByStatusService(+page, +limit, statusOrder);

            return res.status(200).json({
                errorCode: data.errorCode,
                errorMessage: data.errorMessage,
                data: data.data,
            });
        }
    } catch (error) {
        console.log(">>> ERR", error);
        return res.status(500).json({
            errorCode: -1,
            errorMessage: "Error From Server",
            data: "",
        });
    }
};

// hàm cập nhật trang thái đơn hàng
const updateOrderStatus = async (req, res) => {
    try {
        if ((!req.body.orderId && !req.body.orderStatus) || (!req.body.orderId && !req.body.paymentStatus)) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc - order!",
            });
        }

        let data = await orderService.updateOrderStatusService(req.body);

        return res.status(200).json({
            errorCode: data.errorCode,
            errorMessage: data.errorMessage,
        });
    } catch (error) {
        console.log(">>> ERR", error);
        return res.status(500).json({
            errorCode: -1,
            errorMessage: "Error From Server",
            data: "",
        });
    }
};

//hàm đặt đơn mua hàng (khách hàng)
const handleOrderProduct = async (req, res) => {
    try {
        if (
            !req.body.userId ||
            !req.body.totalPrice ||
            !req.body.statusPayment ||
            !req.body.paymentMethod ||
            !req.body.orderDetails
        ) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc - order!",
            });
        }

        let data = await orderService.handleOrderProductService(req.body);

        return res.status(200).json({
            errorCode: data.errorCode,
            errorMessage: data.errorMessage,
        });
    } catch (error) {
        console.log(">>> ERR", error);
        return res.status(500).json({
            errorCode: -1,
            errorMessage: "Error From Server",
            data: "",
        });
    }
};

// hàm lấy thông tin các đơn đặt hàng của người dùng
const getAllPurchaseByUser = async (req, res) => {
    try {
        if (!req?.query?.userId || !req?.query?.type) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc - order!",
            });
        }

        if (req?.query?.userId && req?.query?.type) {
            let userId = req?.query?.userId;
            let type = req?.query?.type;

            let data = await orderService.getAllPurchaseByUserService(userId, type);

            return res.status(200).json({
                errorCode: data.errorCode,
                errorMessage: data.errorMessage,
                data: data.data,
            });
        }
    } catch (error) {}
};

// hàm hủy đơn đặt hàng (client)
const handleCancelOrder = async (req, res) => {
    try {
        if (!req.body.orderId && !req.body.orderStatus) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc - order!",
            });
        }

        let data = await orderService.handleCancelOrderService(req.body);

        return res.status(200).json({
            errorCode: data.errorCode,
            errorMessage: data.errorMessage,
        });
    } catch (error) {
        console.log(">>> ERR", error);
        return res.status(500).json({
            errorCode: -1,
            errorMessage: "Error From Server",
            data: "",
        });
    }
};

// hàm check số lượng tồn kho trước khi mua
const handleCheckStock = async (req, res) => {
    try {
        if (!req.body.orderDetails) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc - order!",
            });
        }

        let data = await orderService.handleCheckStockService(req.body);

        return res.status(200).json({
            errorCode: data.errorCode,
            errorMessage: data.errorMessage,
        });
    } catch (error) {
        console.log(">>> ERR", error);
        return res.status(500).json({
            errorCode: -1,
            errorMessage: "Error From Server",
            data: "",
        });
    }
};

module.exports = {
    getOrdersByStatus,
    updateOrderStatus,
    handleOrderProduct,
    getAllPurchaseByUser,
    handleCancelOrder,
    handleCheckStock,
};
