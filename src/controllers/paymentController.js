// payment
const axios = require("axios");
const CryptoJS = require("crypto-js");
const moment = require("moment");
const qs = require("qs");
const crypto = require("crypto");

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

// hàm khi thanh toán thành công (ZaloPay)
const paymentZaloPayCallBackSuccess = async (req, res) => {
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

// hàm kiểm tra trạng thái đơn hàng (ZaloPay)
const paymentZaloPayCheckStatus = async (req, res) => {
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

//---------------------------------MoMo
// hàm tạo ra dường link để thanh toán với MoMo
const paymentOrderMoMo = async (req, res) => {
    const { items, totalPrice } = req.body;

    //parameters
    var accessKey = "F8BBA842ECF85";
    var secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    var orderInfo = "Trần Huy Mobile - thanh toán MoMo";
    var partnerCode = "MOMO";
    var redirectUrl = "https://www.momo.vn/";
    var ipnUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
    var requestType = "payWithMethod";
    var amount = totalPrice;
    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
    var extraData = "";
    var orderGroupId = "";
    var autoCapture = true;
    var lang = "vi";

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature =
        "accessKey=" +
        accessKey +
        "&amount=" +
        amount +
        "&extraData=" +
        extraData +
        "&ipnUrl=" +
        ipnUrl +
        "&orderId=" +
        orderId +
        "&orderInfo=" +
        orderInfo +
        "&partnerCode=" +
        partnerCode +
        "&redirectUrl=" +
        redirectUrl +
        "&requestId=" +
        requestId +
        "&requestType=" +
        requestType;
    //signature

    var signature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        lang: lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData: extraData,
        orderGroupId: orderGroupId,
        signature: signature,
    });
    const options = {
        method: "POST",
        url: "https://test-payment.momo.vn/v2/gateway/api/create",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(requestBody),
        },
        data: requestBody,
    };
    let result;
    try {
        result = await axios(options);

        return res.status(200).json({
            data: result.data,
            orderId: orderId,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

// hàm khi thanh toán thành công (MoMo)
const paymentMoMoCallBackSuccess = async (req, res) => {
    console.log(req.body);

    return res.status(200).json(req.body);
};

// hàm kiểm tra trạng thái đơn hàng (MoMo)
const paymentMoMoCheckStatus = async (req, res) => {
    try {
        let orderId = req.body.orderId;

        //parameters
        let accessKey = "F8BBA842ECF85";
        let secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";

        let rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

        //signature
        let signature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");

        const requestBody = JSON.stringify({
            partnerCode: "MOMO",
            requestId: orderId,
            orderId: orderId,
            lang: "vi",
            signature: signature,
        });

        const options = {
            method: "POST",
            url: "https://test-payment.momo.vn/v2/gateway/api/query",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(requestBody),
            },
            data: requestBody,
        };

        try {
            let result = await axios(options);

            return res.status(200).json(result.data);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                errCode: -1,
                errMessage: "Error from server",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            errorCode: 1,
            errorMessage: "Lỗi hệ thống khi kiểm tra trạng thái thanh toán",
        });
    }
};

//----------------------------------VNPay
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

// hàm tạo ra dường link để thanh toán với VNPay
const paymentOrderVnPay = (req, res, next) => {
    const date = new Date();

    const ipAddr =
        req.headers["x-forwarded-for"] ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        req.connection?.socket?.remoteAddress ||
        "127.0.0.1";

    const tmnCode = "YFBF5RLW";
    const secretKey = "E5TFV8DFO6RQCK7IAC0PV9OUNIOKJEBQ";
    const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    const returnUrl = "https://vnpay.vn/";

    const createDate = moment(date).format("YYYYMMDDHHmmss"); // ex: 20250410173500
    const orderId = moment(date).format("DDHHmmss"); // ex: 173500

    const amount = req.body.amount;
    const bankCode = req.body.bankCode;
    const orderInfo = req.body.orderDescription;
    const orderType = req.body.orderType;
    const locale = req.body.language || "vn";

    const currCode = "VND";
    let vnp_Params = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: tmnCode,
        vnp_Locale: locale,
        vnp_CurrCode: currCode,
        vnp_TxnRef: orderId,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: orderType,
        vnp_Amount: amount * 100,
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,
    };

    // 🔐 Bước ký dữ liệu
    vnp_Params = sortObject(vnp_Params);
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    vnp_Params["vnp_SecureHash"] = signed;

    // 🔗 Tạo URL thanh toán
    const paymentUrl = vnpUrl + "?" + qs.stringify(vnp_Params, { encode: false });

    return res.status(200).json({
        result_code: 0,
        message: "Tạo URL thanh toán VNPAY thành công!",
        paymentUrl,
        orderId,
        createDate,
    });
};

const paymentVnPayCheckStatus = async (req, res) => {
    console.log(req.body.orderId);
    console.log(req.body.transDate);
    try {
        const date = new Date();

        const vnp_TmnCode = "YFBF5RLW";
        const secretKey = "E5TFV8DFO6RQCK7IAC0PV9OUNIOKJEBQ";
        const vnp_Api = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";

        const vnp_TxnRef = req.body.orderId;
        const vnp_TransactionDate = req.body.transDate;

        const vnp_RequestId = moment(date).format("HHmmss");
        const vnp_Version = "2.1.0";
        const vnp_Command = "querydr";
        const vnp_OrderInfo = "Truy van GD ma:" + vnp_TxnRef;

        const vnp_IpAddr =
            req.headers["x-forwarded-for"] ||
            req.connection?.remoteAddress ||
            req.socket?.remoteAddress ||
            req.connection?.socket?.remoteAddress ||
            "127.0.0.1";

        const vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss");

        const dataToHash = [
            vnp_RequestId,
            vnp_Version,
            vnp_Command,
            vnp_TmnCode,
            vnp_TxnRef,
            vnp_TransactionDate,
            vnp_CreateDate,
            vnp_IpAddr,
            vnp_OrderInfo,
        ].join("|");

        const hmac = crypto.createHmac("sha512", secretKey);
        const vnp_SecureHash = hmac.update(Buffer.from(dataToHash, "utf-8")).digest("hex");

        const requestData = {
            vnp_RequestId,
            vnp_Version,
            vnp_Command,
            vnp_TmnCode,
            vnp_TxnRef,
            vnp_OrderInfo,
            vnp_TransactionDate,
            vnp_CreateDate,
            vnp_IpAddr,
            vnp_SecureHash,
        };

        const response = await axios.post(vnp_Api, requestData, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        return res.status(200).json({
            success: true,
            data: response.data,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi gửi yêu cầu đến VNPAY",
            error: error.response?.data || error.message,
        });
    }
};

module.exports = {
    paymentOrderZalopay,
    paymentZaloPayCallBackSuccess,
    paymentZaloPayCheckStatus,

    paymentOrderMoMo,
    paymentMoMoCallBackSuccess,
    paymentMoMoCheckStatus,

    paymentOrderVnPay,
    paymentVnPayCheckStatus,
};
