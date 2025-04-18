import db from "../models/index";

const { Op, fn, col, literal } = require("sequelize");

const statisticRevenueService = async () => {
    try {
        const result = await db.Order.findAll({
            attributes: [
                [fn("MONTH", col("dNgayLapDon")), "month"],
                [fn("SUM", col("fTongTien")), "revenue"],
            ],
            where: {
                dNgayLapDon: {
                    [Op.gte]: new Date("2025-01-01"),
                    [Op.lte]: new Date("2025-12-31"),
                },
                sTrangThaiDonHang: "Giao hàng thành công",
            },
            group: [fn("MONTH", col("dNgayLapDon"))],
            order: [[fn("MONTH", col("dNgayLapDon")), "ASC"]],
            raw: true,
        });

        // Khởi tạo mảng 12 tháng với giá trị mặc định là 0
        const data = Array.from({ length: 12 }, (_, index) => ({
            name: `Tháng ${index + 1}`,
            revenue: 0,
        }));

        // Gán doanh thu thực tế vào mảng
        result.forEach((item) => {
            const monthIndex = item.month - 1; // tháng bắt đầu từ 1
            data[monthIndex].revenue = Number((item.revenue / 1000000).toFixed(1));
        });

        return {
            errorCode: 0,
            errorMessage: "Dữ liệu thống kê bán hàng!",
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

const statisticImportReceiptService = async () => {
    try {
        const result = await db.ImportReceipt.findAll({
            attributes: [
                [fn("MONTH", col("dNgayLap")), "month"],
                [fn("SUM", col("fTongTien")), "totalImport"],
            ],
            where: {
                dNgayLap: {
                    [Op.gte]: new Date("2025-01-01"),
                    [Op.lte]: new Date("2025-12-31"),
                },
            },
            group: [fn("MONTH", col("dNgayLap"))],
            order: [[fn("MONTH", col("dNgayLap")), "ASC"]],
            raw: true,
        });

        // Khởi tạo mảng 12 tháng với giá trị mặc định là 0
        const data = Array.from({ length: 12 }, (_, index) => ({
            name: `Tháng ${index + 1}`,
            totalImport: 0,
        }));

        // Gán tổng tiền nhập thực tế vào mảng
        result.forEach((item) => {
            const monthIndex = item.month - 1;
            data[monthIndex].totalImport = Number((item.totalImport / 1000000).toFixed(1));
        });

        return {
            errorCode: 0,
            errorMessage: "Dữ liệu thống kê nhập hàng!",
            data: data,
        };
    } catch (error) {
        console.log(error);
        return {
            errorCode: 1,
            errorMessage: "Đã xảy ra lỗi khi thống kê nhập hàng!",
            data: [],
        };
    }
};

module.exports = {
    statisticRevenueService,
    statisticImportReceiptService,
};
