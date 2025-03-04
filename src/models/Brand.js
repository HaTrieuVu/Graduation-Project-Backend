"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Brand extends Model {
        static associate(models) {
            Brand.hasMany(models.Product, { foreignKey: "FK_iNhanHangID", as: "products" }); //done
        }
    }
    Brand.init(
        {
            PK_iNhanHangID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            sTenNhanHang: DataTypes.STRING,
            sLogo: DataTypes.STRING,
            sMoTa: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Brand",
        }
    );
    return Brand;
};
