"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.Customer, { foreignKey: "FK_iKhachHangID", as: "customer" }); //done
            Order.belongsTo(models.Employee, { foreignKey: "FK_iNhanVienID", as: "employee" }); //done

            Order.hasMany(models.OrderDetail, { foreignKey: "FK_iDonMuaHangID", as: "orderDetails" }); //done
            Order.hasMany(models.Warranty, { foreignKey: "FK_iDonMuaHangID", as: "warranties" }); //done
        }
    }
    Order.init(
        {
            PK_iDonMuaHangID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            FK_iNhanVienID: DataTypes.INTEGER,
            FK_iKhachHangID: DataTypes.INTEGER,
            dNgayLapDon: DataTypes.DATE,
            fTongTien: DataTypes.FLOAT,
            sPhuongThucThanhToan: DataTypes.STRING,
            sTrangThaiDonHang: DataTypes.STRING,
            dNgayGiaoHang: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: "Order",
        }
    );
    return Order;
};
