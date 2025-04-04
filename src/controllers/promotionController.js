import promotionService from "../services/promotionService";

// hàm lấy ds khuyến mãi (admin)
const getAllPromotion = async (req, res) => {
    try {
        if (req?.query?.page && req?.query?.limit && req?.query?.valueSearch) {
            let page = req?.query?.page;
            let limit = req?.query?.limit;
            let valueSearch = req?.query?.valueSearch;

            let data = await promotionService.getPromotionWithPagination(+page, +limit, valueSearch);

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
        });
    }
};

// hàm thêm mới khuyến mãi (admin)
const createNewPromotion = async (req, res) => {
    try {
        if (!req.body.productId || !req.body.valuePromotion || !req.body.status) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc!",
            });
        }

        let data = await promotionService.createNewPromotionService(req.body);

        return res.status(200).json({
            errorCode: data.errorCode,
            errorMessage: data.errorMessage,
        });
    } catch (error) {
        console.log(">>> ERR", error);
        return res.status(500).json({
            errorCode: -1,
            errorMessage: "Error From Server",
        });
    }
};

// hàm cập nhật khuyến mãi (admin)
const updatePromotion = async (req, res) => {
    try {
        if (!req.body.id || !req.body.valuePromotion || !req.body.status) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc!",
            });
        }

        let data = await promotionService.updatePromotionService(req.body);

        return res.status(200).json({
            errorCode: data.errorCode,
            errorMessage: data.errorMessage,
        });
    } catch (error) {
        console.log(">>> ERR", error);
        return res.status(500).json({
            errorCode: -1,
            errorMessage: "Error From Server",
        });
    }
};

// hàm xóa khuyến mãi (admin)
const deletePromotion = async (req, res) => {
    try {
        if (req?.body?.id) {
            let data = await promotionService.deletePromotionService(req?.body?.id);

            return res.status(200).json({
                errorCode: data.errorCode,
                errorMessage: data.errorMessage,
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

module.exports = {
    getAllPromotion,
    createNewPromotion,
    updatePromotion,
    deletePromotion,
};
