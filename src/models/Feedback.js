"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Feedback extends Model {
        static associate(models) {
            Feedback.belongsTo(models.Customer, { foreignKey: "FK_iKhachHangID", as: "customer" }); //done
        }
    }

    Feedback.init(
        {
            PK_iPhanHoiID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            FK_iKhachHangID: DataTypes.INTEGER,
            sNoiDungPhanHoi: DataTypes.TEXT,
            dThoiGianGui: DataTypes.DATE,
            sTrangThaiXuLy: DataTypes.STRING,
        },
        { sequelize, modelName: "Feedback" }
    );
    return Feedback;
};
