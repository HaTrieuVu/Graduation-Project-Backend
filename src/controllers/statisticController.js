import statisticService from "../services/statisticService";

const statisticRevenueByMonth = async (req, res) => {
    try {
        let data = await statisticService.statisticRevenueByMonthService();

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

const statisticRevenueByWeek = async (req, res) => {
    let month = req?.query?.month;
    let year = req?.query?.year;
    try {
        let data = await statisticService.statisticRevenueByWeekService(month, year);

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

const statisticImportReceipt = async (req, res) => {
    try {
        let data = await statisticService.statisticImportReceiptService();

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
    statisticRevenueByMonth,
    statisticRevenueByWeek,
    statisticImportReceipt,
};
