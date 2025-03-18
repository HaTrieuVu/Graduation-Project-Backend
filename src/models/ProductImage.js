"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class ProductImage extends Model {
        static associate(models) {
            ProductImage.belongsTo(models.ProductVersion, { foreignKey: "FK_iPhienBanID", as: "productVersion" });
        }
    }

    ProductImage.init(
        {
            PK_iHinhAnhID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            FK_iPhienBanID: DataTypes.INTEGER,
            sUrl: DataTypes.STRING,
            sMoTa: DataTypes.STRING,
        },
        { sequelize, modelName: "ProductImage" }
    );
    return ProductImage;
};
