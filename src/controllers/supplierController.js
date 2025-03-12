import supplierService from "../services/supplierService";

// hàm lấy ds nhà cung cấp (admin)
const getAllSupplier = async (req, res) => {
    try {
        if (req?.query?.page && req?.query?.limit) {
            let page = req?.query?.page;
            let limit = req?.query?.limit;

            let data = await supplierService.getUserWithPagination(+page, +limit);

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

// hàm thêm mới nhà cung cấp (admin)
const createNewSupplier = (req, res) => {
    try {
    } catch (error) {
        console.log(">>> ERR", error);
        return res.status(500).json({
            errorCode: -1,
            errorMessage: "Error From Server",
            data: "",
        });
    }
};

// hàm cập nhật nhà cung cấp (admin)
const updateSupplier = (req, res) => {};

// hàm xóa nhà cung cấp (admin)
const deleteSupplier = async (req, res) => {
    try {
        if (req?.body?.id) {
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

module.exports = {
    getAllSupplier,
    createNewSupplier,
    updateSupplier,
    deleteSupplier,
};
