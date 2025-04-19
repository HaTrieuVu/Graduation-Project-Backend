"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class ProductParameter extends Model {
        static associate(models) {
            ProductParameter.belongsTo(models.Product, {
                foreignKey: "FK_iSanPhamID",
                as: "product",
            });
        }
    }

    ProductParameter.init(
        {
            PK_iThongSoID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            FK_iSanPhamID: { type: DataTypes.INTEGER, allowNull: false, unique: true },
            sHeDieuHanh: DataTypes.STRING,
            sCPU: DataTypes.STRING,
            sTocDoCPU: DataTypes.STRING,
            sGPU: DataTypes.STRING,
            sRAM: DataTypes.STRING,
            sCameraSau: DataTypes.STRING,
            sCameraTruoc: DataTypes.STRING,
            sManHinh: DataTypes.STRING,
            sPin: DataTypes.STRING,
            sLoaiPin: DataTypes.STRING,
            sSac: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "ProductParameter",
            tableName: "product_parameters",
        }
    );

    return ProductParameter;
};
