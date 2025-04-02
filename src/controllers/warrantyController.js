import warrantyService from "../services/warrantyService";

// hàm lấy ds nhà cung cấp (admin)
const getAllWarranty = async (req, res) => {
    try {
        if (!req?.query?.page || !req?.query?.limit) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc - order!",
            });
        }

        if (req?.query?.page && req?.query?.limit) {
            let page = req?.query?.page;
            let limit = req?.query?.limit;

            let data = await warrantyService.getAllWarrantyService(+page, +limit);

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

// hàm cập nhật phiếu bảo hành (admin)
const updateWarranty = async (req, res) => {
    try {
        if (!req?.body?.id) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc - order!",
            });
        }

        let data = await warrantyService.updateWarrantyService(req.body);

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
    getAllWarranty,
    updateWarranty,
};
