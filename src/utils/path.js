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

module.exports = {
    rolesEmployee,
    rolesCustomer,
};
