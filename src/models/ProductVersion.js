"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class ProductVersion extends Model {
        static associate(models) {
            ProductVersion.belongsTo(models.Product, { foreignKey: "FK_iSanPhamID", as: "product" });
            ProductVersion.hasMany(models.ProductImage, { foreignKey: "FK_iPhienBanID", as: "images" });
            ProductVersion.hasMany(models.OrderDetail, { foreignKey: "FK_iPhienBanID", as: "orderDetails" });
            ProductVersion.hasMany(models.ImportReceiptDetail, { foreignKey: "FK_iPhienBanID", as: "importDetails" });
            ProductVersion.hasMany(models.CartDetail, { foreignKey: "FK_iPhienBanID", as: "cartDetails" });
            ProductVersion.hasMany(models.Warranty, { foreignKey: "FK_iPhienBanID", as: "warranties" });
        }
    }

    ProductVersion.init(
        {
            PK_iPhienBanID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            FK_iSanPhamID: DataTypes.INTEGER,
            sMauSac: DataTypes.STRING,
            sDungLuong: DataTypes.STRING,
            fGiaBan: DataTypes.FLOAT,
            iSoLuong: DataTypes.INTEGER,
            bTrangThai: DataTypes.BOOLEAN,
        },
        { sequelize, modelName: "ProductVersion" }
    );
    return ProductVersion;
};
