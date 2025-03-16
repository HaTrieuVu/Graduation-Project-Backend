import db from "../models/index";

// check email ncc tồn tại chưa
const checkEmailExist = async (supplierEmail) => {
    let supplier = await db.Supplier.findOne({
        where: { sEmail: supplierEmail },
    });

    if (supplier) {
        return true;
    }

    return false;
};

// check sđt ncc tồn tại chưa
const checkPhoneExist = async (supplierPhone) => {
    let supplier = await db.Supplier.findOne({
        where: { sSoDienThoai: supplierPhone },
    });

    if (supplier) {
        return true;
    }

    return false;
};

// lấy ncc theo phân trang
const getSupplierWithPagination = async (page, limit) => {
    try {
        let offSet = (page - 1) * limit;
        const { count, rows } = await db.Supplier.findAndCountAll({
            // include: {
            //     model: db.SupplierProduct,
            //     as: "suppliers",
            // },
            offset: offSet,
            limit: limit,
            raw: true,
            nest: true,
        });

        let totalPage = Math.ceil(count / limit);
        let data = {
            totalRows: count, //tổng có tất cả bao nhiêu bản ghi
            totalPage: totalPage,
            suppliers: rows,
        };

        return {
            errorCode: 0,
            errorMessage: "Danh sách nhà cung cấp!",
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

//thêm mới nhà cung cấp
const createNewSupplierService = async (data) => {
    try {
        // check email/phoneNumber
        let isEmailExist = await checkEmailExist(data.email);
        let isPhoneExist = await checkPhoneExist(data.phoneNumber);
        if (isEmailExist === true) {
            return {
                errorCode: 1,
                errorMessage: "Email ncc đã tồn tại!",
            };
        }
        if (isPhoneExist === true) {
            return {
                errorCode: 1,
                errorMessage: "Số điện thoại ncc đã tồn tại!",
            };
        }

        await db.Supplier.create({
            sTenNhaCungCap: data.nameSupplier,
            sEmail: data.email,
            sSoDienThoai: data.phoneNumber,
            sDiaChi: data.address,
        });

        return {
            errorCode: 0,
            errorMessage: "Thêm mới ncc thành công!",
            data: [],
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

//cập nhật thông tin ncc
const updateSupplierService = async (data) => {
    try {
        let supplier = await db.Supplier.findOne({
            where: { PK_iNhaCungCapID: data.id },
        });
        if (supplier) {
            await supplier.update({
                sTenNhaCungCap: data.nameSupplier,
                sEmail: data.email,
                sSoDienThoai: data.phoneNumber,
                sDiaChi: data.address,
            });
            return {
                errorCode: 0,
                errorMessage: "Cập nhật thông tin ncc thành công!",
                data: [],
            };
        } else {
            return {
                errorCode: -1,
                errorMessage: "NCC không tồn tại!",
                data: [],
            };
        }
    } catch (error) {
        console.log(error);
        return {
            errorCode: 1,
            errorMessage: "Đã xảy ra lỗi - service!",
            data: [],
        };
    }
};

//xóa ncc
const deleteSupplierService = async (id) => {
    try {
        let supplier = await db.Supplier.findOne({
            where: { PK_iNhaCungCapID: id },
        });

        if (supplier) {
            await supplier.destroy();
            return {
                errorCode: 0,
                errorMessage: "Xóa ncc thành công!",
                data: [],
            };
        } else {
            return {
                errorCode: -1,
                errorMessage: "Ncc không tồn tại",
                data: [],
            };
        }
    } catch (error) {
        console.log(error);
        return {
            errorCode: 1,
            errorMessage: "Đã xảy ra lỗi - service!",
            data: [],
        };
    }
};

module.exports = {
    getSupplierWithPagination,
    createNewSupplierService,
    updateSupplierService,
    deleteSupplierService,
};
