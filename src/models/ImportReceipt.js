"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class ImportReceipt extends Model {
        static associate(models) {
            ImportReceipt.belongsTo(models.Employee, { foreignKey: "FK_iNhanVienID", as: "employee" }); //done
            ImportReceipt.belongsTo(models.Supplier, { foreignKey: "FK_iNhaCungCapID", as: "supplier" }); //done
            ImportReceipt.hasMany(models.ImportReceiptDetail, { foreignKey: "FK_iPhieuNhapID", as: "importDetails" }); //done
        }
    }
    ImportReceipt.init(
        {
            PK_iPhieuNhapID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            FK_iNhanVienID: DataTypes.INTEGER,
            FK_iNhaCungCapID: DataTypes.INTEGER,
            dNgayLap: DataTypes.DATE,
            sGhiChu: DataTypes.STRING,
        },
        { sequelize, modelName: "ImportReceipt", tableName: "import_receipts" }
    );
    return ImportReceipt;
};
