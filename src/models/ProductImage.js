"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class ProductImage extends Model {
        static associate(models) {
            ProductImage.belongsTo(models.Product, { foreignKey: "FK_iSanPhamID", as: "product" }); // Hình ảnh thuộc về một sản phẩm

            ProductImage.hasMany(models.ProductVersion, { foreignKey: "FK_iHinhAnhID", as: "warranties" });
        }
    }

    ProductImage.init(
        {
            PK_iHinhAnhID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            FK_iSanPhamID: DataTypes.INTEGER,
            sUrl: DataTypes.STRING,
            sMoTa: DataTypes.STRING,
        },
        { sequelize, modelName: "ProductImage", tableName: "product_images" }
    );
    return ProductImage;
};
