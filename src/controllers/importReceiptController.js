import importReceiptController from "../services/importReceiptService";

// hàm lấy ds đơn nhập hàng
const getAllImportReceipt = async (req, res) => {
    try {
        if (!req?.query?.page || !req?.query?.limit || !req?.query?.valueSearch) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc - order!",
            });
        }

        if (req?.query?.page && req?.query?.limit && req?.query?.valueSearch) {
            let page = req?.query?.page;
            let limit = req?.query?.limit;
            let valueSearch = req?.query?.valueSearch;

            let data = await importReceiptController.getAllImportReceiptService(+page, +limit, valueSearch);

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

// hàm thêm mới đơn nhập hàng (admin)
const createNewImportReceipt = async (req, res) => {
    try {
        if (!req.body.userId || !req.body.supplierId || !req.body.products) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc!",
                data: "",
            });
        }

        let data = await importReceiptController.createNewImportReceiptService(req.body);

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
    getAllImportReceipt,
    createNewImportReceipt,
};
