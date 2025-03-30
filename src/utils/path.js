// các path mà nhân viên có quyền
const rolesEmployee = [
    {
        url: "/manage-product/get-all",
    },
    {
        url: "/manage-supplier/get-all",
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
    "/order/order-product",
    "/notification/get-info",
    "/notification/delete-notify",
];

module.exports = {
    rolesEmployee,
    rolesCustomer,
    authenticatedPaths,
};
