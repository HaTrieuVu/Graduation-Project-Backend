"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
            Product.belongsTo(models.Category, { foreignKey: "FK_iDanhMucID", as: "categoryData" }); //done
            Product.belongsTo(models.Brand, { foreignKey: "FK_iNhanHangID", as: "brandData" }); //done

            Product.hasMany(models.OrderDetail, { foreignKey: "FK_iSanPhamID", as: "orderDetails" }); //done
            Product.hasMany(models.SupplierProduct, { foreignKey: "FK_iSanPhamID", as: "supplierProducts" }); //done
            Product.hasMany(models.ImportReceiptDetail, { foreignKey: "FK_iSanPhamID", as: "importDetails" }); //done
            Product.hasMany(models.ProductReview, { foreignKey: "FK_iSanPhamID", as: "reviews" }); //done
            Product.hasOne(models.Promotion, { foreignKey: "FK_iSanPhamID", as: "promotion" }); //done
            Product.hasMany(models.CartDetail, { foreignKey: "FK_iSanPhamID", as: "orderDetails" }); //done
        }
    }

    Product.init(
        {
            PK_iSanPhamID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            FK_iDanhMucID: DataTypes.INTEGER,
            FK_iNhanHangID: DataTypes.INTEGER,
            sTenSanPham: DataTypes.STRING,
            sHinhAnh: DataTypes.STRING,
            iSoLuong: DataTypes.INTEGER,
            fGiaBan: DataTypes.FLOAT,
            sMoTa: DataTypes.TEXT,
            sDanhGia: DataTypes.STRING,
            sTinhTrangSanPham: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Product",
            freezeTableName: true,
        }
    );

    return Product;
};
