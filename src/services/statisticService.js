import db from "../models/index";

const { Op, fn, col, literal } = require("sequelize");

const statisticRevenueByMonthService = async () => {
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

const statisticRevenueByWeekService = async (month, year) => {
    try {
        const startDate = new Date(year, month - 1, 1); // ngày đầu tháng
        const endDate = new Date(year, month, 0); // ngày cuối tháng

        const orders = await db.Order.findAll({
            attributes: [
                [db.sequelize.literal(`FLOOR((DAY(dNgayLapDon) - 1) / 7) + 1`), "week"],
                [db.sequelize.fn("SUM", db.sequelize.col("fTongTien")), "revenue"],
            ],
            where: {
                dNgayLapDon: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate,
                },
                sTrangThaiDonHang: "Giao hàng thành công",
            },
            group: [db.sequelize.literal(`FLOOR((DAY(dNgayLapDon) - 1) / 7) + 1`)],
            order: [db.sequelize.literal(`week ASC`)],
            raw: true,
        });

        // Chuẩn bị 4 tuần (tuần 1, tuần 2, tuần 3, tuần 4)
        const data = Array.from({ length: 4 }, (_, index) => ({
            name: `Tuần ${index + 1}`,
            revenue: 0,
        }));

        orders.forEach((item) => {
            const weekIndex = item.week - 1;
            if (weekIndex >= 0 && weekIndex < 4) {
                data[weekIndex].revenue = Number((item.revenue / 1000000).toFixed(1));
            }
        });

        return {
            errorCode: 0,
            errorMessage: "Thống kê doanh thu theo tuần thành công!",
            data,
        };
    } catch (error) {
        console.error("Error in statisticRevenueByWeekService:", error);
        return {
            errorCode: 1,
            errorMessage: "Lỗi server",
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
    statisticRevenueByMonthService,
    statisticRevenueByWeekService,
    statisticImportReceiptService,
};
