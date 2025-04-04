import productService from "../services/productService";

//------------------------------ Product

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
            !req.body.id ||
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

// hàm lấy tìm kiếm sản phẩm  (admin)
const searchProduct = async (req, res) => {
    try {
        if (req?.query?.page && req?.query?.limit && req?.query?.keywordSearch) {
            let page = req?.query?.page;
            let limit = req?.query?.limit;
            let keywordSearch = req?.query?.keywordSearch;

            let data = await productService.searchProductService(+page, +limit, keywordSearch);

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

//------------------------------- Product version

// hàm lấy ds sản phẩm - phiên bản (admin)
const getAllProductVersion = async (req, res) => {
    try {
        if (req?.query?.page && req?.query?.limit && req?.query?.valueSearch) {
            let page = req?.query?.page;
            let limit = req?.query?.limit;
            let valueSearch = req?.query?.valueSearch;

            let data = await productService.getProductVersionWithPagination(+page, +limit, valueSearch);

            return res.status(200).json({
                errorCode: data.errorCode,
                errorMessage: data.errorMessage,
                data: data.data,
            });
        } else {
            let data = await productService.getAllProductVersionService();

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

// hàm thêm mới sản phẩm - phiên bản (admin)
const createNewProductVersion = async (req, res) => {
    try {
        if (
            !req.body.productId ||
            !req.body.productImageId ||
            !req.body.capacity ||
            !req.body.price ||
            !req.body.quantity ||
            !req.body.status
        ) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc!",
                data: "",
            });
        }

        let data = await productService.createNewProductVersionService(req.body);

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

// hàm cập nhật sản phẩm - phiên bản (admin)
const updateProductVersion = async (req, res) => {
    try {
        if (
            !req.body.id ||
            !req.body.productId ||
            !req.body.productImageId ||
            !req.body.capacity ||
            !req.body.price ||
            !req.body.quantity ||
            !req.body.status
        ) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc!",
                data: "",
            });
        }

        let data = await productService.updateProductVersionService(req.body);

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

// hàm xóa sản phẩm - phiên bản (admin)
const deleteProductVersion = async (req, res) => {
    try {
        if (req?.body?.id) {
            let data = await productService.deleteProductVersionService(req?.body?.id);

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

//hàm lấy ds hình ảnh của sản phẩm đó (admin)
const getAllImageOfProduct = async (req, res) => {
    try {
        if (req?.query?.id) {
            let data = await productService.getAllImageOfProductService(req?.query?.id);

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

//------------------------------- Product Image

// hàm lấy ds sản phẩm - hình ảnh (admin)
const getAllProductImage = async (req, res) => {
    try {
        if (req?.query?.page && req?.query?.limit && req?.query?.valueSearch) {
            let page = req?.query?.page;
            let limit = req?.query?.limit;
            let valueSearch = req?.query?.valueSearch;

            let data = await productService.getProductImageWithPagination(+page, +limit, valueSearch);

            return res.status(200).json({
                errorCode: data.errorCode,
                errorMessage: data.errorMessage,
                data: data.data,
            });
        } else {
            let data = await productService.getAllProductImageService();

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

// hàm thêm mới sản phẩm - hình ảnh (admin)
const createNewProductImage = async (req, res) => {
    try {
        if (!req.body.productId || !req.body.imgSource) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc!",
                data: "",
            });
        }

        let data = await productService.createNewProductImageService(req.body);

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

// hàm cập nhật sản phẩm - hình ảnh (admin)
const updateProductImage = async (req, res) => {
    try {
        if (!req.body.id || !req.body.productId || !req.body.imgSource) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc!",
                data: "",
            });
        }

        let data = await productService.updateProductImageService(req.body);

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

// hàm xóa sản phẩm - hình ảnh (admin)
const deleteProductImage = async (req, res) => {
    try {
        if (req?.body?.id) {
            let data = await productService.deleteProductImageService(req?.body?.id);

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

//------------------------------------ Client
// hàm lấy ds sản phẩm để hiện thị phía client
const fetchAllProduct = async (req, res) => {
    try {
        if (req?.query?.page && req?.query?.limit) {
            let page = req?.query?.page;
            let limit = req?.query?.limit;

            let data = await productService.fetchAllProductWithPagination(+page, +limit);

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

// hàm lấy thông tin chi tiết của 1 sản phẩm
const getInfoProductSingle = async (req, res) => {
    try {
        if (req?.query?.id) {
            let data = await productService.getInfoProductSingleService(+req?.query?.id);

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

// hàm lấy tìm kiếm sản phẩm theo keyword  (client)
const searchAllProductByKeyword = async (req, res) => {
    try {
        if (req?.query?.page && req?.query?.limit && req?.query?.keywordSearch) {
            let page = req?.query?.page;
            let limit = req?.query?.limit;
            let keywordSearch = req?.query?.keywordSearch;

            let data = await productService.searchAllProductByKeywordService(+page, +limit, keywordSearch);

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
    searchProduct,

    getAllProductVersion,
    createNewProductVersion,
    updateProductVersion,
    deleteProductVersion,
    getAllImageOfProduct,

    getAllProductImage,
    createNewProductImage,
    updateProductImage,
    deleteProductImage,

    fetchAllProduct,
    getInfoProductSingle,
    searchAllProductByKeyword,
};
