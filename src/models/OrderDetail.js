"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class OrderDetail extends Model {
        static associate(models) {
            OrderDetail.belongsTo(models.Order, { foreignKey: "FK_iDonMuaHangID", as: "order" }); //done
            OrderDetail.belongsTo(models.Product, { foreignKey: "FK_iSanPhamID", as: "product" }); //done
            OrderDetail.hasOne(models.ProductReview, { foreignKey: "FK_iChiTietDonHangID", as: "review" }); //done
        }
    }
    OrderDetail.init(
        {
            PK_iChiTietDonHangID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            FK_iDonMuaHangID: DataTypes.INTEGER,
            FK_iSanPhamID: DataTypes.INTEGER,
            iSoLuong: DataTypes.INTEGER,
        },
        { sequelize, modelName: "OrderDetail", freezeTableName: true }
    );
    return OrderDetail;
};
