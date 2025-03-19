import productService from "../services/productService";

// hàm lấy ds sản phẩm (admin)
const getAllProduct = async (req, res) => {
    try {
        if (req?.query?.page && req?.query?.limit) {
            let page = req?.query?.page;
            let limit = req?.query?.limit;

            let data = await productService.getProductWithPagination(+page, +limit);

            return res.status(200).json({
                errorCode: data.errorCode,
                errorMessage: data.errorMessage,
                data: data.data,
            });
        } else {
            let data = await productService.getAllProductService();

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

// hàm thêm mới sản phẩm (admin)
const createNewProduct = async (req, res) => {
    try {
        if (
            !req.body.categoryId ||
            !req.body.brandId ||
            !req.body.productName ||
            !req.body.evaluate ||
            !req.body.status
        ) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc!",
                data: "",
            });
        }

        let data = await productService.createNewProductService(req.body);

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

// hàm cập nhật sản phẩm (admin)
const updateProduct = async (req, res) => {
    try {
        if (
            !req.body.categoryId ||
            !req.body.brandId ||
            !req.body.productName ||
            !req.body.evaluate ||
            !req.body.status
        ) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc!",
                data: "",
            });
        }

        let data = await productService.updateProductService(req.body);

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

// hàm xóa sản phẩm (admin)
const deleteProduct = async (req, res) => {
    try {
        if (req?.body?.id) {
            let data = await productService.deleteProductService(req?.body?.id);

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
    getAllProduct,
    createNewProduct,
    updateProduct,
    deleteProduct,
};
