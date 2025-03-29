"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Warranty extends Model {
        static associate(models) {
            Warranty.belongsTo(models.ProductVersion, { foreignKey: "FK_iPhienBanID", as: "productVersion" }); //done
            Warranty.belongsTo(models.Order, { foreignKey: "FK_iDonMuaHangID", as: "order" }); //done
        }
    }

    Warranty.init(
        {
            PK_iPhieuBaoHanhID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            FK_iDonMuaHangID: DataTypes.INTEGER,
            FK_iPhienBanID: DataTypes.INTEGER,
            dNgayLap: DataTypes.DATE,
            dNgayKetThucBaoHanh: DataTypes.DATE,
            sTrangThaiXuLy: DataTypes.STRING,
            sMota: DataTypes.STRING,
        },
        { sequelize, modelName: "Warranty" }
    );
    return Warranty;
};
