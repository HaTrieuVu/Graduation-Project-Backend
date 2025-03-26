import cartService from "../services/cartService";

// hàm thêm sp vào giỏ hàng
const handleAddProductToCart = async (req, res) => {
    try {
        if (!req.body.userId || !req.body.cardId || !req.body.productVersionId || !req.body.quantity) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc!",
                data: "",
            });
        }

        let data = await cartService.handleAddProductToCartService(req.body);

        return res.status(200).json({
            errorCode: data.errorCode,
            errorMessage: data.errorMessage,
            data: "",
        });
    } catch (error) {
        return res.status(500).json({
            errorCode: -1,
            errorMessage: "Error From Server",
            data: "",
        });
    }
};

module.exports = {
    handleAddProductToCart,
};
