"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Customer extends Model {
        static associate(models) {
            Customer.hasMany(models.Order, { foreignKey: "FK_iKhachHangID", as: "orders" }); //done;
            Customer.hasMany(models.Feedback, { foreignKey: "FK_iKhachHangID", as: "feedbacks" }); //done
            // Customer.hasMany(models.Warranty, { foreignKey: "FK_iKhachHangID", as: "warranties" }); //done
            Customer.hasMany(models.Notification, { foreignKey: "FK_iKhachHangID", as: "notifications" }); //done
            Customer.hasOne(models.Cart, { foreignKey: "FK_iKhachHangID", as: "carts" }); //done

            Customer.belongsTo(models.Role, { foreignKey: "FK_iQuyenHanID", as: "role" });
        }
    }
    Customer.init(
        {
            PK_iKhachHangID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            FK_iQuyenHanID: DataTypes.INTEGER,
            sHoTen: DataTypes.STRING,
            sEmail: DataTypes.STRING,
            sSoDienThoai: DataTypes.STRING,
            sDiaChi: DataTypes.STRING,
            sTenDangNhap: DataTypes.STRING,
            sMatKhau: DataTypes.STRING,
            sAvatar: DataTypes.STRING,
            bTrangThaiTaiKhoan: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: "Customer",
        }
    );
    return Customer;
};
