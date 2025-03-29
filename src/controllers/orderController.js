import orderService from "../services/orderService";

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

module.exports = {
    handleOrderProduct,
};
