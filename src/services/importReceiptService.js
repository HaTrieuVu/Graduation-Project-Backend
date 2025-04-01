import db from "../models/index";

const getAllImportReceiptService = async (page, limit, valueSearch) => {
    try {
        let offSet = (page - 1) * limit;
        let whereCondition = {}; // Điều kiện lọc

        if (valueSearch && valueSearch !== "all") {
            whereCondition.dNgayLap = {
                [db.Sequelize.Op.between]: [`${valueSearch} 00:00:00`, `${valueSearch} 23:59:59`],
            };
        }

        const { count, rows } = await db.ImportReceipt.findAndCountAll({
            where: whereCondition, // Áp dụng điều kiện lọc
            attributes: { exclude: ["createdAt", "updatedAt"] },
            include: [
                {
                    model: db.Supplier,
                    as: "supplier",
                    attributes: ["sTenNhaCungCap"],
                },
                {
                    model: db.ImportReceiptDetail,
                    as: "importDetails",
                    attributes: ["iSoLuongNhap", "fGiaNhap", "fThanhTien"],
                    include: [
                        {
                            model: db.ProductVersion,
                            as: "productVersion",
                            attributes: ["sDungLuong"],
                            include: [
                                {
                                    model: db.Product,
                                    as: "productData",
                                    attributes: ["sTenSanPham"],
                                },
                                {
                                    model: db.ProductImage,
                                    as: "productImages",
                                    attributes: ["sMoTa"],
                                },
                            ],
                        },
                    ],
                },
                {
                    model: db.Employee,
                    as: "employee",
                    attributes: ["sHoTen"],
                },
            ],
            offset: offSet,
            limit: limit,
            distinct: true,
        });

        let totalPage = Math.ceil(count / limit);
        let data = {
            totalRows: count, // tổng có tất cả bao nhiêu bản ghi
            totalPage: totalPage,
            importReceipts: rows,
        };

        return {
            errorCode: 0,
            errorMessage: "Danh sách đơn nhập hàng!",
            data: data,
        };
    } catch (error) {
        console.log(error);
        return {
            errorCode: 1,
            errorMessage: "Đã xảy ra lỗi - service!",
            data: [],
        };
    }
};

//thêm mới danh mục sản phẩm
const createNewImportReceiptService = async (data) => {
    try {
        const { supplierId, userId, products, note } = data;

        // Kiểm tra dữ liệu đầu vào
        if (!supplierId) return { errorCode: 1, errorMessage: "Nhà cung cấp không được để trống!" };
        if (!userId) return { errorCode: 1, errorMessage: "Người tạo không được để trống!" };
        if (!products || products.length === 0)
            return { errorCode: 1, errorMessage: "Danh sách sản phẩm không hợp lệ!" };

        // Kiểm tra nhà cung cấp và nhân viên
        const supplier = await db.Supplier.findByPk(supplierId);
        if (!supplier) return { errorCode: 1, errorMessage: "Nhà cung cấp không tồn tại!" };

        const user = await db.Customer.findByPk(userId);
        if (!user) return { errorCode: 1, errorMessage: "Nhân viên không tồn tại!" };

        let totalAmount = 0;

        // Tạo phiếu nhập hàng
        const importReceipt = await db.ImportReceipt.create({
            FK_iNhaCungCapID: supplierId,
            FK_iNhanVienID: userId,
            fTongTien: 0,
            dNgayLap: new Date(),
            sGhiChu: note || "",
        });

        // Xử lý từng sản phẩm
        for (let product of products) {
            const { productName, capacity, color, quantity, importPrice } = product;

            if (!productName || !capacity || !color || !quantity || !importPrice) {
                return { errorCode: 1, errorMessage: "Thiếu thông tin sản phẩm!" };
            }
            if (quantity <= 0 || importPrice <= 0) {
                return { errorCode: 1, errorMessage: "Số lượng và giá nhập phải lớn hơn 0!" };
            }

            // Kiểm tra xem sản phẩm đã tồn tại chưa
            let existingProduct = await db.Product.findOne({
                where: { sTenSanPham: productName },
                include: [{ model: db.ProductVersion, as: "versions" }],
            });

            let productId, versionId;

            if (!existingProduct) {
                // Nếu sản phẩm chưa tồn tại, tạo mới
                const newProduct = await db.Product.create({
                    sTenSanPham: productName,
                });

                // Thêm khuyến mãi mặc định 5%
                await db.Promotion.create({
                    FK_iSanPhamID: newProduct.PK_iSanPhamID,
                    sMoTa: "Khuyến mãi mặc định",
                    fGiaTriKhuyenMai: 5, // 5%
                    bTrangThai: true,
                });

                const newImage = await db.ProductImage.create({
                    FK_iSanPhamID: newProduct.PK_iSanPhamID,
                    sMoTa: color,
                });

                const newVersion = await db.ProductVersion.create({
                    FK_iSanPhamID: newProduct.PK_iSanPhamID,
                    sDungLuong: capacity,
                    fGiaBan: importPrice * 1.1,
                    iSoLuong: quantity,
                    bTrangThai: false,
                    FK_iHinhAnhID: newImage.PK_iHinhAnhID,
                });

                productId = newProduct.PK_iSanPhamID;
                versionId = newVersion.PK_iPhienBanID;
            } else {
                productId = existingProduct.PK_iSanPhamID;
                let existingVersion = existingProduct.versions.find((v) => v.sDungLuong === capacity);

                let existingImage = await db.ProductImage.findOne({
                    where: { FK_iSanPhamID: productId, sMoTa: color },
                });

                if (existingVersion && existingImage && existingVersion.FK_iHinhAnhID === existingImage.PK_iHinhAnhID) {
                    await db.ProductVersion.update(
                        { iSoLuong: db.sequelize.literal(`iSoLuong + ${quantity}`) },
                        { where: { PK_iPhienBanID: existingVersion.PK_iPhienBanID } }
                    );
                    versionId = existingVersion.PK_iPhienBanID;
                } else {
                    if (!existingImage) {
                        existingImage = await db.ProductImage.create({
                            FK_iSanPhamID: productId,
                            sMoTa: color,
                        });
                    }
                    const newVersion = await db.ProductVersion.create({
                        FK_iSanPhamID: productId,
                        sDungLuong: capacity,
                        fGiaBan: importPrice * 1.1,
                        iSoLuong: quantity,
                        bTrangThai: true,
                        FK_iHinhAnhID: existingImage.PK_iHinhAnhID,
                    });
                    versionId = newVersion.PK_iPhienBanID;
                }
            }

            const totalPrice = quantity * importPrice;
            totalAmount += totalPrice;

            // Thêm vào chi tiết phiếu nhập
            await db.ImportReceiptDetail.create({
                FK_iPhieuNhapID: importReceipt.PK_iPhieuNhapID,
                FK_iPhienBanID: versionId,
                iSoLuongNhap: quantity,
                fGiaNhap: importPrice,
                fThanhTien: quantity * importPrice,
            });
        }

        // Cập nhật tổng tiền vào phiếu nhập hàng
        await importReceipt.update({ fTongTien: totalAmount });

        return {
            errorCode: 0,
            errorMessage: "Thêm mới đơn nhập hàng thành công!",
        };
    } catch (error) {
        console.error(error);
        return {
            errorCode: 1,
            errorMessage: "Đã xảy ra lỗi - service!",
        };
    }
};

module.exports = {
    getAllImportReceiptService,
    createNewImportReceiptService,
};
