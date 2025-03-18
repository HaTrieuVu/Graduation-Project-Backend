"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
            Product.belongsTo(models.Category, { foreignKey: "FK_iDanhMucID", as: "categoryData" }); //done
            Product.belongsTo(models.Brand, { foreignKey: "FK_iNhanHangID", as: "brandData" }); //done

            Product.hasMany(models.ProductVersion, { foreignKey: "FK_iSanPhamID", as: "versions" }); //done
        }
    }

    Product.init(
        {
            PK_iSanPhamID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            FK_iDanhMucID: DataTypes.INTEGER,
            FK_iNhanHangID: DataTypes.INTEGER,
            sTenSanPham: DataTypes.STRING,
            sMoTa: DataTypes.TEXT,
            sDanhGia: DataTypes.STRING,
            sTinhTrangSanPham: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Product",
        }
    );

    return Product;
};
