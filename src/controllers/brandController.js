import brandService from "../services/brandService";

// hàm lấy ds nhãn hàng (admin)
const getAllBrand = async (req, res) => {
    try {
        if (req?.query?.page && req?.query?.limit) {
            let page = req?.query?.page;
            let limit = req?.query?.limit;

            let data = await brandService.getBrandWithPagination(+page, +limit);

            return res.status(200).json({
                errorCode: data.errorCode,
                errorMessage: data.errorMessage,
                data: data.data,
            });
        } else {
            let data = await brandService.getAllBrandService();

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

// hàm thêm mới nhãn hàng (admin)
const createNewBrand = async (req, res) => {
    try {
        if (!req.body.brandName || !req.body.logo) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc!",
                data: "",
            });
        }

        let data = await brandService.createNewBrandService(req.body);

        return res.status(200).json({
            errorCode: data.errorCode,
            errorMessage: data.errorMessage,
            data: data.data,
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

// hàm cập nhật nhãn hàng (admin)
const updateBrand = async (req, res) => {
    try {
        let data = await brandService.updateBrandService(req.body);

        return res.status(200).json({
            errorCode: data.errorCode,
            errorMessage: data.errorMessage,
            data: data.data,
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

// hàm xóa nhãn hàng (admin)
const deleteBrand = async (req, res) => {
    try {
        if (req?.body?.id) {
            let data = await brandService.deleteBrandService(req?.body?.id);

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

//-------------- client
// hàm lấy ds sản phẩm theo nhãn hàng
const getAllProductByBrand = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                errorCode: 1,
                errorMessage: "Missing brand ID",
                data: null,
            });
        }
        let data = await brandService.getAllProductByBrandService(+id); // Convert id thành số

        return res.status(200).json({
            errorCode: data.errorCode,
            errorMessage: data.errorMessage,
            data: data.data,
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
    getAllBrand,
    createNewBrand,
    updateBrand,
    deleteBrand,

    getAllProductByBrand,
};
