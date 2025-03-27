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

// hàm lấy thông tin giỏ hàng của người dùng
const getAllInfoToCart = async (req, res) => {
    try {
        if (!req.body.userId || !req.body.cartId) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc!",
                data: "",
            });
        }

        let data = await cartService.getAllInfoToCartService(req.body);

        return res.status(200).json({
            errorCode: data.errorCode,
            errorMessage: data.errorMessage,
            data: data.data,
        });
    } catch (error) {
        return res.status(500).json({
            errorCode: -1,
            errorMessage: "Error From Server",
            data: "",
        });
    }
};

//hàm thêm. giảm số lượng sp trong giỏ hàng
const handleToggleCartQuantity = async (req, res) => {
    try {
        if (
            !req.body.userId ||
            !req.body.cartId ||
            !req.body.cartDetailId ||
            !req.body.productVersionId ||
            !req.body.type
        ) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc!",
            });
        }

        let data = await cartService.handleToggleCartQuantityService(req.body);

        return res.status(200).json({
            errorCode: data.errorCode,
            errorMessage: data.errorMessage,
        });
    } catch (error) {
        return res.status(500).json({
            errorCode: -1,
            errorMessage: "Error From Server",
        });
    }
};

//hàm thêm. giảm số lượng sp trong giỏ hàng
const handleRemoveProductFromCart = async (req, res) => {
    try {
        if (!req.body.userId || !req.body.cartId || !req.body.cartDetailId) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc!",
            });
        }

        let data = await cartService.handleRemoveProductFromCartService(req.body);

        return res.status(200).json({
            errorCode: data.errorCode,
            errorMessage: data.errorMessage,
        });
    } catch (error) {
        return res.status(500).json({
            errorCode: -1,
            errorMessage: "Error From Server",
        });
    }
};

module.exports = {
    handleAddProductToCart,
    getAllInfoToCart,
    handleToggleCartQuantity,
    handleRemoveProductFromCart,
};
