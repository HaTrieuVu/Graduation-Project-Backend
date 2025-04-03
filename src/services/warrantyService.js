import db from "../models/index";

const getAllWarrantyService = async (page, limit, keywordSearch) => {
    try {
        let offSet = (page - 1) * limit;
        let whereCondition = {}; // nếu là all thì dk rỗng

        if (keywordSearch && keywordSearch !== "all") {
            if (/^\d{1,6}$/.test(keywordSearch)) {
                // Giả sử mã phiếu bảo hành chỉ tối đa 6 chữ số
                whereCondition.PK_iPhieuBaoHanhID = keywordSearch;
            } else if (/^\d{4}-\d{2}-\d{2}$/.test(keywordSearch)) {
                whereCondition.dNgayLap = {
                    [db.Sequelize.Op.between]: [`${keywordSearch} 00:00:00`, `${keywordSearch} 23:59:59`],
                };
            } else {
                whereCondition[db.Sequelize.Op.or] = [
                    { "$order.customer.sHoTen$": { [db.Sequelize.Op.like]: `%${keywordSearch}%` } },
                    { "$order.customer.sSoDienThoai$": { [db.Sequelize.Op.like]: `%${keywordSearch}%` } },
                ];
            }
        }

        const { count, rows } = await db.Warranty.findAndCountAll({
            attributes: { exclude: ["createdAt", "updatedAt"] },
            where: whereCondition,
            include: [
                {
                    model: db.Order,
                    as: "order",
                    attributes: ["FK_iKhachHangID"],
                    include: [
                        {
                            model: db.Customer,
                            as: "customer",
                            attributes: ["sHoTen", "sSoDienThoai", "sDiaChi", "sEmail"],
                        },
                        {
                            model: db.OrderDetail,
                            as: "orderDetails",
                            attributes: ["iSoLuong", "fGiaBan", "FK_iPhienBanID"],
                        },
                    ],
                },
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
            offset: offSet,
            limit: limit,
            distinct: true,
        });

        let totalPage = Math.ceil(count / limit);
        let data = {
            totalRows: count, // tổng có tất cả bao nhiêu bản ghi
            totalPage: totalPage,
            warranties: rows,
        };

        return {
            errorCode: 0,
            errorMessage: "Danh sách phiếu bảo hành!",
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

const updateWarrantyService = async (data) => {
    try {
        let warranty = await db.Warranty.findOne({
            where: { PK_iPhieuBaoHanhID: data.id },
        });
        if (warranty) {
            await warranty.update({
                dNgayLap: data.createDate,
                dNgayKetThucBaoHanh: data.endDate,
                sTrangThaiXuLy: data.status,
                sMota: data.description,
            });
            return {
                errorCode: 0,
                errorMessage: "Cập nhật thông tin phiếu bảo hành thành công!",
            };
        } else {
            return {
                errorCode: -1,
                errorMessage: "Phiếu bảo hành không tồn tại!",
            };
        }
    } catch (error) {
        console.log(error);
        return {
            errorCode: 1,
            errorMessage: "Đã xảy ra lỗi - service!",
        };
    }
};

module.exports = {
    getAllWarrantyService,
    updateWarrantyService,
};
