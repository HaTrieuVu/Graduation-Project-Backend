"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Warranty extends Model {
        static associate(models) {
            Warranty.belongsTo(models.Customer, { foreignKey: "FK_iKhachHangID", as: "customer" }); //done
            Warranty.belongsTo(models.Order, { foreignKey: "FK_iDonMuaHangID", as: "order" }); //done
        }
    }

    Warranty.init(
        {
            PK_iPhieuBaoHanhID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            FK_iDonMuaHangID: DataTypes.INTEGER,
            FK_iKhachHangID: DataTypes.INTEGER,
            dNgayGuiYeuCau: DataTypes.DATE,
            sTrangThaiXuLy: DataTypes.STRING,
            sMota: DataTypes.STRING,
        },
        { sequelize, modelName: "Warranty" }
    );
    return Warranty;
};
