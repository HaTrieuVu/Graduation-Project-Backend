"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class OrderDetail extends Model {
        static associate(models) {
            OrderDetail.belongsTo(models.Order, { foreignKey: "FK_iDonMuaHangID", as: "order" }); //done
            OrderDetail.belongsTo(models.ProductVersion, { foreignKey: "FK_iPhienBanID", as: "productVersion" }); //done
        }
    }
    OrderDetail.init(
        {
            PK_iChiTietDonHangID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            FK_iDonMuaHangID: DataTypes.INTEGER,
            FK_iPhienBanID: DataTypes.INTEGER,
            iSoLuong: DataTypes.INTEGER,
            fGiaBan: DataTypes.FLOAT,
            fThanhTien: DataTypes.FLOAT,
        },
        { sequelize, modelName: "OrderDetail" }
    );
    return OrderDetail;
};
