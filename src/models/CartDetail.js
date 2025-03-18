"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class CartDetail extends Model {
        static associate(models) {
            CartDetail.belongsTo(models.Cart, { foreignKey: "FK_iGioHangID", as: "carts" }); //done
            CartDetail.belongsTo(models.ProductVersion, { foreignKey: "FK_iPhienBanID", as: "productVersions" }); //done
        }
    }
    CartDetail.init(
        {
            PK_iChiTietGioHangID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            FK_iGioHangID: DataTypes.INTEGER,
            FK_iPhienBanID: DataTypes.INTEGER,
            iSoLuong: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "CartDetail",
        }
    );
    return CartDetail;
};
