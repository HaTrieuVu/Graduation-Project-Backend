"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
            Product.belongsTo(models.Category, { foreignKey: "FK_iDanhMucID", as: "categoryData" }); //done
            Product.belongsTo(models.Brand, { foreignKey: "FK_iNhanHangID", as: "brandData" }); //done
            Product.hasMany(models.ProductVersion, { foreignKey: "FK_iSanPhamID", as: "versions" }); // Một sản phẩm có nhiều phiên bản
            Product.hasMany(models.ProductImage, { foreignKey: "FK_iSanPhamID", as: "images" }); // Một sản phẩm có nhiều hình ảnh
            Product.hasOne(models.Promotion, { foreignKey: "FK_iSanPhamID", as: "promotion" }); // Một sản phẩm có một khuyến mãi
            Product.hasMany(models.SupplierProduct, { foreignKey: "FK_iSanPhamID", as: "suppliers" }); // Một sản phẩm có nhiều nhà cung cấp
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
