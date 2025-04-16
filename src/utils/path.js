// các path mà nhân viên có quyền
const rolesEmployee = [
    {
        url: "/manage-product/get-all",
    },
    {
        url: "/manage-supplier/get-all",
    },
    {
        url: "/manage-order/get-orders-by-status",
    },
    {
        url: "/manage-order/update",
    },
    {
        url: "/manage-import-receipt/get-all",
    },
    {
        url: "/manage-import-receipt/create",
    },
];

//các path mà người dùng (kh) có quyền
const rolesCustomer = [
    {
        url: "/cart/get-info",
    },
    {
        url: "/cart/add-to-cart",
    },
];

// các đường dẫn mà đăng nhập rồi mới được quy cập, k phân quyền
const authenticatedPaths = [
    "/product-single",
    "/products/search",
    "/feedback/send",
    "/cart/add-to-cart",
    "/cart/get-info-to-cart",
    "/cart/toggle-cart-quantity",
    "/cart/remove-produt-from-cart",
    "/logout",
    "/user/get-info",
    "/user/update-profile",
    "/user/change-password",
    "/order/order-product",
    "/order/cancel-order",
    "/order/check-stock",
    "/notification/get-info",
    "/notification/delete-notify",

    "/payment-zalo-pay/order",
    "/payment-zalo-pay/callback-success",
    "/payment-zalo-pay/check-status",

    "/payment-momo/order",
    "/payment-momo/callback-success",
    "/payment-momo/check-status",

    "/payment-vnpay/order",
    "/payment-vnpay/check-status",

    "/order/get-all-purchase",

    "/user/send-feedback",
];

module.exports = {
    rolesEmployee,
    rolesCustomer,
    authenticatedPaths,
};
