"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Notification extends Model {
        static associate(models) {
            Notification.belongsTo(models.Customer, { foreignKey: "FK_iKhachHangID", as: "customer" }); //done
            Notification.belongsTo(models.Order, { foreignKey: "FK_iDonMuaHangID", as: "order" }); //done
        }
    }
    Notification.init(
        {
            PK_iThongBaoID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            FK_iKhachHangID: DataTypes.INTEGER,
            FK_iDonMuaHangID: DataTypes.INTEGER,
            sNoiDung: DataTypes.STRING,
            dThoiGianGui: DataTypes.DATE,
            sTrangThaiDoc: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: "Notification",
        }
    );
    return Notification;
};
