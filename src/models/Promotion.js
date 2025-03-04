"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Promotion extends Model {
        static associate(models) {
            Promotion.belongsTo(models.Product, { foreignKey: "FK_iSanPhamID", as: "product" }); //done
        }
    }

    Promotion.init(
        {
            PK_iKhuyenMaiID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            FK_iSanPhamID: DataTypes.INTEGER,
            sMoTa: DataTypes.TEXT,
            fGiaTriKhuyenMai: DataTypes.FLOAT,
            bTrangThai: DataTypes.BOOLEAN,
        },
        { sequelize, modelName: "Promotion" }
    );
    return Promotion;
};
