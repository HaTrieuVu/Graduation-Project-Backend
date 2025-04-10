// payment
const axios = require("axios").default;
const CryptoJS = require("crypto-js");
const moment = require("moment");
const qs = require("qs");

// APP INFO
const config = {
    app_id: "553",
    key1: "9phuAOYhan4urywHTh0ndEXiV3pKHr5Q",
    key2: "Iyz2habzyr7AG8SgvoBCbKwKi3UzlLi3",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create",
    endpointCheckStatus: "https://sb-openapi.zalopay.vn/v2/query",
};

// hàm tạo ra dường link để thanh toán với zalopay
const paymentOrderZalopay = async (req, res) => {
    const { items, totalPrice } = req.body;

    const embed_data = {
        // redirecturl: "http://localhost:5173",
    };

    const transID = Math.floor(Math.random() * 1000000);
    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
        app_user: "user123",
        app_time: Date.now(), // miliseconds
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: totalPrice,
        description: `Tran Huy Mobile - Payment for the order #${transID}`,
        bank_code: "",
        callback_url: " https://f6b3-42-116-147-158.ngrok-free.app/api/v1/payment-zalo-pay/callback-success",
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data =
        config.app_id +
        "|" +
        order.app_trans_id +
        "|" +
        order.app_user +
        "|" +
        order.amount +
        "|" +
        order.app_time +
        "|" +
        order.embed_data +
        "|" +
        order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        const result = await axios.post(config.endpoint, null, { params: order });

        return res.status(200).json({
            data: result.data,
            app_trans_id: order.app_trans_id,
        });
    } catch (error) {
        console.log(error);
    }
};

// hàm khi thanh toán thành công
const paymentCallBackSuccess = async (req, res) => {
    console.log(req.body.data);
    let result = {};

    try {
        let dataStr = req.body.data;
        let reqMac = req.body.mac;

        let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

        // kiểm tra callback hợp lệ (đến từ ZaloPay server)
        if (reqMac !== mac) {
            // callback không hợp lệ
            result.return_code = -1;
            result.return_message = "mac not equal";
        } else {
            // thanh toán thành công
            // merchant cập nhật trạng thái cho đơn hàng
            let dataJson = JSON.parse(dataStr, config.key2);
            console.log("update order's status = success where app_trans_id =", dataJson["app_trans_id"]);

            result.return_code = 1;
            result.return_message = "success";
        }
    } catch (ex) {
        result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
        result.return_message = ex.message;
    }

    // thông báo kết quả cho ZaloPay server
    res.json(result);
};

// hàm kiểm tra trạng thái đơn hàng
const paymentCheckStatus = async (req, res) => {
    try {
        let app_trans_id = req.body.app_trans_id;

        if (!app_trans_id) {
            return res.status(400).json({
                errorCode: 1,
                errorMessage: "Thiếu mã giao dịch app_trans_id",
            });
        }

        let postData = {
            app_id: config.app_id,
            app_trans_id: app_trans_id,
        };

        let data = `${postData.app_id}|${postData.app_trans_id}|${config.key1}`;
        postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

        let postConfig = {
            method: "post",
            url: config.endpointCheckStatus, // ✅ Dùng endpoint đúng bản OpenAPI v2
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: qs.stringify(postData),
        };

        const result = await axios(postConfig);
        return res.status(200).json(result.data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            errorCode: 1,
            errorMessage: "Lỗi hệ thống khi kiểm tra trạng thái thanh toán",
        });
    }
};

module.exports = {
    paymentOrderZalopay,
    paymentCallBackSuccess,
    paymentCheckStatus,
};
