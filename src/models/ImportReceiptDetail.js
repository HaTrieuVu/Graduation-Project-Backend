"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class ImportReceiptDetail extends Model {
        static associate(models) {
            ImportReceiptDetail.belongsTo(models.ImportReceipt, { foreignKey: "FK_iPhieuNhapID", as: "importReceipt" }); //done
            ImportReceiptDetail.belongsTo(models.Product, { foreignKey: "FK_iSanPhamID", as: "product" }); //done
        }
    }
    ImportReceiptDetail.init(
        {
            PK_iChiTietPhieuNhapID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            FK_iPhieuNhapID: DataTypes.INTEGER,
            FK_iSanPhamID: DataTypes.INTEGER,
            iSoLuongNhap: DataTypes.INTEGER,
            fGiaNhap: DataTypes.FLOAT,
        },
        { sequelize, modelName: "ImportReceiptDetail" }
    );
    return ImportReceiptDetail;
};
