import statisticService from "../services/statisticService";

const statisticRevenue = async (req, res) => {
    try {
        let data = await statisticService.statisticRevenueService();

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
    statisticRevenue,
    statisticImportReceipt,
};
