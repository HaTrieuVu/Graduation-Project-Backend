import notificationService from "../services/notificationService";

const getNotification = async (req, res) => {
    try {
        if (!req?.query?.id) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc - notify!",
            });
        }

        let data = await notificationService.getNotificationService(req?.query?.id);

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

const deleteNotification = async (req, res) => {
    try {
        if (!req?.body?.notificationId) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: "Thiếu tham số bắt buộc - notify!",
            });
        }

        let data = await notificationService.deleteNotificationService(req?.body?.notificationId);

        return res.status(200).json({
            errorCode: data.errorCode,
            errorMessage: data.errorMessage,
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
    getNotification,
    deleteNotification,
};
